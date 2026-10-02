/* Ordered dithering for energy orbs; does not alter gameplay geometry. */
(() => {
  "use strict";
  let filter;
  function getFilter() {
    if (filter) return filter;
    if (!window.PIXI?.Filter) return null;
    filter = new PIXI.Filter(null, `
      precision highp float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform vec4 inputSize;
      float bayer2(vec2 p) {
        vec2 b = mod(p, 2.0);
        return 2.0 * b.x + 3.0 * b.y - 4.0 * b.x * b.y;
      }
      void main() {
        vec4 sampleColor = texture2D(uSampler, vTextureCoord);
        // Quantize straight RGB, then restore premultiplication so the soft
        // transparent rim cannot acquire dark boxes or colored fringes.
        vec3 color = sampleColor.rgb / max(sampleColor.a, 0.0001);
        vec2 cell = floor(vTextureCoord * inputSize.xy / 2.0);
        float threshold = (4.0 * bayer2(cell) + bayer2(floor(cell / 2.0)) + 0.5) / 16.0;
        vec3 dithered = clamp(floor(color * 5.0 + threshold) / 5.0, 0.0, 1.0);
        gl_FragColor = vec4(dithered * sampleColor.a, sampleColor.a);
      }
    `);
    filter.padding = 0;
    filter.resolution = 1;
    filter.__headSpaceOrbDither = true;
    return filter;
  }
  gdjs.registerRuntimeScenePostEventsCallback(scene => {
    for (const name of ["EmittedMaterial", "EmittedMaterialImage"]) {
      for (const orb of scene.getObjects(name)) {
        const sprite = orb.getRendererObject?.();
        if (!sprite || sprite.destroyed || !sprite.visible) continue;
        const effect = getFilter();
        if (effect && !(sprite.filters || []).includes(effect)) {
          // Keep authored glow and animation; do not accumulate extra filters.
          sprite.filters = [...(sprite.filters || []), effect];
        }
      }
    }
  });
})();
