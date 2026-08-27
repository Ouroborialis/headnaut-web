(function () {
  "use strict";

  const ROOT_ID = "headspace-multiplayer-setup";
  const LEVEL_COUNT = 12;
  const LEVEL_BACKGROUNDS = [
    "multiplayer-level-04.png", "multiplayer-level-10.jpg", "multiplayer-level-02.png",
    "multiplayer-level-08.png", "multiplayer-level-06.png", "multiplayer-level-12.jpg",
    "multiplayer-level-01.png", "multiplayer-level-09.png", "multiplayer-level-05.png",
    "multiplayer-level-11.jpg", "multiplayer-level-03.png", "multiplayer-level-07.png",
  ];
  let selectedLevel = null;
  let selectedMode = "head-to-head";
  let room = null;

  function createLevelBorderPreview(level) {
    const preview = globalThis.headSpaceMultiplayerFramework?.getLevel?.(level)?.borderPreview;
    if (!preview || !Array.isArray(preview.paths) || !preview.paths.length) return null;
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    svg.classList.add("mp-level-border-preview");
    svg.setAttribute("viewBox", preview.viewBox || "0 0 100 64");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("aria-hidden", "true");
    for (const pathData of preview.paths) {
      const path = document.createElementNS(namespace, "path");
      path.setAttribute("d", String(pathData));
      svg.appendChild(path);
    }
    return svg;
  }

  function close() {
    const root = document.getElementById(ROOT_ID);
    if (root?.__headSpaceResizeHandler) {
      window.removeEventListener("resize", root.__headSpaceResizeHandler);
    }
    root?.remove();
  }

  function isOpen() {
    return !!document.getElementById(ROOT_ID);
  }

  function updateRoom(nextRoom) {
    room = nextRoom && typeof nextRoom === "object" ? { ...nextRoom } : null;
    globalThis.headSpaceMultiplayerRoom = room ? { ...room } : null;
    document.getElementById(ROOT_ID)?.__renderPlayers?.();
  }

  function open(options = {}) {
    close();
    room = null;
    const availableLevels = Array.isArray(options.availableLevels) && options.availableLevels.length
      ? options.availableLevels
      : Array.from({ length: LEVEL_COUNT }, (_, index) => index + 1);

    const root = document.createElement("div");
    root.id = ROOT_ID;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Multiplayer setup");
    root.style.visibility = "hidden";
    root.innerHTML = `
      <style>
        #${ROOT_ID}{position:fixed;inset:0;z-index:1000005;overflow:hidden;color:#f4fbff;background:radial-gradient(circle at 50% 10%,rgba(20,72,110,.78),rgba(1,6,14,.97) 52%),rgba(1,6,14,.96);font-family:Achron,Segoe UI,sans-serif;box-sizing:border-box;padding:clamp(10px,1.5vw,24px)}
        #${ROOT_ID} *{box-sizing:border-box}
        #${ROOT_ID} .mp-shell{width:min(1380px,100%);margin:auto;border:4px solid #59d6ff;border-radius:24px;background:rgba(1,9,20,.92);box-shadow:0 0 34px #1e9dcc,inset 0 0 55px rgba(27,116,160,.22);padding:clamp(18px,2.2vw,42px)}
        #${ROOT_ID} .mp-header{display:grid;grid-template-columns:190px 1fr 190px;align-items:center;gap:18px;margin-bottom:26px}
        #${ROOT_ID} h1{margin:0;text-align:center;font-size:clamp(48px,6vw,84px);letter-spacing:5px;text-shadow:3px 0 #00ffc8,-3px 0 #ff2ab8,0 0 14px #fff}
        #${ROOT_ID} h2{margin:8px 0 16px;color:#bceeff;font-size:clamp(25px,2.4vw,38px);letter-spacing:2px}
        #${ROOT_ID} button,#${ROOT_ID} input{min-height:54px;border-radius:12px;font:700 18px/1.2 Achron,Segoe UI,sans-serif;letter-spacing:.7px}
        #${ROOT_ID} button{border:3px solid #59d6ff;color:#fff;background:rgba(1,10,22,.98);box-shadow:0 0 12px rgba(89,214,255,.62),inset 0 0 12px rgba(89,214,255,.18);padding:10px 16px;cursor:pointer;touch-action:manipulation}
        #${ROOT_ID} button:hover,#${ROOT_ID} button:focus-visible{filter:brightness(1.3);outline:3px solid #fff;outline-offset:3px;transform:translateY(-1px)}
        #${ROOT_ID} button:active{transform:scale(.98)}
        #${ROOT_ID} .mp-back{border-color:#ff3b68}
        #${ROOT_ID} .mp-avatar{position:relative;width:150px;height:150px;justify-self:center;border-radius:50%;background:radial-gradient(circle,#17395a,#020817 72%);filter:drop-shadow(0 0 12px #59d6ff)}
        #${ROOT_ID} .mp-avatar img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
        #${ROOT_ID} .mp-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(390px,.75fr);gap:24px}
        #${ROOT_ID} .mp-panel{border:3px solid rgba(89,214,255,.5);border-radius:18px;padding:22px;background:rgba(3,19,36,.76)}
        #${ROOT_ID} .mp-levels{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}
        #${ROOT_ID} .mp-level{position:relative;isolation:isolate;min-height:104px;padding:10px;border-color:#4f91bd;background-size:cover;background-position:center;overflow:hidden;font-size:30px;text-shadow:0 2px 5px #000,0 0 7px #000}
        #${ROOT_ID} .mp-level::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(rgba(0,5,12,.2),rgba(0,5,12,.76))}
        #${ROOT_ID} .mp-level-border-preview{position:absolute;inset:9px 12px;width:calc(100% - 24px);height:calc(100% - 18px);z-index:1;overflow:visible;pointer-events:none;filter:drop-shadow(0 0 4px #0b62ff) drop-shadow(0 0 7px rgba(0,153,255,.75))}
        #${ROOT_ID} .mp-level-border-preview path{fill:none;stroke:#267dff;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;opacity:.94}
        #${ROOT_ID} .mp-level-number{position:relative;z-index:2;display:inline-grid;place-items:center;min-width:42px;min-height:42px;border-radius:50%;background:radial-gradient(circle,rgba(1,9,20,.88) 0 43%,rgba(1,9,20,.55) 60%,transparent 74%);text-shadow:0 2px 5px #000,0 0 8px #000}
        #${ROOT_ID} .mp-level:hover .mp-level-border-preview path,#${ROOT_ID} .mp-level:focus-visible .mp-level-border-preview path{stroke:#64b8ff;opacity:1}
        #${ROOT_ID} .mp-level[aria-pressed="true"]{border-color:#00ffc8;color:#fff;box-shadow:0 0 22px #00ffc8,inset 0 0 18px rgba(0,255,200,.3)}
        #${ROOT_ID} .mp-mode-title{margin:18px 0 10px;font-size:22px;color:#bceeff;letter-spacing:2px}
        #${ROOT_ID} .mp-modes{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        #${ROOT_ID} .mp-mode{min-height:58px;font-size:18px}
        #${ROOT_ID} .mp-mode[aria-pressed="true"]{border-color:#00ffc8;color:#dffff8;box-shadow:0 0 18px rgba(0,255,200,.78),inset 0 0 16px rgba(0,255,200,.22)}
        #${ROOT_ID} .mp-actions{display:grid;gap:12px}
        #${ROOT_ID} .mp-primary{border-color:#00ffc8;color:#dffff8}.mp-join{border-color:#ffdf58;color:#fff8c8}
        #${ROOT_ID} .mp-room-row{display:grid;grid-template-columns:1fr auto;gap:10px}
        #${ROOT_ID} input{width:100%;border:3px solid #59d6ff;background:#020914;color:#fff;padding:8px 14px;text-transform:uppercase;text-align:center;font-size:22px;letter-spacing:4px;outline:none}
        #${ROOT_ID} input:focus{border-color:#fff;box-shadow:0 0 16px #59d6ff}
        #${ROOT_ID} .mp-social{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        #${ROOT_ID} .mp-status{min-height:58px;margin-top:14px;border-radius:10px;background:rgba(0,0,0,.35);padding:12px;color:#bceeff;font:600 17px/1.4 Segoe UI,sans-serif;text-align:center}
        #${ROOT_ID} .mp-launch{margin-top:12px;border:2px solid rgba(89,214,255,.42);border-radius:14px;padding:12px;background:rgba(0,0,0,.22)}
        #${ROOT_ID} .mp-player-heading{color:#bceeff;font-size:18px;letter-spacing:1px;margin-bottom:9px}
        #${ROOT_ID} .mp-player{display:flex;align-items:center;gap:12px;min-height:62px;border-radius:10px;background:rgba(8,35,55,.72);padding:7px 12px;color:#fff}
        #${ROOT_ID} .mp-player-avatar{position:relative;width:52px;height:52px;flex:0 0 52px;border-radius:50%;background:#071725;box-shadow:0 0 8px #59d6ff}
        #${ROOT_ID} .mp-player-avatar img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
        #${ROOT_ID} .mp-player-name{font:700 18px Achron,Segoe UI,sans-serif}.mp-player-role{color:#83cfe8;font:14px Segoe UI,sans-serif;margin-top:3px}
        #${ROOT_ID} .mp-launch-row{display:grid;grid-template-columns:1fr 150px;gap:10px;align-items:stretch}
        #${ROOT_ID} .mp-launch-row .mp-status{margin-top:10px}
        #${ROOT_ID} [data-solo-start]{margin-top:10px;border-color:#00ffc8;color:#dffff8;font-size:23px}
        #${ROOT_ID} button:disabled{cursor:not-allowed;filter:grayscale(1);opacity:.42;transform:none;outline:none}
        #${ROOT_ID} .mp-room{display:none;margin-top:14px;padding:16px;border:2px solid #00ffc8;border-radius:14px;text-align:center;background:rgba(0,65,55,.25)}
        #${ROOT_ID} .mp-code{font-size:clamp(34px,5vw,54px);letter-spacing:8px;color:#00ffc8;margin:8px 0 14px}
        #${ROOT_ID} .mp-note{color:#83cfe8;font:15px/1.45 Segoe UI,sans-serif;margin:5px 0 0}
        #${ROOT_ID} .mp-friends{grid-column:1/-1;padding-top:16px;padding-bottom:16px}
        #${ROOT_ID} .mp-friends h2{margin:0 0 12px}
        #${ROOT_ID} .mp-friend-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
        #${ROOT_ID} .mp-friend{min-height:66px;border:2px dashed rgba(89,214,255,.46);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#83cfe8;font:600 17px Segoe UI,sans-serif;background:rgba(0,0,0,.2)}
        @media(max-width:900px){#${ROOT_ID} .mp-header{grid-template-columns:120px 1fr 120px}#${ROOT_ID} .mp-grid{grid-template-columns:1fr}#${ROOT_ID} .mp-levels{grid-template-columns:repeat(3,minmax(0,1fr))}#${ROOT_ID} .mp-friends{grid-column:auto}}
        @media(max-width:480px){#${ROOT_ID} .mp-header{grid-template-columns:1fr}#${ROOT_ID} .mp-avatar{width:110px;height:110px}#${ROOT_ID} .mp-back{order:2}#${ROOT_ID} .mp-levels{grid-template-columns:repeat(2,minmax(0,1fr))}#${ROOT_ID} .mp-room-row,#${ROOT_ID} .mp-social{grid-template-columns:1fr}}
      </style>
      <main class="mp-shell">
        <header class="mp-header"><button class="mp-back" type="button">BACK</button><h1>MULTIPLAYER</h1><div class="mp-avatar" aria-label="Selected player"><img data-character alt=""><img data-helmet alt=""></div></header>
        <div class="mp-grid">
          <section class="mp-panel"><h2>SELECT LEVEL</h2><div class="mp-levels"></div><div class="mp-mode-title">MODE</div><div class="mp-modes"><button class="mp-mode" data-mode="head-to-head" aria-pressed="true" type="button">HEAD TO HEAD</button><button class="mp-mode" data-mode="hunt-the-boss" aria-pressed="false" type="button">HUNT THE BOSS</button></div><p class="mp-note">Head to Head: absorb the other players. Hunt the Boss: work together to absorb the boss.</p></section>
          <section class="mp-panel mp-actions">
            <h2>PRIVATE ROOM</h2>
            <button class="mp-primary" data-create type="button">OPEN ONLINE LOBBIES</button>
            <div class="mp-room-row"><input data-code aria-label="Room code" maxlength="6" autocomplete="off" placeholder="ROOM CODE"><button class="mp-join" data-join type="button">JOIN ROOM</button></div>
            <div class="mp-social"><button data-invite type="button">INVITE FRIENDS</button><button data-friends type="button">FRIEND SEARCH</button></div>
            <p class="mp-note">Online rooms use GDevelop's hosted multiplayer service. Direct private codes require a newer runtime capability.</p>
            <div class="mp-launch">
              <div class="mp-player-heading" data-player-heading>PLAYERS (1/4)</div>
              <div data-player-list><div class="mp-player"><div class="mp-player-avatar"><img data-player-character alt=""><img data-player-helmet alt=""></div><div><div class="mp-player-name">YOU</div><div class="mp-player-role">HOST · READY</div></div></div></div>
              <div class="mp-launch-row"><div class="mp-status" role="status" aria-live="polite">Create a room, then choose a level together.</div><button data-solo-start type="button" disabled>START</button></div>
            </div>
            <div class="mp-room"><div>PRIVATE ROOM READY</div><div class="mp-code"></div></div>
          </section>
          <section class="mp-panel mp-friends">
            <h2>MY FRIENDS</h2>
            <div class="mp-friend-list">
              <div class="mp-friend">Known friends will appear here</div>
              <div class="mp-friend">Invite a friend to your room</div>
              <div class="mp-friend">Friend status coming soon</div>
            </div>
          </section>
        </div>
      </main>`;
    document.body.appendChild(root);

    const characterImage = root.querySelector("[data-character]");
    const helmetImage = root.querySelector("[data-helmet]");
    if (options.avatar?.characterUrl) characterImage.src = options.avatar.characterUrl;
    if (options.avatar?.helmetUrl) helmetImage.src = options.avatar.helmetUrl;
    for (const image of root.querySelectorAll("[data-player-character]")) {
      if (options.avatar?.characterUrl) image.src = options.avatar.characterUrl;
    }
    for (const image of root.querySelectorAll("[data-player-helmet]")) {
      if (options.avatar?.helmetUrl) image.src = options.avatar.helmetUrl;
    }

    const shell = root.querySelector(".mp-shell");
    shell.style.transformOrigin = "top center";
    const fitSetupToViewport = () => {
      shell.style.transform = "none";
      const rootStyle = getComputedStyle(root);
      const availableWidth =
        window.innerWidth - parseFloat(rootStyle.paddingLeft) - parseFloat(rootStyle.paddingRight);
      const availableHeight =
        window.innerHeight - parseFloat(rootStyle.paddingTop) - parseFloat(rootStyle.paddingBottom);
      const browserZoomCompensation = Math.min(
        5,
        Math.max(1, 1 / Math.max(0.2, window.devicePixelRatio || 1))
      );
      const fitScale = Math.min(
        browserZoomCompensation,
        availableWidth / Math.max(1, shell.scrollWidth),
        availableHeight / Math.max(1, shell.scrollHeight)
      );
      shell.style.transform = `scale(${Math.max(0.1, fitScale)})`;
    };
    root.__headSpaceResizeHandler = fitSetupToViewport;
    window.addEventListener("resize", fitSetupToViewport);

    const levels = root.querySelector(".mp-levels");
    const status = root.querySelector(".mp-status");
    const roomPanel = root.querySelector(".mp-room");
    const roomCode = root.querySelector(".mp-code");
    const codeInput = root.querySelector("[data-code]");
    const soloStartButton = root.querySelector("[data-solo-start]");
    const playerHeading = root.querySelector("[data-player-heading]");
    const playerList = root.querySelector("[data-player-list]");
    const setStatus = (message, isError = false) => {
      status.textContent = message;
      status.style.color = isError ? "#ff8ca0" : "#bceeff";
    };
    const modeLabel = () => selectedMode === "hunt-the-boss" ? "Hunt the Boss" : "Head to Head";
    const syncRoomSelection = () => {
      if (!room) return;
      room.level = selectedLevel;
      room.mode = selectedMode;
      room.status = selectedLevel ? "ready" : "waiting-for-level";
      globalThis.headSpaceMultiplayerRoom = { ...room };
    };
    const renderPlayers = () => {
      const players = Array.isArray(room?.players) && room.players.length
        ? room.players.slice(0, 4)
        : [{ id: "local-player", name: "YOU", host: true, ready: true }];
      playerHeading.textContent = `PLAYERS (${players.length}/4)`;
      playerList.replaceChildren();
      for (const player of players) {
        const row = document.createElement("div");
        row.className = "mp-player";
        const avatar = document.createElement("div");
        avatar.className = "mp-player-avatar";
        for (const source of [options.avatar?.characterUrl, options.avatar?.helmetUrl]) {
          if (!source) continue;
          const image = document.createElement("img");
          image.alt = "";
          image.src = source;
          avatar.appendChild(image);
        }
        const copy = document.createElement("div");
        const name = document.createElement("div");
        name.className = "mp-player-name";
        name.textContent = String(player.name || "PLAYER");
        const role = document.createElement("div");
        role.className = "mp-player-role";
        role.textContent = `${player.host ? "HOST" : "PLAYER"} · ${player.ready === false ? "WAITING" : "READY"}`;
        copy.append(name, role);
        row.append(avatar, copy);
        playerList.appendChild(row);
      }
    };
    root.__renderPlayers = renderPlayers;
    renderPlayers();
    for (const button of root.querySelectorAll(".mp-mode")) {
      button.setAttribute("aria-pressed", String(button.dataset.mode === selectedMode));
      button.addEventListener("click", () => {
        selectedMode = button.dataset.mode;
        for (const other of root.querySelectorAll(".mp-mode")) {
          other.setAttribute("aria-pressed", String(other.dataset.mode === selectedMode));
        }
        syncRoomSelection();
        setStatus(selectedLevel
          ? `Level ${selectedLevel} · ${modeLabel()} selected.`
          : `${modeLabel()} selected. Choose a level.`);
      });
    }

    for (const level of availableLevels) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mp-level";
      button.dataset.level = String(level);
      const borderPreview = createLevelBorderPreview(level);
      if (borderPreview) button.appendChild(borderPreview);
      const number = document.createElement("span");
      number.className = "mp-level-number";
      number.textContent = String(level);
      button.appendChild(number);
      const background = LEVEL_BACKGROUNDS[Number(level) - 1];
      if (background) button.style.backgroundImage = `url("${background}")`;
      button.setAttribute("aria-pressed", String(selectedLevel === level));
      button.addEventListener("click", () => {
        selectedLevel = level;
        for (const other of levels.querySelectorAll(".mp-level")) {
          other.setAttribute("aria-pressed", String(Number(other.dataset.level) === level));
        }
        syncRoomSelection();
        soloStartButton.disabled = false;
        setStatus(`Level ${level} · ${modeLabel()} selected.`);
      });
      levels.appendChild(button);
    }
    if (selectedLevel && availableLevels.includes(selectedLevel)) {
      soloStartButton.disabled = false;
      setStatus(`Level ${selectedLevel} · ${modeLabel()} selected.`);
    }

    root.querySelector(".mp-back").addEventListener("click", () => {
      close();
      options.onBack?.();
    });
    root.querySelector("[data-create]").addEventListener("click", async () => {
      if (!selectedLevel) {
        setStatus("Choose a level before opening the online lobbies.", true);
        return;
      }
      if (typeof options.onOpenOnlineLobbies !== "function") {
        setStatus("Online multiplayer is unavailable in this build.", true);
        return;
      }
      setStatus("Opening the hosted multiplayer lobbies...");
      try {
        await options.onOpenOnlineLobbies({ level: selectedLevel, mode: selectedMode });
      } catch (error) {
        console.error("Unable to open online multiplayer lobbies.", error);
        setStatus("Unable to open online lobbies. Check your connection and try again.", true);
      }
    });
    soloStartButton.addEventListener("click", () => {
      if (!selectedLevel) return;
      const launchRoom = room?.level === selectedLevel
        ? room
        : {
            code: "LOCAL1",
            level: selectedLevel,
            mode: selectedMode,
            maxPlayers: 4,
            privacy: "private",
            status: "solo-test",
            players: [{ id: "local-player", name: "YOU", host: true, ready: true }],
          };
      globalThis.headSpaceMultiplayerRoom = { ...launchRoom };
      options.onStartGame?.({ ...launchRoom });
    });
    root.querySelector("[data-join]").addEventListener("click", () => {
      const code = codeInput.value.trim().toUpperCase();
      if (code.length !== 6) {
        setStatus("Enter a valid 6-character private room code.", true);
        codeInput.focus();
        return;
      }
      codeInput.value = code;
      setStatus("Direct private room codes are not supported by this exported runtime yet. Use Online Lobbies.", true);
    });
    root.querySelector("[data-invite]").addEventListener("click", () => setStatus(room ? `Share room code ${room.code} with a friend.` : "Create a private room first, then share its code."));
    root.querySelector("[data-friends]").addEventListener("click", () => setStatus("Friend search will be available when online multiplayer is connected."));
    codeInput.addEventListener("input", () => { codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6); });
    root.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
        options.onBack?.();
        return;
      }
      if (event.key === "Tab") {
        const focusable = [...root.querySelectorAll("button:not(:disabled),input:not(:disabled)")];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    // Measure only after all dynamic controls exist, then reveal synchronously so
    // the home button never disappears into a hidden setup frame.
    fitSetupToViewport();
    root.style.visibility = "visible";
    requestAnimationFrame(() => {
      if (!root.isConnected) return;
      fitSetupToViewport();
      root.querySelector(".mp-back")?.focus();
    });
  }

  globalThis.HeadSpaceMultiplayerSetup = Object.freeze({ open, close, isOpen, updateRoom });
})();
