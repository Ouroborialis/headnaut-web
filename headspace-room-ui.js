(function(root){
  'use strict';
  let panel, labels, banner, title, detail, scores, actions, status, hint, svg;
  let lastRound='', lastPhase='', lastBlocked=false, goUntil=0, resultRevealAt=0, seen=new Set(), trails=[];
  const tags=new Map();
  const dots=[];
  const service=()=>root.HeadSpaceMultiplayerService;
  const color=n=>service().playerColor(n);
  const name=(room,n)=>room.players.find(p=>p.playerNumber===n)?.name || `PLAYER ${n}`;
  function build(){
    if(panel)return;
    panel=document.createElement('div');panel.id='headspace-room-ui';
    panel.innerHTML=`<style>
      #headspace-room-ui{position:fixed;inset:0;z-index:2147483647;pointer-events:none;font:600 14px/1.35 Arial,sans-serif;color:white}
      #headspace-room-ui *{box-sizing:border-box}
      #headspace-room-ui .room-tag{position:absolute;transform:translate(-50%,-100%);background:rgba(0,8,18,.82);border-bottom:3px solid var(--color);border-radius:6px;padding:3px 8px;white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 2px black;font-size:clamp(10px,1.2vw,14px)}
      #headspace-room-ui .room-tag.pulse{box-shadow:0 0 18px var(--color);background:#12342c}
      #headspace-room-ui .room-status{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);padding:5px 10px;border-radius:8px;background:rgba(0,8,18,.8);font-size:12px;text-align:center;max-width:65vw}
      #headspace-room-ui .room-hint{position:absolute;top:12px;left:50%;transform:translateX(-50%);padding:7px 12px;border-radius:8px;background:rgba(0,8,18,.85);font-size:12px;text-align:center;max-width:40vw}
      #headspace-room-ui .room-veil{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,6,14,.64);pointer-events:auto}
      #headspace-room-ui .room-card{width:min(460px,90vw);max-height:90vh;overflow:auto;text-align:center;background:#031221;border:2px solid #59d6ff;border-radius:18px;padding:22px;box-shadow:0 0 32px #164d68}
      #headspace-room-ui h2{font-size:clamp(26px,5vw,48px);line-height:1.1;margin:0 0 14px}
      #headspace-room-ui p{margin:8px 0 14px;color:#c1e9fc}
      #headspace-room-ui .room-score{display:flex;justify-content:space-between;border-left:4px solid var(--color);padding:8px 12px;background:#0b2335;margin:5px 0;text-align:left}
      #headspace-room-ui button{display:block;width:100%;margin:9px 0 0;min-height:42px;border:2px solid #59d6ff;border-radius:8px;background:#092a3c;color:white;font:bold 15px Arial;cursor:pointer;touch-action:manipulation}
      #headspace-room-ui button:disabled{opacity:.5;cursor:default}
      #headspace-room-ui button:focus-visible{outline:3px solid white;outline-offset:2px}
      #headspace-room-ui svg{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;pointer-events:none}
      @media(max-height:500px){#headspace-room-ui .room-card{padding:12px;max-width:420px}#headspace-room-ui h2{font-size:28px;margin-bottom:6px}#headspace-room-ui .room-score{padding:4px 10px}#headspace-room-ui p{margin:6px}#headspace-room-ui .room-hint{top:auto;bottom:42px;max-width:65vw}}
    </style><svg aria-hidden="true"></svg><div class="room-labels"></div><div class="room-hint"></div><div class="room-status" role="status"></div><div class="room-veil"><section class="room-card" role="dialog" aria-label="Multiplayer match"><h2 aria-live="polite"></h2><p></p><div class="room-scores"></div><div class="room-actions"></div></section></div>`;
    document.body.appendChild(panel);
    labels=panel.querySelector('.room-labels');banner=panel.querySelector('.room-veil');title=panel.querySelector('h2');detail=panel.querySelector('p');scores=panel.querySelector('.room-scores');actions=panel.querySelector('.room-actions');status=panel.querySelector('.room-status');hint=panel.querySelector('.room-hint');svg=panel.querySelector('svg');
    for(let i=0;i<40;i++){const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.style.display='none';svg.appendChild(dot);dots.push(dot);}
    for(const type of ['pointerdown','pointerup','click','touchstart','touchend'])banner.addEventListener(type,e=>e.stopPropagation());
  }
  const text=(node,value)=>{if(node.textContent!==value)node.textContent=value;};
  function hide(){if(panel)panel.style.display='none';}
  function update(scene,room,flow,onLeave){
    build();panel.style.display='block';
    const key=`${room.code}:${room.round}`;
    if(lastRound!==key){lastRound=key;lastPhase='';seen.clear();trails=[];actions.dataset.key='';}
    if(room.phase==='results' && lastPhase!=='results')resultRevealAt=performance.now()+650;
    lastPhase=room.phase;
    if(lastBlocked && !flow.blocked)goUntil=performance.now()+650;
    lastBlocked=flow.blocked;
    const canvas=document.querySelector('canvas'),rect=canvas?.getBoundingClientRect();if(!rect)return;
    const point=(x,y)=>{const c=scene.getLayer('').convertInverseCoords(x,y);return {x:rect.left+c[0]*rect.width/scene._cachedGameResolutionWidth,y:rect.top+c[1]*rect.height/scene._cachedGameResolutionHeight};};
    const live=scene.getObjects('Player');
    const activeIds=new Set(live.map(p=>p.__headSpaceRoomPlayerNumber));
    for(const [id,tag] of tags)if(!activeIds.has(id)){tag.remove();tags.delete(id);}
    for(const p of live){
      const id=p.__headSpaceRoomPlayerNumber;if(!id)continue;
      let tag=tags.get(id);if(!tag){tag=document.createElement('div');tag.className='room-tag';tag.dataset.player=String(id);labels.appendChild(tag);tags.set(id,tag);}
      const at=point(p.getCenterXInScene(),p.getCenterYInScene()-p.getWidth()/2);
      tag.style.left=`${at.x}px`;tag.style.top=`${at.y-9}px`;tag.style.setProperty('--color',color(id));
      const absorbing=trails.some(t=>t.event.to===id && Date.now()-t.event.at<650);
      tag.classList.toggle('pulse',absorbing);
      text(tag,`${id===room.localPlayerNumber?'YOU · ':''}${name(room,id)}${absorbing?' · ABSORBING':''}`);
      tag.style.display=at.x<rect.left||at.x>rect.right||at.y<rect.top+20||at.y>rect.bottom?'none':'block';
    }
    for(const event of service().getFeedback())if(!seen.has(event.id)){seen.add(event.id);trails.push({event});}
    if(seen.size>128)seen=new Set(service().getFeedback().map(e=>e.id));
    trails=trails.filter(t=>Date.now()-t.event.at<650).slice(-8);
    let dotIndex=0;
    for(const {event:e} of trails){
      const a=point(e.fromX,e.fromY),b=point(e.toX,e.toY),age=(Date.now()-e.at)/650;
      for(let i=0;i<5;i++){
        const t=Math.max(0,Math.min(1,age*1.5-i*.1));
        const dot=dots[dotIndex++];dot.style.display='block';
        dot.setAttribute('cx',String(a.x+(b.x-a.x)*t));dot.setAttribute('cy',String(a.y+(b.y-a.y)*t));dot.setAttribute('r',String(2.5+(1-age)*2));dot.setAttribute('fill',color(e.to));dot.setAttribute('opacity',String(1-age));dot.style.filter=`drop-shadow(0 0 5px ${color(e.to)})`;
      }
    }
    while(dotIndex<dots.length)dots[dotIndex++].style.display='none';
    const connectionText=room.players.map(p=>`${p.name}: ${p.expired?'left':p.connection==='reconnecting'?'reconnecting':p.host?'host':Number.isFinite(p.ping)?`${p.ping>250?'lagging · ':''}${p.ping} ms`:'connected'}`).join(' · ');
    status.style.color=flow.reconnecting || room.players.some(p=>p.ping>250)?'#ffd76a':'white';
    text(status,`${activeIds.has(room.localPlayerNumber)?'':'SPECTATING · '}${connectionText}`);
    text(hint,room.mode==='head-to-head'?'Larger players absorb smaller players. Equal sizes cannot absorb each other.':'Work together to absorb the boss.');
    hint.style.display=room.phase==='playing' && !flow.blocked?'block':'none';
    const go=!flow.blocked && performance.now()<goUntil;
    banner.style.display=(flow.blocked||go) && !(room.phase==='results' && performance.now()<resultRevealAt)?'flex':'none';banner.style.pointerEvents=flow.blocked?'auto':'none';
    let heading='',description='',buttons=[];
    if(room.closed){heading='ROOM DISCONNECTED';description=room.closed;buttons=[['LEAVE ROOM',onLeave]];}
    else if(room.phase==='results'){
      heading=room.mode==='hunt-the-boss'?'TEAM VICTORY':room.result.winners.length?`${name(room,room.result.winners[0])} WINS`:'ROUND ENDED';
      description=room.result.reason==='disconnect'?'The reconnect window expired.':`Round ${room.round} complete.`;
      if(room.isHost)buttons=[['PLAY AGAIN',()=>service().startRoom()],['CHOOSE LEVEL / MODE',()=>service().returnToLobby()]];
      else description+=' Waiting for the host to choose the next round.';
      buttons.push(['LEAVE ROOM',onLeave]);
    } else if(room.phase==='loading'){heading='GET READY';description=`Waiting for players to load (${room.players.filter(p=>p.loaded&&!p.expired).length}/${room.players.filter(p=>!p.expired).length})`;buttons=[['LEAVE ROOM',onLeave]];}
    else if(flow.reconnecting){heading='RECONNECTING';description=`Match paused while the connection returns. ${Number.isFinite(flow.rejoinSeconds)?flow.rejoinSeconds:20}s remaining.`;buttons=[['LEAVE ROOM',onLeave]];}
    else if(room.phase==='countdown' && flow.remaining>0){heading=String(Math.ceil(flow.remaining));description=`Level ${room.level} · ${room.mode==='head-to-head'?'Head to Head':'Hunt the Boss'}`;}
    else if(go){heading='GO!';description='';}
    text(title,heading);text(detail,description);
    const actionKey=`${room.round}:${heading==='GET READY'?'loading':room.phase}:${room.closed}:${flow.reconnecting}:${room.isHost}`;
    if(actions.dataset.key!==actionKey){
      actions.dataset.key=actionKey;actions.replaceChildren();scores.replaceChildren();
      if(room.phase==='results')for(const member of [...room.players].sort((a,b)=>(b.wins||0)-(a.wins||0))){
        const row=document.createElement('div');row.className='room-score';row.style.setProperty('--color',color(member.playerNumber));
        const label=document.createElement('span');label.textContent=member.name;const score=document.createElement('strong');score.textContent=`${member.wins||0} ${member.wins===1?'win':'wins'}`;row.append(label,score);scores.append(row);
      }
      for(const [label,action] of buttons){const button=document.createElement('button');button.textContent=label;button.dataset.roomAction=label;button.addEventListener('click',()=>{try{action();}catch(error){text(detail,error.message);}});actions.append(button);}
    }
  }
  root.HeadSpaceRoomUI=Object.freeze({update,hide});
})(globalThis);
