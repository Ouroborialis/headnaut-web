// The Game scene contains every level. Load the home screen first, then let
// GDevelop's existing background queue and scene-transition gate load gameplay.
(function () {
  const prototype = gdjs.ResourceLoader.prototype;
  const loadFirst = prototype.loadGlobalAndFirstSceneResources;
  const loadBackground = prototype.loadAllSceneInBackground;
  prototype.loadGlobalAndFirstSceneResources = async function (sceneName, progress) {
    const game = this.getRuntimeGame();
    const params = new URLSearchParams(location.search);
    if (sceneName !== 'Game' || params.has('level') || params.has('multiplayer') || params.has('capture') ||
        game.getVariables().get('CurrentLevel').getAsNumber() !== 0 ||
        game.getVariables().get('MultiplayerMode').getAsBoolean()) {
      return loadFirst.call(this, sceneName, progress);
    }
    const data = game.getGameData();
    const scene = data.layouts.find(layout => layout.name === sceneName);
    const menu = data.externalLayouts.find(layout => layout.name === 'Level 0');
    if (!scene || !menu) return loadFirst.call(this, sceneName, progress);
    const objectNames = new Set([...scene.instances, ...menu.instances].map(instance => instance.name));
    const resourceNames = new Set(this._globalResources);
    const collect = value => {
      if (typeof value === 'string' && this._resources.has(value)) resourceNames.add(value);
      else if (value && typeof value === 'object') Object.values(value).forEach(collect);
    };
    for (const object of [...data.objects, ...scene.objects]) {
      if (data.objects.includes(object) || objectNames.has(object.name) || /Preview|Button|Label/.test(object.name)) collect(object);
    }
    for (const resource of this._resources.values()) {
      if (resource.kind === 'font') resourceNames.add(resource.name);
    }
    const fullList = this._sceneResources.get(sceneName);
    this._sceneResources.set(sceneName, [...resourceNames]);
    try {
      await loadFirst.call(this, sceneName, progress);
      this._headnautDeferredScene = sceneName;
    } finally {
      this._sceneResources.set(sceneName, fullList);
    }
  };
  prototype.loadAllSceneInBackground = async function () {
    const deferredScene = this._headnautDeferredScene;
    if (deferredScene) {
      const game = this.getRuntimeGame();
      // Allow the initial scene to be created with its ready menu assets before
      // marking the full scene pending. Subsequent scene changes use the native
      // loading screen until its gameplay assets are fully processed.
      while (!game.wasFirstSceneLoaded()) await new Promise(resolve => setTimeout(resolve, 16));
      this._sceneNamesToLoad.add(deferredScene);
      this._sceneNamesToMakeReady.add(deferredScene);
      this._headnautDeferredScene = null;
    }
    return loadBackground.call(this);
  };
})();
