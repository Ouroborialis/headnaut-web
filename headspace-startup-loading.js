// Destination loads never wait for the optional pack or another level's queue.
(function () {
  const states = new WeakMap();
  const packedArtwork = new Map();
  const prototype = gdjs.ResourceLoader.prototype;
  const loadFirst = prototype.loadGlobalAndFirstSceneResources;
  const loadBackground = prototype.loadAllSceneInBackground;
  const areReady = prototype.areSceneAssetsReady;
  const loadScene = prototype.loadAndProcessSceneResources;
  const preloadScene = prototype.loadSceneResources;
  const textureFrom = PIXI.Texture.from;
  PIXI.Texture.from = function (source, ...options) {
    if (typeof source === 'string' && !source.startsWith('data:')) {
      const query = source.indexOf('?');
      const base = query < 0 ? source : source.slice(0, query);
      if (window.headSpaceGame?.getVariables().get('CurrentLevel').getAsNumber() === 0.5 && packedArtwork.has(base)) return packedArtwork.get(base);
      const replacement = gdjs.projectData?.headnautTextureUrlMap?.[base];
      if (replacement) source = replacement + (query < 0 ? '' : source.slice(query));
    }
    return textureFrom.call(this, source, ...options);
  };
  const keyFor = (game, sceneName) => `${sceneName}:${game.getVariables().get('MultiplayerMode').getAsBoolean()}:${game.getVariables().get('CurrentLevel').getAsNumber()}`;
  function requiredResources(loader, sceneName) {
    const game = loader.getRuntimeGame(), data = game.getGameData();
    const scene = data.layouts.find(layout => layout.name === sceneName);
    if (!scene) throw new Error(`Unknown scene ${sceneName}`);
    if (sceneName !== 'Game') return [...new Set([...loader._globalResources, ...loader._sceneResources.get(sceneName)])];
    const level = game.getVariables().get('CurrentLevel').getAsNumber();
    const layout = data.externalLayouts.find(layout => layout.name === `Level ${level}`);
    const names = new Set([...scene.instances, ...(layout?.instances || [])].map(instance => instance.name));
    const resources = new Set(loader._globalResources);
    const collect = value => {
      if (typeof value === 'string' && loader._resources.has(value)) resources.add(value);
      else if (value && typeof value === 'object') Object.values(value).forEach(collect);
    };
    for (const object of [...data.objects, ...scene.objects]) {
      if (level === 0 && object.name === 'Background_UNTILED_1') continue;
      // Include dynamically created gameplay actors and companions, without
      // fetching the export's unused animation library or other levels' scenery.
      const actor = level >= 1 && /^(Player|Enemy|SmartEnemy|EmittedMaterial|Asteroid|Walls|Message|Light|BACKstars|InternalFloaties|PropulsionJet)/.test(object.name);
      if (data.objects.includes(object) || names.has(object.name) || actor || /Preview|Button|Label/.test(object.name)) collect(object);
    }
    return [...resources].filter(name => loader._resources.get(name)?.kind !== 'audio');
  }
  async function loadDestinationPack(loader, state, level = loader.getRuntimeGame().getVariables().get('CurrentLevel').getAsNumber()) {
    const game = loader.getRuntimeGame();
    const file = game.getGameData().headnautResourcePacks?.[level];
    if (!file) return;
    if (!state.packs.has(file)) state.packs.set(file, (async () => {
      const response = await fetch(loader.getFullUrl(file), {signal: AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error(`Image pack HTTP ${response.status}`);
      const images = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).json();
      for (const [name, url] of Object.entries(images.resources)) {
        const resource = loader._resources.get(name);
        // Preserve cache keys for images already loaded or loading.
        if (resource && !state.loading.has(name) && !loader._imageManager._loadedTextures.get(resource)) resource.file = url;
      }
      await Promise.all(Object.entries(images.artwork).map(async ([name, image]) => {
        const texture = textureFrom.call(PIXI.Texture, image.url);
        if (!texture.baseTexture.valid) await texture.baseTexture.resource.load();
        packedArtwork.set(name, new PIXI.Texture(texture.baseTexture, texture.frame.clone(), new PIXI.Rectangle(0, 0, image.width, image.height)));
      }));
    })());
    try { await state.packs.get(file); }
    catch (error) { state.packs.delete(file); console.warn('Using individual images after pack failure', error); }
  }
  async function loadDestinationArtwork(loader) {
    const game = loader.getRuntimeGame();
    const urls = game.getGameData().headnautDestinationArtwork?.[game.getVariables().get('CurrentLevel').getAsNumber()] || [];
    await Promise.all(urls.map(async url => {
      const texture = PIXI.Texture.from(url);
      if (!texture.baseTexture.valid) await texture.baseTexture.resource.load();
    }));
  }
  async function ensureResources(loader, state, names, progress) {
    let next = 0, completed = 0;
    await progress?.(0, names.length);
    async function worker() {
      while (next < names.length) {
        const name = names[next++], resource = loader._resources.get(name);
        if (!resource) continue;
        let pending = state.loading.get(name);
        if (!pending) {
          pending = (async () => {
            const size = loader.getRuntimeGame().getGameData().headnautHiddenImages?.[name];
            if (size) {
              // Preserve the native dimensions without fetching art hidden by the runtime.
              const texture = PIXI.RenderTexture.create({width:size[0],height:size[1]});
              loader._imageManager._loadedTextures.set(resource, texture);
            } else { await loader._loadResource(resource); await loader._processResource(resource); }
          })();
          state.loading.set(name, pending);
          pending.catch(() => state.loading.delete(name));
        }
        await pending;
        await progress?.(++completed, names.length);
      }
    }
    await Promise.all(Array.from({length: Math.min(12, names.length)}, worker));
  }
  prototype.loadGlobalAndFirstSceneResources = async function (sceneName, progress) {
    const game = this.getRuntimeGame();
    if (sceneName !== 'Game' || new URLSearchParams(location.search).has('level') || game.getVariables().get('MultiplayerMode').getAsBoolean() ||
        game.getVariables().get('CurrentLevel').getAsNumber() !== 0) return loadFirst.call(this, sceneName, progress);
    const state = {ready: new Set(), loading: new Map(), packs: new Map()};
    states.set(this, state);
    const key = keyFor(game, sceneName);
    await ensureResources(this, state, requiredResources(this, sceneName), progress);
    state.ready.add(key);
    this._setSceneAssetsLoaded(sceneName);
    this._setSceneAssetsReady(sceneName);
  };
  prototype.areSceneAssetsReady = function (sceneName) {
    const state = states.get(this);
    return state ? state.ready.has(keyFor(this.getRuntimeGame(), sceneName)) : areReady.call(this, sceneName);
  };
  prototype.loadAllSceneInBackground = async function () {
    const state = states.get(this);
    if (!state) return loadBackground.call(this);
    while (!this.getRuntimeGame().wasFirstSceneLoaded()) await new Promise(resolve => setTimeout(resolve, 16));
    // Warm the small, immediately next destination; never download all levels.
    void loadDestinationPack(this, state, 0.5);
  };
  prototype.loadAndProcessSceneResources = async function (sceneName, progress) {
    const state = states.get(this);
    if (!state) return loadScene.call(this, sceneName, progress);
    const key = keyFor(this.getRuntimeGame(), sceneName);
    if (state.ready.has(key)) return;
    this.currentLoadingSceneName = sceneName;
    this.currentSceneLoadingProgress = 0;
    try {
      if (this.getRuntimeGame().getVariables().get('CurrentLevel').getAsNumber() === 0.5) {
        await loadDestinationPack(this, state);
        await loadDestinationArtwork(this);
      } else await Promise.all([loadDestinationPack(this, state), loadDestinationArtwork(this)]);
      await ensureResources(this, state, requiredResources(this, sceneName), async (done, total) => {
        this.currentSceneLoadingProgress = total ? done / total : 1;
        await progress?.(done, total);
      });
      state.ready.add(key);
      this._setSceneAssetsLoaded(sceneName);
      this._setSceneAssetsReady(sceneName);
      if (this.getRuntimeGame().getVariables().get('CurrentLevel').getAsNumber() === 0.5) {
        setTimeout(() => loadDestinationPack(this, state, 1), 200);
      }
    } finally { this.currentLoadingSceneName = ''; }
  };
  prototype.loadSceneResources = function (sceneName, progress) {
    return states.has(this) ? this.loadAndProcessSceneResources(sceneName, progress) : preloadScene.call(this, sceneName, progress);
  };
})();
