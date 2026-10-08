// Destination loads never wait for the optional pack or another level's queue.
(function () {
  const states = new WeakMap();
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
      // Include complete authored companion/effect animations for gameplay,
      // but do not fetch the scenery belonging to every other level.
      const actor = level >= 1 && !/^(Background|BackRandomTest|SPbackground|Panet_|Planet_)/.test(object.name);
      if (data.objects.includes(object) || names.has(object.name) || actor || /Preview|Button|Label/.test(object.name)) collect(object);
    }
    return [...resources].filter(name => loader._resources.get(name)?.kind !== 'audio');
  }
  function startOptionalPack(loader, state) {
    if (state.packStarted) return;
    state.packStarted = true;
    const file = loader.getRuntimeGame().getGameData().headnautDeferredImagePack;
    if (!file) return;
    const script = document.createElement('script');
    script.src = file;
    script.onload = () => {
      for (const [name, url] of Object.entries(window.headnautDeferredImageUrls || {})) {
        const resource = loader._resources.get(name);
        // Preserve cache keys for images already loaded or loading.
        if (resource && !state.loading.has(name) && !loader._imageManager._loadedTextures.get(resource)) resource.file = url;
      }
      delete window.headnautDeferredImageUrls;
    };
    document.head.appendChild(script);
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
          pending = (async () => { await loader._loadResource(resource); await loader._processResource(resource); })();
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
    const state = {ready: new Set(), loading: new Map(), packStarted: false};
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
    startOptionalPack(this, state);
  };
  prototype.loadAndProcessSceneResources = async function (sceneName, progress) {
    const state = states.get(this);
    if (!state) return loadScene.call(this, sceneName, progress);
    const key = keyFor(this.getRuntimeGame(), sceneName);
    if (state.ready.has(key)) return;
    startOptionalPack(this, state);
    this.currentLoadingSceneName = sceneName;
    try {
      await ensureResources(this, state, requiredResources(this, sceneName), async (done, total) => {
        this.currentSceneLoadingProgress = total ? done / total : 1;
        await progress?.(done, total);
      });
      state.ready.add(key);
      this._setSceneAssetsLoaded(sceneName);
      this._setSceneAssetsReady(sceneName);
    } finally { this.currentLoadingSceneName = ''; }
  };
  prototype.loadSceneResources = function (sceneName, progress) {
    return states.has(this) ? this.loadAndProcessSceneResources(sceneName, progress) : preloadScene.call(this, sceneName, progress);
  };
})();
