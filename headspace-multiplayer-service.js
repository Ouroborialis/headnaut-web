(function (root) {
  "use strict";

  const VERSION = "20260903-private-rooms-4";
  const ROOM_PREFIX = "headnaut-room-";
  const CODE_LENGTH = 6;
  const MAX_PLAYERS = 4;
  const TIMEOUT_MS = 12000;
  const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let session = null;
  let bridgeInstalled = false;
  let originalHelper = null;
  const messages = new Map();
  const disconnected = [];

  class Message {
    constructor(data, sender) { this.data = data; this.sender = sender; }
    getData() { return this.data; }
    getSender() { return this.sender; }
  }
  class MessageList {
    constructor(name) { this.name = name; this.items = []; }
    getName() { return this.name; }
    getMessages() { return this.items; }
    pushMessage(data, sender) { this.items.push(new Message(data, sender)); }
  }

  const multiplayer = () => root.gdjs?.multiplayer || null;
  const peerHelper = () => root.gdjs?.multiplayerPeerJsHelper || null;
  const normalizeCode = value => String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CODE_LENGTH);
  const makeCode = () => {
    const bytes = new Uint8Array(CODE_LENGTH);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => ALPHABET[byte % ALPHABET.length]).join("");
  };
  const profileOf = (profile, fallback) => ({
    name: String(profile?.name || fallback).slice(0, 24),
    characterUrl: String(profile?.characterUrl || ""),
    helmetUrl: String(profile?.helmetUrl || ""),
    characterIndex: Number.isFinite(Number(profile?.characterIndex)) ? Number(profile.characterIndex) : 0,
    helmetIndex: Number.isFinite(Number(profile?.helmetIndex)) ? Number(profile.helmetIndex) : 0,
  });
  const roomOf = () => session ? {
    code: session.code,
    level: session.level,
    mode: session.mode,
    maxPlayers: MAX_PLAYERS,
    privacy: "private",
    status: session.started ? "playing" : session.level ? "ready" : "waiting-for-level",
    isHost: session.isHost,
    localPlayerNumber: session.playerNumber,
    players: session.players.slice().sort((a, b) => a.playerNumber - b.playerNumber).map(player => ({ ...player })),
  } : null;
  const emitRoom = () => {
    if (!session) return;
    const room = roomOf();
    root.headSpaceMultiplayerRoom = room;
    session.onRoomUpdate?.(room);
  };
  const send = (connection, payload) => {
    if (!connection?.open) return false;
    connection.send(payload);
    return true;
  };
  const sendRoom = (connection, payload) => send(connection, { __headnautRoom: VERSION, ...payload });
  const broadcast = payload => {
    if (!session?.isHost) return;
    for (const connection of session.connections.values()) sendRoom(connection, payload);
  };
  const broadcastRoom = () => broadcast({ type: "snapshot", room: roomOf() });
  const nextPlayerNumber = () => {
    const used = new Set(session.players.map(player => player.playerNumber));
    for (let number = 2; number <= MAX_PLAYERS; number += 1) if (!used.has(number)) return number;
    return 0;
  };
  const messageList = name => {
    if (!messages.has(name)) messages.set(name, new MessageList(name));
    return messages.get(name);
  };

  function acceptGameMessage(peerId, envelope) {
    if (!envelope || typeof envelope.messageName !== "string") return;
    let data = envelope.data;
    if (typeof data === "string") try { data = JSON.parse(data); } catch { return; }
    messageList(envelope.messageName).pushMessage(data, peerId);
  }

  function applySnapshot(room) {
    if (!session || session.isHost || !room) return;
    session.level = Number(room.level) || null;
    session.mode = room.mode === "hunt-the-boss" ? "hunt-the-boss" : "head-to-head";
    session.players = Array.isArray(room.players) ? room.players.map(player => ({ ...player })) : [];
    emitRoom();
  }

  function handleRoomMessage(peerId, data) {
    if (!session || data?.__headnautRoom !== VERSION) return false;
    if (data.type === "hello" && session.isHost) {
      let player = session.players.find(item => item.peerId === peerId);
      if (!player) {
        const playerNumber = nextPlayerNumber();
        if (!playerNumber) {
          sendRoom(session.connections.get(peerId), { type: "rejected", reason: "ROOM_FULL" });
          session.connections.get(peerId)?.close();
          return true;
        }
        player = { id: peerId, peerId, playerNumber, ...profileOf(data.profile, `PLAYER ${playerNumber}`), host: false, ready: true };
        session.players.push(player);
      }
      sendRoom(session.connections.get(peerId), { type: "welcome", playerNumber: player.playerNumber, hostPeerId: session.peer.id, room: roomOf() });
      emitRoom();
      broadcastRoom();
    } else if (data.type === "welcome" && !session.isHost) {
      session.playerNumber = Number(data.playerNumber) || 0;
      session.hostPeerId = String(data.hostPeerId || peerId);
      applySnapshot(data.room);
      session.resolveReady?.(roomOf());
      session.resolveReady = null;
    } else if (data.type === "snapshot" && !session.isHost) {
      applySnapshot(data.room);
    } else if (data.type === "start" && !session.isHost) {
      applySnapshot(data.room);
      beginGame(data.room);
    } else if (data.type === "rejected" && !session.isHost) {
      session.rejectReady?.(new Error(data.reason === "ROOM_FULL" ? "That room is full." : "Unable to join that room."));
      session.rejectReady = null;
    }
    return true;
  }

  function attach(connection) {
    if (!session || !connection) return;
    session.connections.set(connection.peer, connection);
    connection.on("data", data => data?.__headnautRoom ? handleRoomMessage(connection.peer, data) : acceptGameMessage(connection.peer, data));
    const closed = () => connectionClosed(connection.peer);
    connection.on("close", closed);
    connection.on("error", closed);
  }

  function connectionClosed(peerId) {
    if (!session?.connections.has(peerId)) return;
    session.connections.delete(peerId);
    disconnected.push(peerId);
    if (session.isHost && !session.started) {
      session.players = session.players.filter(player => player.peerId !== peerId);
      emitRoom();
      broadcastRoom();
    } else if (!session.isHost && peerId === session.hostPeerId && !session.started) {
      session.onError?.(new Error("The host left the room."));
    }
  }

  function installBridge() {
    if (bridgeInstalled) return;
    const helper = peerHelper();
    if (!helper) throw new Error("GDevelop's multiplayer transport is unavailable.");
    originalHelper = {};
    for (const name of ["sendDataTo", "getAllPeers", "getAllMessagesMap", "getOrCreateMessagesList", "getCurrentId", "getJustDisconnectedPeers", "disconnectFromAllPeers", "connect"])
      originalHelper[name] = helper[name];
    helper.sendDataTo = async (peerIds, messageName, data) => {
      const envelope = { messageName, data: JSON.stringify(data) };
      for (const peerId of peerIds || []) send(session?.connections.get(peerId), envelope);
    };
    helper.getAllPeers = () => Array.from(session?.connections.keys() || []);
    helper.getAllMessagesMap = () => messages;
    helper.getOrCreateMessagesList = messageList;
    helper.getCurrentId = () => session?.peer?.id || "";
    helper.getJustDisconnectedPeers = () => disconnected;
    helper.disconnectFromAllPeers = () => { for (const connection of session?.connections.values() || []) connection.close(); };
    helper.connect = peerId => {
      if (!session?.peer || session.connections.has(peerId)) return;
      const connection = session.peer.connect(peerId, { reliable: true });
      connection.on("open", () => attach(connection));
    };
    root.gdjs.registerRuntimeScenePostEventsCallback?.(() => {
      for (const list of messages.values()) list.getMessages().length = 0;
      disconnected.length = 0;
    });
    bridgeInstalled = true;
  }

  function restoreBridge() {
    if (!bridgeInstalled || !originalHelper) return;
    Object.assign(peerHelper(), originalHelper);
    originalHelper = null;
    bridgeInstalled = false;
    messages.clear();
    disconnected.length = 0;
  }

  function destroySession(restore = true) {
    const oldSession = session;
    session = null;
    if (oldSession?.timer) clearTimeout(oldSession.timer);
    for (const connection of oldSession?.connections.values() || []) try { connection.close(); } catch {}
    try { oldSession?.peer?.destroy(); } catch {}
    messages.clear();
    disconnected.length = 0;
    if (restore) restoreBridge();
    root.headSpaceMultiplayerRoom = null;
  }

  function waitForOpen(peer, failureMessage) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(failureMessage)), TIMEOUT_MS);
      peer.on("open", id => { clearTimeout(timer); resolve(id); });
      peer.on("error", error => {
        clearTimeout(timer);
        if (error?.type === "unavailable-id") reject(new Error("That room code is already in use. Please try again."));
        else if (error?.type === "peer-unavailable") reject(new Error("Room not found. Check the code and try again."));
        else reject(new Error(failureMessage));
      });
    });
  }

  async function createRoom(runtimeScene, profile, callbacks = {}) {
    if (!runtimeScene) throw new Error("The multiplayer scene is unavailable.");
    if (typeof root.Peer !== "function") throw new Error("Private rooms are unavailable in this browser.");
    destroySession();
    installBridge();
    const code = makeCode();
    const peer = new root.Peer(`${ROOM_PREFIX}${code}`);
    session = {
      runtimeScene, code, peer, isHost: true, hostPeerId: `${ROOM_PREFIX}${code}`, playerNumber: 1,
      level: null, mode: "head-to-head", started: false, connections: new Map(),
      players: [{ id: `${ROOM_PREFIX}${code}`, peerId: `${ROOM_PREFIX}${code}`, playerNumber: 1, ...profileOf(profile, "YOU"), host: true, ready: true }],
      ...callbacks,
    };
    peer.on("connection", connection => {
      if (session?.started || session?.players.length >= MAX_PLAYERS) {
        connection.on("open", () => { sendRoom(connection, { type: "rejected", reason: "ROOM_FULL" }); connection.close(); });
      } else attach(connection);
    });
    try {
      const id = await waitForOpen(peer, "Unable to create a room. Check your connection and try again.");
      session.hostPeerId = id;
      session.players[0].id = id;
      session.players[0].peerId = id;
      emitRoom();
      return roomOf();
    } catch (error) { destroySession(); throw error; }
  }

  async function joinRoom(runtimeScene, codeValue, profile, callbacks = {}) {
    const code = normalizeCode(codeValue);
    if (code.length !== CODE_LENGTH) throw new Error("Enter a valid six-character room code.");
    if (!runtimeScene) throw new Error("The multiplayer scene is unavailable.");
    if (typeof root.Peer !== "function") throw new Error("Private rooms are unavailable in this browser.");
    destroySession();
    installBridge();
    const peer = new root.Peer();
    const ready = new Promise((resolve, reject) => {
      session = {
        runtimeScene, code, peer, isHost: false, hostPeerId: `${ROOM_PREFIX}${code}`, playerNumber: 0,
        level: null, mode: "head-to-head", started: false, connections: new Map(), players: [],
        resolveReady: resolve, rejectReady: reject, ...callbacks,
      };
    });
    try {
      await waitForOpen(peer, "Unable to connect to the room service.");
      const connection = peer.connect(`${ROOM_PREFIX}${code}`, { reliable: true });
      attach(connection);
      connection.on("open", () => sendRoom(connection, { type: "hello", profile: profileOf(profile, "YOU") }));
      session.timer = setTimeout(() => session?.rejectReady?.(new Error("Room not found. Check the code and try again.")), TIMEOUT_MS);
      const room = await ready;
      clearTimeout(session.timer);
      session.timer = null;
      return room;
    } catch (error) { destroySession(); throw error; }
  }

  function updateSettings(level, mode) {
    if (!session?.isHost || session.started) return false;
    session.level = Number.isInteger(Number(level)) ? Number(level) : null;
    session.mode = mode === "hunt-the-boss" ? "hunt-the-boss" : "head-to-head";
    emitRoom();
    broadcastRoom();
    return true;
  }

  function configureGame(active = true) {
    const api = multiplayer();
    if (!api || !session?.playerNumber || !session.hostPeerId) throw new Error("The multiplayer room is not ready.");
    api.playerNumber = session.playerNumber;
    api.hostPeerId = session.hostPeerId;
    api._isLobbyGameRunning = active;
    api._isReadyToSendOrReceiveGameUpdateMessages = active;
  }

  function beginGame(room) {
    if (!session || session.started) return;
    session.started = true;
    // Keep GDevelop's multiplayer identity and update loop untouched while each
    // client constructs the authored arena. Setting a player number before the
    // first gameplay frame makes native events wait for the hosted-lobby start.
    const launch = { ...roomOf(), level: Number(room.level), mode: room.mode, source: "headnaut-private-room", playerCount: session.players.length };
    session.onStart?.(launch);
    if (!session.runtimeScene?.getGame) {
      configureGame(true);
      return;
    }
    const activateWhenArenaIsReady = () => {
      if (!session?.started) return;
      const currentScene = session.runtimeScene.getGame().getSceneStack?.().getCurrentScene?.();
      if (currentScene?.getObjects?.("Player")?.some(player => !player.isDeleted?.())) {
        configureGame(true);
        return;
      }
      setTimeout(activateWhenArenaIsReady, 100);
    };
    setTimeout(activateWhenArenaIsReady, 100);
  }

  function startRoom() {
    if (!session?.isHost) throw new Error("Only the host can start the game.");
    if (!session.level) throw new Error("Choose a level before starting.");
    if (session.players.length < 2) throw new Error("Wait for at least one other player to join.");
    const room = roomOf();
    broadcast({ type: "start", room });
    beginGame(room);
    return room;
  }

  function cancel() { if (!session?.started) destroySession(); }
  const getCapabilities = () => Object.freeze({ privateRooms: typeof root.Peer === "function", hostedLobbies: false, directLobbyJoin: true, quickJoin: false, playerAuthentication: false });

  root.HeadSpaceMultiplayerService = Object.freeze({
    version: VERSION, getCapabilities, createRoom, joinRoom, updateSettings, startRoom,
    cancel, getRoom: roomOf, normalizeCode,
  });
})(globalThis);
