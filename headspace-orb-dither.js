/* Dithered reactor light, cyan halo and ripples; never resizes orb bodies. */
(() => {
  "use strict";
  const scenes = new WeakMap();
  let nextOrb = 0;
  function createFilter() {
    if (!window.PIXI?.Filter) return null;
    const filter = new PIXI.Filter(null, `
      precision highp float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform vec4 inputSize;
      uniform vec4 outputFrame;
      uniform vec2 orbCenter;
      uniform vec2 orbRadius;
      uniform float orbTime;
      uniform float orbPhase;
      uniform vec3 orbHue;
      uniform float hueAmount;
      float bayer2(vec2 p) {
        vec2 b = mod(p, 2.0);
        return 2.0 * b.x + 3.0 * b.y - 4.0 * b.x * b.y;
      }
      void main() {
        vec4 sampleColor = texture2D(uSampler, vTextureCoord);
        vec2 local = (vTextureCoord * inputSize.xy + outputFrame.xy - orbCenter) / orbRadius;
        float radius = length(local);
        float pulse = 0.5 + 0.5 * sin(orbTime * (2.7 + 0.35 * sin(orbPhase)) + orbPhase);
        // Quantize straight RGB, then restore premultiplication so the soft
        // transparent rim cannot acquire dark boxes or colored fringes.
        vec3 color = sampleColor.rgb / max(sampleColor.a, 0.0001);
        float energy = max(color.r, max(color.g, color.b));
        color = mix(color, orbHue * energy, hueAmount);
        float core = 1.0 - smoothstep(0.1, 0.9, radius);
        color = color * (0.86 + pulse * 0.38) + vec3(0.10, 0.35, 0.40) * core * pulse;
        vec2 cell = floor(vTextureCoord * inputSize.xy / 2.0);
        float threshold = (4.0 * bayer2(cell) + bayer2(floor(cell / 2.0)) + 0.5) / 16.0;
        vec3 dithered = clamp(floor(color * 5.0 + threshold) / 5.0, 0.0, 1.0);
        // A soft rim stays close to the body; a faint ripple expands only
        // during the first second of each roughly three-second cycle.
        float halo = exp(-pow((radius - 0.96) / 0.14, 2.0)) * (0.07 + pulse * 0.09);
        float cycle = mod(orbTime + orbPhase, 2.8 + 0.3 * sin(orbPhase));
        float progress = clamp(cycle / 1.0, 0.0, 1.0);
        float ringRadius = 1.02 + 0.38 * progress;
        float ring = (1.0 - smoothstep(0.012, 0.045, abs(radius - ringRadius)))
          * sin(progress * 3.14159265) * 0.24;
        float glowAlpha = clamp(halo + ring, 0.0, 0.32);
        vec3 glow = mix(vec3(0.12, 0.85, 1.0), orbHue, hueAmount) * glowAlpha;
        gl_FragColor = vec4(dithered * sampleColor.a + glow * (1.0 - sampleColor.a),
          sampleColor.a + glowAlpha * (1.0 - sampleColor.a));
      }
    `, {orbCenter: [0, 0], orbRadius: [1, 1], orbTime: 0, orbPhase: (++nextOrb * 2.399963) % 6.283185,orbHue:[1,1,1],hueAmount:0});
    filter.padding = 0;
    filter.resolution = 1;
    filter.__headSpaceOrbDither = true;
    return filter;
  }
  gdjs.registerRuntimeScenePostEventsCallback(scene => {
    let state = scenes.get(scene);
    if (!state) { state = {time: 0, orbs: new Map()}; scenes.set(scene, state); }
    if (!scene.getVariables().get("Paused").getAsBoolean()) {
      state.time += Math.min(0.05, Math.max(0, scene.getElapsedTime() / 1000));
    }
    const active = new Set();
    for (const objects of [scene.getObjects("EmittedMaterial"), scene.getObjects("EmittedMaterialImage"), scene.__headSpaceRemoteOrbVisuals || []]) {
      for (const orb of objects) {
        const sprite = orb.getRendererObject?.();
        if (!sprite || sprite.destroyed || !sprite.visible) continue;
        let record = state.orbs.get(orb);
        if (record && record.sprite !== sprite) {
          release(record); state.orbs.delete(orb); record = null;
        }
        if (!record) {
          const effect = createFilter();
          if (!effect) continue;
          record = {sprite, effect}; state.orbs.set(orb, record);
        }
        active.add(orb);
        const effect = record.effect;
        effect.uniforms.orbHue = sprite.__headSpaceOrbHue || [1,1,1];
        effect.uniforms.hueAmount = sprite.__headSpaceOrbHue ? 0.85 : 0;
        const bounds = sprite.getBounds();
        effect.uniforms.orbCenter = [bounds.x + bounds.width / 2, bounds.y + bounds.height / 2];
        effect.uniforms.orbRadius = [Math.max(1, bounds.width / 2), Math.max(1, bounds.height / 2)];
        effect.uniforms.orbTime = state.time;
        effect.padding = Math.ceil(Math.max(bounds.width, bounds.height) * 0.24 + 2);
        if (effect && !(sprite.filters || []).includes(effect)) {
          // Keep authored glow and animation; do not accumulate extra filters.
          sprite.filters = [...(sprite.filters || []), effect];
        }
      }
    }
    for (const [orb, record] of state.orbs) {
      if (!active.has(orb)) { release(record); state.orbs.delete(orb); }
    }
  });
  function release({sprite, effect}) {
    if (!sprite.destroyed) sprite.filters = (sprite.filters || []).filter(f => f !== effect);
    effect.destroy();
  }
  gdjs.registerRuntimeSceneUnloadedCallback(scene => {
    const state = scenes.get(scene);
    if (state) for (const record of state.orbs.values()) release(record);
    scenes.delete(scene);
  });
})();
