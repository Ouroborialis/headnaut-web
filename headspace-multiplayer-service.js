(function (root) {
  "use strict";

  const VERSION = "20260923-room-rounds-1";
  const COLORS = ["#32ff68", "#ff55bc", "#ffbd45", "#73a5ff"];
  const REJOIN_MS = 20000;
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
    name: String(profile?.name || fallback).replace(/[\u0000-\u001f\u007f]/g,"").trim().slice(0, 20) || fallback,
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
    round: session.round || 0, phase: session.phase || "lobby", startAt: session.startAt || 0,
    result: session.result || null, closed: session.closed || "",
    connectionPaused: !!session.connectionPaused,
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
    session.round = room.round || 0;
    session.phase = room.phase || "lobby";
    session.startAt = room.startAt || 0;
    session.result = room.result || null;
    session.connectionPaused = !!room.connectionPaused;
    emitRoom();
  }

  function handleRoomMessage(peerId, data) {
    if (!session || data?.__headnautRoom !== VERSION) return false;
    session.lastSeen.set(peerId,Date.now());
    if(!session.isHost && peerId===session.hostPeerId)session.hostMissingSince=0;
    const sender = session.players.find(item=>item.peerId===peerId);
    if (sender && !sender.expired && sender.connection!=="connected") {
      sender.connection="connected"; sender.rejoinUntil=0;
      if(session.isHost) {refreshConnectionPause();emitRoom();broadcastRoom();}
    }
    if(data.type==="ping") {
      sendRoom(session.connections.get(peerId),{type:"pong",sentAt:data.sentAt,hostNow:session.isHost?Date.now():null});
    } else if(data.type==="pong") {
      const rtt=Math.max(0,Date.now()-Number(data.sentAt));
      if(sender) sender.ping=Math.round(rtt);
      if(!session.isHost && Number.isFinite(data.hostNow)) session.clockOffset=data.hostNow-(Number(data.sentAt)+Date.now())/2;
    } else if(data.type==="arena-ready" && session.isHost && sender && data.round===session.round) {
      sender.loaded=true;sender.rejoinUntil=0;refreshConnectionPause();maybeCountdown();emitRoom();broadcastRoom();
    } else if(data.type==="health" && !session.isHost && peerId===session.hostPeerId && data.round===session.round) {
      const numbers=new Set((data.players||[]).map(p=>p.playerNumber));
      session.players=session.players.filter(p=>numbers.has(p.playerNumber));
      for(const status of data.players||[]) {const p=session.players.find(p=>p.playerNumber===status.playerNumber);if(p)Object.assign(p,status);}
      session.connectionPaused=!!data.connectionPaused;session.phase=data.phase;session.startAt=data.startAt||0;emitRoom();
    } else if(data.type==="round" && !session.isHost && peerId===session.hostPeerId && data.room.round===session.round) {
      applySnapshot(data.room);
    } else if(data.type==="lobby" && !session.isHost && peerId===session.hostPeerId) {
      session.started=false;session.worldState=null;session.remoteStates.clear();
      applySnapshot(data.room);configureGame(false);session.onLobby?.(roomOf());
    } else if(data.type==="closed" && !session.isHost && peerId===session.hostPeerId) {
      session.closed="The host closed the room.";emitRoom();
    } else if(data.type==="leave" && session.isHost && sender) {
      sender.expired=true;sender.connection="left";sender.rejoinUntil=0;refreshConnectionPause();emitRoom();broadcastRoom();
    } else if(data.type==="absorption" && !session.isHost && peerId===session.hostPeerId && data.round===session.round) {
      session.feedback.push({...data.event,at:Date.now()});session.feedback=session.feedback.slice(-32);
    } else if (data.type === "activity" && session.isHost && !session.started) {
      const player = session.players.find(item => item.peerId === peerId);
      if (player) {
        applyActivity(player, data.activity); emitRoom();
        broadcast({type:"presence",playerNumber:player.playerNumber,activity:{level:player.suggestedLevel,mode:player.suggestedMode,cursor:player.cursor}});
      }
    } else if (data.type === "presence" && !session.isHost && peerId === session.hostPeerId && !session.started) {
      const player=session.players.find(item=>item.playerNumber===data.playerNumber);
      if(player) { applyActivity(player,data.activity); emitRoom(); }
    } else if (data.type === "state" && session.started && data.round===session.round) {
      const sender = session.players.find(item => item.peerId === peerId);
      if (session.isHost && sender && !sender.expired && data.state?.seq>(session.remoteStates.get(sender.playerNumber)?.seq||0)) session.remoteStates.set(sender.playerNumber, data.state);
      else if (!session.isHost && peerId === session.hostPeerId && data.state?.seq>(session.worldState?.seq||0)) session.worldState = data.state;
    } else if (data.type === "hello" && session.isHost) {
      let player = session.players.find(item => item.peerId === peerId);
      const token=String(data.token||"");
      const returning=session.tokens.get(token);
      if(player && (player.expired || returning!==player.playerNumber)) {
        sendRoom(session.connections.get(peerId),{type:"rejected",reason:"EXPIRED"});return true;
      }
      if(!player && returning) {
        player=session.players.find(p=>p.playerNumber===returning);
        if(!player || player.expired || (player.rejoinUntil && player.rejoinUntil<Date.now())) {
          sendRoom(session.connections.get(peerId),{type:"rejected",reason:"EXPIRED"});return true;
        }
        const oldPeer=player.peerId;
        player.id=peerId;player.peerId=peerId;player.connection="connected";player.rejoinUntil=0;
        session.remoteStates.delete(player.playerNumber);
        if(oldPeer!==peerId) {const old=session.connections.get(oldPeer);session.connections.delete(oldPeer);old?.close();}
      }
      if (!player) {
        const playerNumber = nextPlayerNumber();
        if (!playerNumber || session.started || !/^[a-f0-9]{32}$/.test(token)) {
          sendRoom(session.connections.get(peerId), { type: "rejected", reason: "ROOM_FULL" });
          session.connections.get(peerId)?.close();
          return true;
        }
        player = { id: peerId, peerId, playerNumber, ...profileOf(data.profile, `PLAYER ${playerNumber}`), host: false, ready: true,connection:"connected",wins:0,color:COLORS[playerNumber-1] };
        session.players.push(player);
        session.tokens.set(token,playerNumber);
      }
      if(returning && session.started) {player.loaded=false;player.rejoinUntil=Date.now()+REJOIN_MS;player.connectionEpoch=(player.connectionEpoch||0)+1;session.remoteStates.delete(player.playerNumber);}
      session.lastSeen.set(peerId,Date.now());refreshConnectionPause();
      sendRoom(session.connections.get(peerId), { type: "welcome", playerNumber: player.playerNumber, hostPeerId: session.peer.id, room: roomOf() });
      if(session.latestWorld)sendRoom(session.connections.get(peerId),{type:"state",round:session.round,state:session.latestWorld});
      emitRoom();
      broadcastRoom();
    } else if (data.type === "welcome" && !session.isHost && peerId===session.hostPeerId) {
      session.playerNumber = Number(data.playerNumber) || 0;
      session.hostPeerId = String(data.hostPeerId || peerId);
      applySnapshot(data.room);
      session.hostMissingSince=0;session.reconnectAttemptAt=0;session.closed="";
      session.readyRound=null;
      if(data.room.status==="playing" && !session.started)beginGame(data.room,true);
      else if(session.started)session.restoreLocal=true;
      session.resolveReady?.(roomOf());
      session.resolveReady = null;
    } else if (data.type === "snapshot" && !session.isHost && peerId===session.hostPeerId) {
      applySnapshot(data.room);
    } else if (data.type === "start" && !session.isHost && peerId===session.hostPeerId) {
      if(session.started && data.room.round<=session.round)return true;
      session.started=false;
      applySnapshot(data.room);
      beginGame(data.room);
    } else if (data.type === "rejected" && !session.isHost) {
      const reason=data.reason==="EXPIRED"?"Your reconnect window expired. Join again for the next round.":"That room is full or already playing.";
      session.closed=reason;session.rejectReady?.(new Error(reason));
      session.rejectReady = null;
    }
    return true;
  }

  function attach(connection) {
    if (!session || !connection) return;
    session.connections.set(connection.peer, connection);
    const owner=session;
    connection.on("data", data => {if(session!==owner || session.connections.get(connection.peer)!==connection)return;data?.__headnautRoom ? handleRoomMessage(connection.peer, data) : acceptGameMessage(connection.peer, data);});
    const closed = () => {if(session===owner && session.connections.get(connection.peer)===connection)connectionClosed(connection.peer);};
    connection.on("close", closed);
    connection.on("error", closed);
  }

  function connectionClosed(peerId) {
    if (!session?.connections.has(peerId)) return;
    session.connections.delete(peerId);
    disconnected.push(peerId);
    const player=session.players.find(p=>p.peerId===peerId);
    if(player && !player.expired) {player.connection="reconnecting";player.rejoinUntil=Date.now()+REJOIN_MS;}
    if(session.isHost) {refreshConnectionPause();emitRoom();broadcastRoom();}
    else if(peerId===session.hostPeerId) {session.hostMissingSince ||= Date.now();emitRoom();}
  }

  function initializeSession() {
    Object.assign(session,{phase:"lobby",round:0,feedback:[],feedbackSeq:0,lastSeen:new Map(),tokens:new Map(),remoteStates:new Map(),worldState:null,clockOffset:0});
    const owner=session;
    const pulse=()=>{if(session!==owner)return;heartbeat();owner.heartbeatTimer=setTimeout(pulse,500);};
    owner.heartbeatTimer=setTimeout(pulse,500);
    owner.peer.on("disconnected",()=>{if(session===owner && !owner.closed)try{owner.peer.reconnect?.();}catch{}});
  }
  function refreshConnectionPause() {
    if(!session?.isHost)return;
    session.connectionPaused=session.players.some(p=>!p.expired && (p.connection!=="connected" || (session.started && !p.loaded)));
  }
  function connectHost() {
    if(!session || session.isHost || session.closed)return;
    const connection=session.peer.connect(session.hostPeerId,{reliable:true});
    session.reconnectAttemptAt=Date.now();attach(connection);
    connection.on("open",()=>sendRoom(connection,{type:"hello",profile:session.profile,token:session.token}));
  }
  function heartbeat() {
    if(!session || session.closed)return;
    const now=Date.now();
    for(const [id,connection] of session.connections)sendRoom(connection,{type:"ping",sentAt:now});
    if(session.isHost) {
      for(const p of session.players) {
        if(p.host || p.expired)continue;
        if(now-(session.lastSeen.get(p.peerId)||now)>3000 && p.connection==="connected") {p.connection="reconnecting";p.rejoinUntil=now+REJOIN_MS;}
        if(p.rejoinUntil && now>=p.rejoinUntil) {p.expired=true;p.connection="left";p.rejoinUntil=0;}
      }
      if(!session.started) {
        session.players=session.players.filter(p=>!p.expired);
        for(const [token,number] of session.tokens)if(!session.players.some(p=>p.playerNumber===number))session.tokens.delete(token);
      }
      refreshConnectionPause();
      if(session.phase==="countdown" && now>=session.startAt && !session.connectionPaused)session.phase="playing";
      if(session.phase==="countdown" && session.connectionPaused) {session.phase="loading";session.startAt=0;}
      maybeCountdown();emitRoom();broadcast({type:"health",round:session.round,phase:session.phase,startAt:session.startAt,connectionPaused:session.connectionPaused,players:session.players.map(({playerNumber,connection,rejoinUntil,expired,ping,loaded})=>({playerNumber,connection,rejoinUntil,expired,ping,loaded}))});
    } else {
      const connection=session.connections.get(session.hostPeerId);
      if(!connection?.open || now-(session.lastSeen.get(session.hostPeerId)||now)>3000) {
        session.hostMissingSince ||= now;
        if(now-session.hostMissingSince>=REJOIN_MS)session.closed="Connection to the host was lost. Return home to join a new room.";
        else if(!session.reconnectAttemptAt || now-session.reconnectAttemptAt>1500)connectHost();
      }
      emitRoom();
    }
  }
  function maybeCountdown() {
    if(session?.isHost && session.phase==="loading" && !session.connectionPaused && session.players.filter(p=>!p.expired).every(p=>p.loaded)) {
      session.phase="countdown";session.startAt=Date.now()+3000;broadcast({type:"round",room:roomOf()});
    }
  }
  function arenaReady() {
    if(!session?.started || session.readyRound===session.round)return;
    session.readyRound=session.round;
    if(session.isHost) {session.players[0].loaded=true;refreshConnectionPause();maybeCountdown();emitRoom();broadcastRoom();}
    else sendRoom(session.connections.get(session.hostPeerId),{type:"arena-ready",round:session.round});
  }
  function getFlow() {
    if(!session?.started)return null;
    const remaining=Math.max(0,(session.startAt-(Date.now()+session.clockOffset))/1000);
    const reconnecting=!!session.hostMissingSince || session.connectionPaused;
    return {phase:session.phase,remaining,blocked:!!session.closed || reconnecting || session.phase==="loading" || (session.phase==="countdown" && remaining>0) || session.phase==="results",reconnecting,
      rejoinSeconds:Math.max(0,Math.ceil(((session.hostMissingSince?session.hostMissingSince+REJOIN_MS:Math.min(...session.players.filter(p=>p.rejoinUntil).map(p=>p.rejoinUntil))) - Date.now() - (session.hostMissingSince?0:session.clockOffset))/1000))};
  }
  function reportAbsorption(event) {
    if(!session?.isHost || !session.started)return;
    const item={...event,id:++session.feedbackSeq,at:Date.now()};
    session.feedback.push(item);session.feedback=session.feedback.slice(-32);
    broadcast({type:"absorption",round:session.round,event:item});
  }
  function finishRound(winners,reason="absorption") {
    if(!session?.isHost || !session.started || !["playing","countdown"].includes(session.phase) || (session.phase==="countdown" && Date.now()<session.startAt))return false;
    session.phase="results";session.result={winners:winners.slice(),reason,round:session.round};
    for(const p of session.players)if(winners.includes(p.playerNumber))p.wins=(p.wins||0)+1;
    emitRoom();broadcast({type:"round",room:roomOf()});return true;
  }
  function returnToLobby() {
    if(!session?.isHost)return false;
    session.started=false;session.phase="lobby";session.result=null;session.latestWorld=null;session.worldState=null;session.remoteStates.clear();
    session.players=session.players.filter(p=>!p.expired);configureGame(false);refreshConnectionPause();
    for(const [token,number] of session.tokens)if(!session.players.some(p=>p.playerNumber===number))session.tokens.delete(token);
    emitRoom();broadcast({type:"lobby",room:roomOf()});session.onLobby?.(roomOf());return true;
  }
  function leave() {
    if(session?.isHost)broadcast({type:"closed"});else if(session)sendRoom(session.connections.get(session.hostPeerId),{type:"leave"});
    destroySession();
  }

  function installBridge() {
    if (bridgeInstalled) return;
    const helper = peerHelper();
    if (!helper) throw new Error("GDevelop's multiplayer transport is unavailable.");
    originalHelper = {};
    for (const name of ["sendDataTo", "getAllPeers", "getAllMessagesMap", "getOrCreateMessagesList", "getCurrentId", "getJustDisconnectedPeers", "disconnectFromAllPeers", "connect"])
      originalHelper[name] = helper[name];
    helper.sendDataTo = async (peerIds, messageName, data) => {
      // Arena construction, camera and local pause belong to each client.
      // Explicit room snapshots synchronize actors without replacing scene state.
      if (session?.started && ["#updateGame", "#updateScene"].includes(messageName)) return;
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
    if (oldSession?.heartbeatTimer) clearTimeout(oldSession.heartbeatTimer);
    for (const connection of oldSession?.connections.values() || []) try { connection.close(); } catch {}
    try { oldSession?.peer?.destroy(); } catch {}
    messages.clear();
    disconnected.length = 0;
    if (restore) restoreBridge();
    const api=multiplayer();
    if (api) {
      api.playerNumber=null; api.hostPeerId=null;
      api._isLobbyGameRunning=false; api._isReadyToSendOrReceiveGameUpdateMessages=false;
    }
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
      players: [{ id: `${ROOM_PREFIX}${code}`, peerId: `${ROOM_PREFIX}${code}`, playerNumber: 1, ...profileOf(profile, "PLAYER 1"), host: true, ready: true,connection:"connected",wins:0,color:COLORS[0] }],
      ...callbacks,
    };
    initializeSession();
    peer.on("connection", connection => {
      if(session?.peer===peer)attach(connection);
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
      initializeSession();
      let token;
      try {token=root.sessionStorage?.getItem(`headnaut-rejoin-${code}`);}catch{}
      if(!/^[a-f0-9]{32}$/.test(token||""))token=Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,"0")).join("");
      try {root.sessionStorage?.setItem(`headnaut-rejoin-${code}`,token);}catch{}
      session.token=token;session.profile=profileOf(profile,"PLAYER 2");
    });
    try {
      await waitForOpen(peer, "Unable to connect to the room service.");
      connectHost();
      session.timer = setTimeout(() => session?.rejectReady?.(new Error("Room not found. Check the code and try again.")), TIMEOUT_MS);
      const room = await ready;
      clearTimeout(session.timer);
      session.timer = null;
      return room;
    } catch (error) { destroySession(); throw error; }
  }

  function applyActivity(player, activity = {}) {
    if (Number.isInteger(activity.level) && activity.level >= 1 && activity.level <= 12) player.suggestedLevel = activity.level;
    if (["head-to-head", "hunt-the-boss"].includes(activity.mode)) player.suggestedMode = activity.mode;
    if (activity.cursor === null) player.cursor = null;
    else if (Number.isFinite(activity.cursor?.x) && Number.isFinite(activity.cursor?.y)) player.cursor = {
      x: Math.max(0, Math.min(1, activity.cursor.x)), y: Math.max(0, Math.min(1, activity.cursor.y))
    };
  }
  function updateActivity(activity) {
    if (!session || session.started) return false;
    if (session.isHost) {
      applyActivity(session.players[0], activity); emitRoom();
      const player=session.players[0];
      broadcast({type:"presence",playerNumber:1,activity:{level:player.suggestedLevel,mode:player.suggestedMode,cursor:player.cursor}});
    } else sendRoom(session.connections.get(session.hostPeerId), { type: "activity", activity });
    return true;
  }
  function exchangeState(state) {
    if (!session?.started) return null;
    if (session.isHost) {session.latestWorld=state;broadcast({ type: "state", round:session.round,state });}
    else sendRoom(session.connections.get(session.hostPeerId), { type: "state", round:session.round,state });
  }
  function getRemoteStates() { return session?.remoteStates || new Map(); }
  function getWorldState() { return session?.worldState || null; }

  function updateSettings(level, mode) {
    if (!session?.isHost || session.started) return false;
    session.level = Number.isInteger(Number(level)) && Number(level)>=1 && Number(level)<=12 ? Number(level) : null;
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

  function beginGame(room, rejoin = false) {
    if (!session || session.started) return;
    session.started = true;
    session.round=room.round;session.phase=room.phase;session.startAt=room.startAt||0;
    session.readyRound=null;session.restoreLocal=!!rejoin;session.feedback=[];
    session.remoteStates = new Map();
    session.worldState = null;
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
    if(session.started && session.phase!=="results")throw new Error("A round is already in progress.");
    if(session.players.some(p=>p.connection!=="connected" || p.expired))throw new Error("Wait for players to reconnect, or return to the lobby.");
    session.started=false;session.phase="loading";session.round+=1;session.startAt=0;session.result=null;session.latestWorld=null;
    for(const p of session.players)p.loaded=false;
    const room = roomOf();
    broadcast({ type: "start", room });
    beginGame(room);
    return room;
  }

  function cancel() { if (!session?.started) leave(); }
  const getCapabilities = () => Object.freeze({ privateRooms: typeof root.Peer === "function", hostedLobbies: false, directLobbyJoin: true, quickJoin: false, playerAuthentication: false });

  root.HeadSpaceMultiplayerService = Object.freeze({
    version: VERSION, getCapabilities, createRoom, joinRoom, updateSettings, startRoom,
    cancel, getRoom: roomOf, normalizeCode, updateActivity, exchangeState, getRemoteStates, getWorldState,
    arenaReady,getFlow,finishRound,returnToLobby,leave,reportAbsorption,
    getFeedback:()=>session?.feedback||[],
    consumeRestore:()=>{if(!session?.restoreLocal)return false;session.restoreLocal=false;return true;},
    playerColor:number=>COLORS[(Number(number)||1)-1]||COLORS[0],
  });
})(globalThis);
