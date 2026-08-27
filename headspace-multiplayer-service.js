(function (root) {
  "use strict";

  const VERSION = "20260821-1";
  const pendingStarts = new WeakMap();
  let callbackInstalled = false;

  function getMultiplayer() {
    return root.gdjs?.multiplayer || null;
  }

  function getCapabilities() {
    const multiplayer = getMultiplayer();
    return Object.freeze({
      hostedLobbies: typeof multiplayer?.openLobbiesWindow === "function",
      directLobbyJoin: typeof multiplayer?.authenticateAndQuickJoinWithLobbyID === "function",
      quickJoin: typeof multiplayer?.authenticateAndQuickJoinLobby === "function",
      playerAuthentication: typeof root.gdjs?.playerAuthentication?.openAuthenticationWindow === "function",
    });
  }

  function normalizeMatch(match) {
    const level = Number(match?.level);
    if (!Number.isInteger(level) || level < 1 || level > 12) {
      throw new RangeError("A multiplayer level from 1 through 12 is required.");
    }
    return Object.freeze({
      level,
      mode: match?.mode === "hunt-the-boss" ? "hunt-the-boss" : "head-to-head",
    });
  }

  function installStartCallback() {
    if (callbackInstalled || typeof root.gdjs?.registerRuntimeScenePreEventsCallback !== "function") return;
    callbackInstalled = true;
    root.gdjs.registerRuntimeScenePreEventsCallback((runtimeScene) => {
      const pending = pendingStarts.get(runtimeScene);
      const multiplayer = getMultiplayer();
      if (!pending || !multiplayer?.hasLobbyGameJustStarted?.()) return;
      pendingStarts.delete(runtimeScene);
      pending.onStart({
        ...pending.match,
        code: "",
        source: "gdevelop-hosted-lobby",
        playerNumber: multiplayer.getCurrentPlayerNumber?.() || 0,
        playerCount: Math.max(1, multiplayer.getPlayersInLobbyCount?.() || 1),
      });
    });
  }

  async function openHostedLobbies(runtimeScene, match, onStart) {
    const multiplayer = getMultiplayer();
    if (!runtimeScene || typeof onStart !== "function") {
      throw new TypeError("A runtime scene and start callback are required.");
    }
    if (typeof multiplayer?.openLobbiesWindow !== "function") {
      throw new Error("This build does not include GDevelop hosted multiplayer lobbies.");
    }
    installStartCallback();
    pendingStarts.set(runtimeScene, { match: normalizeMatch(match), onStart });
    try {
      await multiplayer.openLobbiesWindow(runtimeScene);
    } catch (error) {
      pendingStarts.delete(runtimeScene);
      throw error;
    }
  }

  function cancel(runtimeScene) {
    if (runtimeScene) pendingStarts.delete(runtimeScene);
  }

  root.HeadSpaceMultiplayerService = Object.freeze({
    version: VERSION,
    getCapabilities,
    openHostedLobbies,
    cancel,
  });
})(globalThis);
