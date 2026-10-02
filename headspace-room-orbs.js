/* Remote energy-orb visuals. Replicas never create physics bodies or mass. */
(() => {
  const states = new WeakMap();
  const palette = [0x32ff68, 0xff55bc, 0xffbd45, 0x73a5ff];
  function stateFor(scene, room) {
    let state = states.get(scene);
    if (state && state.round !== room.round) { clear(scene); state = null; }
    if (!state) {
      state = {round: room.round, ids: new WeakMap(), next: 0, visuals: new Map(), sources: new Map()};
      states.set(scene, state);
    }
    return state;
  }
  function valid(orbs, owner) {
    if (!Array.isArray(orbs)) return [];
    return orbs.slice(0, 180).filter(o => o && typeof o.id === 'string' && o.id.length < 80 &&
      [o.x,o.y,o.size,o.vx,o.vy,o.age].every(Number.isFinite) && o.size > 0 && o.size < 10000)
      .map(o => ({...o, owner}));
  }
  function capture(scene, room) {
    const state = stateFor(scene, room);
    const now = performance.now();
    const own = scene.getObjects('EmittedMaterial').slice(0,180).map(orb => {
      let id = state.ids.get(orb);
      if (!id) { id = {id: `${room.round}:${room.localPlayerNumber}:${++state.next}`, born: now}; state.ids.set(orb,id); }
      const physics = orb.getBehavior?.('Physics2');
      return {id:id.id,owner:room.localPlayerNumber,x:orb.getCenterXInScene(),y:orb.getCenterYInScene(),
        size:orb.getWidth(),vx:physics?.getLinearVelocityX?.()||0,vy:physics?.getLinearVelocityY?.()||0,age:(now-id.born)/1000};
    });
    if (!room.isHost) return own;
    for (const [owner,packet] of HeadSpaceMultiplayerService.getRemoteStates()) {
      if (!room.players.some(p=>p.playerNumber===owner && !p.expired)) continue;
      const old=state.sources.get(owner);
      if (!old || old.seq!==packet.seq) state.sources.set(owner,{seq:packet.seq,at:now});
      if (now-state.sources.get(owner).at<1500) own.push(...valid(packet.orbs,owner));
    }
    return own;
  }
  function clear(scene) {
    const state=states.get(scene);
    if(state) for(const visual of state.visuals.values()) visual.sprite.destroy();
    states.delete(scene); scene.__headSpaceRemoteOrbVisuals=[];
  }
  globalThis.HeadSpaceRoomOrbs={capture};
  gdjs.registerRuntimeScenePostEventsCallback(scene=>{
    const service=globalThis.HeadSpaceMultiplayerService,room=service?.getRoom?.();
    if(room?.status!=='playing' || room.phase==='results') { if(states.has(scene))clear(scene);return; }
    const state=stateFor(scene,room),now=performance.now(),seen=new Set();
    const packets=room.isHost?capture(scene,room):(service.getWorldState()?.orbs||[]);
    const data=gdjs.projectData.layouts.find(l=>l.name===scene.getName())?.objects.find(o=>o.name==='EmittedMaterialImage');
    const frames=data?.animations?.[0]?.directions?.[0]?.sprites;
    if(!frames?.length)return;
    const images=scene.getGame().getImageManager();
    for(const owner of room.players.map(p=>p.playerNumber).filter(n=>n!==room.localPlayerNumber)) {
      for(const packet of valid(packets.filter(o=>o.owner===owner),owner)) {
        const key=owner+':'+packet.id;seen.add(key);
        let visual=state.visuals.get(key);
        if(!visual){
          const sprite=new PIXI.Sprite();sprite.anchor.set(.5);sprite.eventMode='none';
          const color=palette[(owner-1)%palette.length];
          sprite.__headSpaceOrbHue=[((color>>16)&255)/255,((color>>8)&255)/255,(color&255)/255];
          scene.getLayer('').getRenderer().addRendererObject(sprite,5);
          visual={sprite,getRendererObject:()=>sprite,packet:null,at:now};state.visuals.set(key,visual);
        }
        if(visual.packet!==packet && (visual.packet?.age!==packet.age || visual.packet?.x!==packet.x || visual.packet?.y!==packet.y)) {visual.packet=packet;visual.at=now;}
        const dt=scene.getVariables().get('Paused').getAsBoolean()?0:Math.min(.08,(now-visual.at)/1000);
        const frame=frames[Math.floor((packet.age+dt)/.05)%frames.length];
        visual.sprite.texture=images.getPIXITexture(frame.image);
        visual.sprite.position.set(packet.x+packet.vx*dt,packet.y+packet.vy*dt);
        visual.sprite.width=packet.size;visual.sprite.height=packet.size;
      }
    }
    for(const [key,visual] of state.visuals)if(!seen.has(key)){visual.sprite.destroy();state.visuals.delete(key);}
    scene.__headSpaceRemoteOrbVisuals=[...state.visuals.values()];
  });
  gdjs.registerRuntimeSceneUnloadedCallback(clear);
})();
