(function (root) {
  "use strict";

  const VERSION = "20260804-6";
  const LEVEL_MIN = 1;
  const LEVEL_MAX = 12;
  const LEVEL_STATUSES = new Set(["reference", "planned", "ready"]);
  const IMPLEMENTATIONS = new Set(["legacy", "declarative"]);
  const REQUIRED_COMPONENT_PROFILES = Object.freeze({
    player: Object.freeze({ collision: "visible-silhouette", owner: "selection", layer: "actors" }),
    enemy: Object.freeze({ collision: "visible-silhouette", owner: "level", layer: "actors" }),
    planet: Object.freeze({ collision: "solid-disc", owner: "level", layer: "obstacles" }),
    blackHole: Object.freeze({ collision: "paired-portal-trigger", owner: "level", layer: "obstacles" }),
    station: Object.freeze({ collision: "station-core", owner: "level", layer: "obstacles" }),
    triexo: Object.freeze({ collision: "visible-silhouette", owner: "level", layer: "obstacles" }),
    wall: Object.freeze({ collision: "visible-segment", owner: "level", layer: "walls" }),
    disappearingWall: Object.freeze({ collision: "visible-while-active", owner: "level", layer: "walls" }),
    boost: Object.freeze({ collision: "trigger", owner: "level", layer: "effects" }),
    light: Object.freeze({ collision: "none", owner: "level", layer: "underlay" }),
  });

  const SHARED_RULES = Object.freeze({
    camera: Object.freeze({ controller: "shared-smooth-player-follow", wheelZoom: true }),
    hud: Object.freeze({ fixedToViewport: true, scalesWithWorld: false }),
    playerSelection: Object.freeze({ source: "home-or-custom-player-only", preserveOnPause: true }),
    cleanup: Object.freeze({ removePreviousLevelObjects: true, removeOrphanCompanions: true }),
    absorption: Object.freeze({ sizeBased: true, useVisibleBodySize: true }),
    enemyOutline: Object.freeze({ effect: "shared-soft-blue-glow", when: "smaller-than-player" }),
    rendering: Object.freeze({ order: ["background", "underlay", "obstacles", "walls", "actors", "effects", "hud"] }),
    lighting: Object.freeze({ sourceBelowObject: true, actorsCastShadows: true, wallsBlockLight: true }),
    navigation: Object.freeze({ pauseMultiplayerTarget: "multiplayer-selection", preserveSelection: true }),
  });

  const registry = new Map();
  const sceneState = new WeakMap();
  const factories = new Map();
  let runtimeAdapter = Object.freeze({});

  function isFiniteNumber(value) {
    return Number.isFinite(Number(value));
  }

  function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (!value || typeof value !== "object") return value;
    const result = {};
    for (const [key, item] of Object.entries(value)) result[key] = clone(item);
    return result;
  }

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
    return value;
  }

  function normalizeBounds(bounds) {
    if (!bounds) return null;
    const minX = Number(bounds.minX);
    const minY = Number(bounds.minY);
    const maxX = Number(bounds.maxX);
    const maxY = Number(bounds.maxY);
    if (![minX, minY, maxX, maxY].every(Number.isFinite)) return null;
    return { minX, minY, maxX, maxY };
  }

  function pointInsideBounds(point, bounds, padding = 0) {
    if (!bounds || !point || !isFiniteNumber(point.x) || !isFiniteNumber(point.y)) return false;
    const x = Number(point.x);
    const y = Number(point.y);
    return x >= bounds.minX + padding && x <= bounds.maxX - padding &&
      y >= bounds.minY + padding && y <= bounds.maxY - padding;
  }

  function normalizeManifest(level, manifest = {}) {
    const number = Number(level);
    const normalized = {
      id: number,
      name: `Multiplayer ${number}`,
      mode: "head-to-head",
      status: "planned",
      implementation: "declarative",
      inheritSharedRules: true,
      componentRequirements: [],
      playerSpawns: [],
      components: [],
      behaviors: SHARED_RULES,
      ...clone(manifest),
      id: number,
      behaviors: SHARED_RULES,
    };
    normalized.componentRequirements = [...(normalized.componentRequirements || [])];
    normalized.playerSpawns = [...(normalized.playerSpawns || [])];
    normalized.components = [...(normalized.components || [])];
    return normalized;
  }

  function validateManifest(manifest, options = {}) {
    const errors = [];
    const warnings = [];
    if (!manifest || typeof manifest !== "object") {
      return { valid: false, errors: ["Manifest must be an object."], warnings };
    }
    const level = Number(manifest.id);
    if (!Number.isInteger(level) || level < LEVEL_MIN || level > LEVEL_MAX) {
      errors.push(`Level id must be an integer from ${LEVEL_MIN} through ${LEVEL_MAX}.`);
    }
    if (!LEVEL_STATUSES.has(manifest.status)) errors.push(`M${level} has an invalid status.`);
    if (!IMPLEMENTATIONS.has(manifest.implementation)) errors.push(`M${level} has an invalid implementation type.`);
    if (manifest.inheritSharedRules !== true) errors.push(`M${level} must inherit the shared multiplayer rules.`);

    const requirements = new Set(manifest.componentRequirements || []);
    for (const type of requirements) {
      if (!REQUIRED_COMPONENT_PROFILES[type]) errors.push(`M${level} requires unknown component type: ${type}.`);
    }

    if (manifest.status === "planned") {
      warnings.push(`M${level} still needs a declarative layout manifest.`);
      return { valid: errors.length === 0, errors, warnings };
    }
    if (manifest.implementation === "legacy") {
      if (manifest.status !== "reference") warnings.push(`M${level} uses a legacy implementation.`);
      return { valid: errors.length === 0, errors, warnings };
    }

    const bounds = normalizeBounds(manifest.arena?.bounds);
    if (!bounds || bounds.maxX <= bounds.minX || bounds.maxY <= bounds.minY) {
      errors.push(`M${level} requires valid arena bounds.`);
    }
    if (!Array.isArray(manifest.playerSpawns) || manifest.playerSpawns.length < 1 || manifest.playerSpawns.length > 4) {
      errors.push(`M${level} requires one to four player spawns.`);
    } else if (bounds) {
      manifest.playerSpawns.forEach((spawn, index) => {
        if (!pointInsideBounds(spawn, bounds, Number(spawn.radius) || 0)) {
          errors.push(`M${level} player spawn ${index + 1} is outside the arena.`);
        }
      });
    }

    const ids = new Set();
    for (let index = 0; index < manifest.components.length; index++) {
      const definition = manifest.components[index];
      const label = `M${level} component ${index + 1}`;
      if (!definition || typeof definition !== "object") {
        errors.push(`${label} must be an object.`);
        continue;
      }
      if (!REQUIRED_COMPONENT_PROFILES[definition.type]) {
        errors.push(`${label} has unknown type: ${definition.type}.`);
        continue;
      }
      if (!definition.id || typeof definition.id !== "string") errors.push(`${label} requires a stable id.`);
      else if (ids.has(definition.id)) errors.push(`M${level} repeats component id: ${definition.id}.`);
      else ids.add(definition.id);
      if (!isFiniteNumber(definition.x) || !isFiniteNumber(definition.y)) {
        errors.push(`${label} requires finite x and y coordinates.`);
      } else if (bounds && definition.allowOutsideArena !== true && !pointInsideBounds(definition, bounds)) {
        errors.push(`${label} is outside the arena.`);
      }
      if (definition.type === "wall" || definition.type === "disappearingWall") {
        const hasSegment = isFiniteNumber(definition.length) && Number(definition.length) > 0;
        const hasEndpoints = definition.a && definition.b &&
          isFiniteNumber(definition.a.x) && isFiniteNumber(definition.a.y) &&
          isFiniteNumber(definition.b.x) && isFiniteNumber(definition.b.y);
        if (!hasSegment && !hasEndpoints) errors.push(`${label} requires a positive length or endpoints.`);
      }
      if (options.requireFactories && !factories.has(definition.type)) {
        errors.push(`${label} has no registered shared factory.`);
      }
    }
    if (manifest.components.some((item) => item?.type === "player")) {
      errors.push(`M${level} must declare players through playerSpawns, not component entries.`);
    }
    return { valid: errors.length === 0, errors, warnings };
  }

  function freezeManifest(manifest) {
    return deepFreeze(normalizeManifest(manifest.id, manifest));
  }

  function registerLevel(level, manifest) {
    const number = Number(level);
    if (!Number.isInteger(number) || number < LEVEL_MIN || number > LEVEL_MAX) {
      throw new RangeError(`Multiplayer level must be ${LEVEL_MIN}-${LEVEL_MAX}.`);
    }
    const normalized = normalizeManifest(number, manifest);
    const report = validateManifest(normalized, { requireFactories: false });
    if (!report.valid) throw new Error(report.errors.join("\n"));
    registry.set(number, freezeManifest(normalized));
    return registry.get(number);
  }

  function createLevelTemplate(level, overrides = {}) {
    const number = Number(level);
    return normalizeManifest(number, {
      name: `Multiplayer ${number}`,
      status: "planned",
      implementation: "declarative",
      componentRequirements: ["player", "enemy", "wall"],
      arena: { bounds: null },
      playerSpawns: [],
      components: [],
      ...overrides,
    });
  }

  function registerFactory(type, factory) {
    if (!REQUIRED_COMPONENT_PROFILES[type]) throw new Error(`Unknown multiplayer component: ${type}`);
    if (typeof factory !== "function") throw new TypeError(`Factory for ${type} must be a function.`);
    factories.set(type, factory);
    return factory;
  }

  function installRuntimeAdapter(adapter = {}) {
    runtimeAdapter = Object.freeze({ ...adapter });
    return runtimeAdapter;
  }

  function normalizeComponent(type, definition, result) {
    if (!result) throw new Error(`Factory ${type} did not return a component.`);
    const component = typeof result === "object" ? result : { value: result };
    return {
      id: definition.id,
      type,
      definition,
      objects: (component.objects || (component.object ? [component.object] : [])).filter(Boolean),
      update: typeof component.update === "function" ? component.update : null,
      dispose: typeof component.dispose === "function" ? component.dispose : null,
      validate: typeof component.validate === "function" ? component.validate : null,
      value: component.value ?? component,
    };
  }

  function createComponent(type, context, definition) {
    const factory = factories.get(type);
    if (!factory) throw new Error(`No shared factory registered for multiplayer component: ${type}`);
    const normalized = deepFreeze({ ...clone(definition), type, profile: REQUIRED_COMPONENT_PROFILES[type] });
    return normalizeComponent(type, normalized, factory(context, normalized));
  }

  function getCurrentLevel(runtimeScene) {
    try {
      const gameVariables = runtimeScene.getGame?.().getVariables?.();
      return Number(gameVariables?.get("CurrentLevel")?.getAsNumber?.() || 0);
    } catch (_) {
      return 0;
    }
  }

  function isMultiplayer(runtimeScene) {
    try {
      return Boolean(runtimeScene.getGame?.().getVariables?.().get("MultiplayerMode")?.getAsBoolean?.());
    } catch (_) {
      return false;
    }
  }

  function visibleObjects(runtimeScene, name) {
    return (runtimeScene.getObjects?.(name) || []).filter((object) => {
      if ((object.getWidth?.() || 0) <= 0 || (object.getHeight?.() || 0) <= 0) return false;
      return !object.isHidden?.() && (object.getOpacity?.() ?? 255) > 0;
    });
  }

  function makeContext(runtimeScene, manifest, state) {
    const context = {
      runtimeScene,
      manifest,
      state,
      shared: state.shared,
      rules: SHARED_RULES,
      profiles: REQUIRED_COMPONENT_PROFILES,
      trackDisposer: (disposer) => track(runtimeScene, disposer),
      getComponent: (id) => state.byId.get(id) || null,
    };
    return Object.freeze(context);
  }

  function enter(runtimeScene, level) {
    const number = Number(level);
    const previous = sceneState.get(runtimeScene);
    if (previous?.level === number) return previous;
    if (previous) leave(runtimeScene);
    const state = {
      level: number,
      disposers: [],
      components: [],
      byId: new Map(),
      shared: Object.create(null),
      enteredAt: Date.now(),
      lastValidationAt: 0,
      built: false,
      buildError: null,
    };
    sceneState.set(runtimeScene, state);
    runtimeScene.__headSpaceMultiplayerFrameworkState = state;
    return state;
  }

  function track(runtimeScene, disposer) {
    const state = sceneState.get(runtimeScene);
    if (state && typeof disposer === "function") state.disposers.push(disposer);
    return disposer;
  }

  function build(runtimeScene, level = getCurrentLevel(runtimeScene)) {
    const manifest = registry.get(Number(level));
    const state = enter(runtimeScene, level);
    if (state.built || state.buildError || !manifest) return state;
    if (manifest.status !== "ready" || manifest.implementation !== "declarative") {
      state.built = true;
      return state;
    }
    const manifestReport = validateManifest(manifest, { requireFactories: true });
    if (!manifestReport.valid) {
      state.buildError = manifestReport.errors.join("\n");
      return state;
    }

    const context = makeContext(runtimeScene, manifest, state);
    try {
      runtimeAdapter.beforeBuild?.(context);
      manifest.playerSpawns.forEach((spawn, index) => {
        const component = createComponent("player", context, {
          ...spawn,
          id: spawn.id || `player-${index + 1}`,
          participantIndex: index,
        });
        state.components.push(component);
        state.byId.set(component.id, component);
        if (component.dispose) track(runtimeScene, component.dispose);
      });
      for (const definition of manifest.components) {
        const component = createComponent(definition.type, context, definition);
        state.components.push(component);
        state.byId.set(component.id, component);
        if (component.dispose) track(runtimeScene, component.dispose);
      }
      runtimeAdapter.afterBuild?.(context);
      state.built = true;
    } catch (error) {
      state.buildError = String(error?.stack || error);
      console.error(`HEADNAUT failed to build multiplayer level M${level}`, error);
    }
    return state;
  }

  function leave(runtimeScene) {
    const state = sceneState.get(runtimeScene);
    if (!state) return;
    const manifest = registry.get(state.level) || null;
    const context = manifest ? makeContext(runtimeScene, manifest, state) : null;
    try { if (context) runtimeAdapter.beforeLeave?.(context); } catch (error) {
      console.warn("HEADNAUT multiplayer beforeLeave failed", error);
    }
    for (const dispose of state.disposers.splice(0).reverse()) {
      try { dispose(); } catch (error) { console.warn("HEADNAUT multiplayer cleanup failed", error); }
    }
    try { if (context) runtimeAdapter.afterLeave?.(context); } catch (error) {
      console.warn("HEADNAUT multiplayer afterLeave failed", error);
    }
    sceneState.delete(runtimeScene);
    runtimeScene.__headSpaceMultiplayerFrameworkState = null;
  }

  function validate(runtimeScene, level = getCurrentLevel(runtimeScene)) {
    const manifest = registry.get(Number(level));
    const errors = [];
    const warnings = [];
    if (!manifest) errors.push(`Level M${level} has no registered manifest.`);
    else {
      const manifestReport = validateManifest(manifest, { requireFactories: manifest.status === "ready" });
      errors.push(...manifestReport.errors);
      warnings.push(...manifestReport.warnings);
    }
    if (!runtimeScene || runtimeScene.getName?.() !== "Game") errors.push("Multiplayer level is not running in the Game scene.");
    if (!isMultiplayer(runtimeScene)) errors.push("MultiplayerMode is not enabled.");

    const players = visibleObjects(runtimeScene, "Player");
    const playerImages = visibleObjects(runtimeScene, "PlayerImage");
    const playerHelmets = visibleObjects(runtimeScene, "PlayerHelmet");
    if (!players.length && !playerImages.length && !playerHelmets.length) errors.push("No visible player or player companion exists.");
    if ((runtimeScene.getObjects?.("Player") || []).length > 4) errors.push("More than four player hosts exist.");

    const hud = root.document?.getElementById?.("headSpaceHud");
    if (!hud) errors.push("Shared HUD is missing.");
    else if (root.getComputedStyle?.(hud).position !== "fixed") errors.push("Shared HUD is not fixed to the viewport.");

    const current = sceneState.get(runtimeScene);
    if (current && current.level !== Number(level)) errors.push(`Stale M${current.level} lifecycle state survived into M${level}.`);
    if (current?.buildError) errors.push(current.buildError);
    if (manifest?.status === "ready" && manifest.implementation === "declarative" && current?.built) {
      const bounds = normalizeBounds(manifest.arena?.bounds);
      const padding = Number(manifest.arena?.spawnPadding) || 0;
      players.forEach((player, index) => {
        const point = { x: player.getCenterXInScene?.(), y: player.getCenterYInScene?.() };
        if (bounds && !pointInsideBounds(point, bounds, padding)) {
          errors.push(`Player ${index + 1} is outside the declared M${level} arena.`);
        }
      });
      for (const component of current.components) {
        if (!component.validate) continue;
        const result = component.validate();
        if (result === false) errors.push(`Component ${component.id} failed runtime validation.`);
        else if (typeof result === "string") errors.push(result);
        else if (result?.errors) errors.push(...result.errors);
        if (result?.warnings) warnings.push(...result.warnings);
      }
    }
    if (manifest && current) {
      const context = makeContext(runtimeScene, manifest, current);
      const adapterReport = runtimeAdapter.validate?.(context);
      if (adapterReport?.errors) errors.push(...adapterReport.errors);
      if (adapterReport?.warnings) warnings.push(...adapterReport.warnings);
    }

    const report = Object.freeze({
      version: VERSION,
      level: Number(level),
      status: manifest?.status || "missing",
      implementation: manifest?.implementation || "missing",
      valid: errors.length === 0,
      errors: Object.freeze([...new Set(errors)]),
      warnings: Object.freeze([...new Set(warnings)]),
      factoryTypes: Object.freeze([...factories.keys()].sort()),
      componentCount: current?.components.length || 0,
      checkedAt: Date.now(),
    });
    runtimeScene.__headSpaceMultiplayerValidation = report;
    return report;
  }

  function update(runtimeScene) {
    if (!runtimeScene || runtimeScene.getName?.() !== "Game" || !isMultiplayer(runtimeScene)) {
      if (runtimeScene) leave(runtimeScene);
      return null;
    }
    const level = getCurrentLevel(runtimeScene);
    if (level < LEVEL_MIN || level > LEVEL_MAX) return null;
    const state = build(runtimeScene, level);
    const manifest = registry.get(level);
    if (manifest && state.built && !state.buildError) {
      const context = makeContext(runtimeScene, manifest, state);
      try {
        runtimeAdapter.beforeUpdate?.(context);
        for (const component of state.components) component.update?.(context);
        runtimeAdapter.afterUpdate?.(context);
      } catch (error) {
        state.buildError = String(error?.stack || error);
        console.error(`HEADNAUT multiplayer M${level} shared update failed`, error);
      }
    }
    const now = Date.now();
    if (now - state.lastValidationAt >= 1000) {
      state.lastValidationAt = now;
      return validate(runtimeScene, level);
    }
    return runtimeScene.__headSpaceMultiplayerValidation || null;
  }

  const referenceRequirements = {
    1: ["player", "enemy", "wall", "disappearingWall", "boost"],
    2: ["player", "enemy", "wall"],
    3: ["player", "enemy", "planet", "wall", "boost"],
    4: ["player", "enemy", "planet", "station", "triexo", "wall", "disappearingWall", "light"],
  };
  const referenceNames = ["maze", "pong", "solar-orbit", "honeycomb"];
  const referenceBorderPreviews = [
    {
      viewBox: "0 0 100 64",
      paths: [
        "M38.4 4H61.6L78 20.4V43.6L61.6 60H38.4L22 43.6V20.4Z",
        "M34 24L43 15M57 15L66 24M66 40L57 49M43 49L34 40",
      ],
    },
    {
      viewBox: "0 0 100 64",
      paths: ["M8 8H92V56H8Z", "M21 22V42M79 22V42"],
    },
    {
      viewBox: "0 0 100 64",
      paths: ["M50 5A27 27 0 1 1 49.999 5"],
    },
    {
      viewBox: "0 0 100 64",
      paths: ["M45 6H55L60 15H70L75 23L70 32L75 41L70 49H60L55 58H45L40 49H30L25 41L30 32L25 23L30 15H40Z"],
    },
  ];
  for (let level = LEVEL_MIN; level <= LEVEL_MAX; level++) {
    if (level <= 4) {
      registerLevel(level, {
        name: `Multiplayer ${level}`,
        status: "reference",
        implementation: "legacy",
        implementationName: referenceNames[level - 1],
        componentRequirements: referenceRequirements[level],
        borderPreview: referenceBorderPreviews[level - 1],
      });
    } else {
      registerLevel(level, createLevelTemplate(level));
    }
  }

  const api = Object.freeze({
    version: VERSION,
    rules: SHARED_RULES,
    profiles: REQUIRED_COMPONENT_PROFILES,
    registerLevel,
    createLevelTemplate,
    validateManifest,
    getLevel: (level) => registry.get(Number(level)) || null,
    getLevels: () => Array.from(registry.values()),
    getFactoryTypes: () => [...factories.keys()].sort(),
    registerFactory,
    installRuntimeAdapter,
    createComponent,
    build,
    enter,
    track,
    leave,
    update,
    validate,
  });
  root.headSpaceMultiplayerFramework = api;

  if (root.gdjs?.registerRuntimeScenePostEventsCallback) {
    root.gdjs.registerRuntimeScenePostEventsCallback(update);
  }
})(typeof window !== "undefined" ? window : globalThis);
