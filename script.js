import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add a clock for getDelta()
const clock = new THREE.Clock();

// clamp device pixel ratio for performance
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));


// Fragment Shader with ripple effect and modern palette
const fragmentShader = `
  uniform float time;
  uniform vec2 resolution;

  vec3 palette(float t) {
    vec3 shadow = vec3(0.05, 0.06, 0.16);   // Dark indigo
    vec3 mid = vec3(0.27, 0.13, 0.58);      // Deep violet
    vec3 accent = vec3(0.96, 0.22, 0.60);   // Neon magenta
    vec3 highlight = vec3(0.99, 0.73, 0.32); // Warm gold

    float blend = smoothstep(0.25, 0.75, t);
    vec3 cool = mix(shadow, mid, smoothstep(0.0, 0.6, t));
    vec3 warm = mix(accent, highlight, smoothstep(0.4, 1.0, t));
    return mix(cool, warm, blend);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv.y = 1.0 - uv.y;

    float wave = sin(uv.x * 18.0 + time * 2.0) * 0.03;
    float ripple = sin(length(uv - 0.5) * 12.0 - time * 3.0) * 0.015;
    uv.y += wave + ripple;

    float gradientShift = 0.1 * sin(time * 0.4);
    float t = clamp(uv.y + gradientShift, 0.0, 1.0);
    vec3 color = palette(t);

    float vignette = smoothstep(0.8, 0.2, length(uv - 0.5) * 1.2);
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Vertex Shader
const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const uniforms = {
  time: { value: 0.0 },
  resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
};

const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    amplitude: { value: 0.12 },
    // ...
  },
  vertexShader: `...`,
  fragmentShader: `...`,
  side: THREE.DoubleSide
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// make these available globally so gui_theming.js can bind to them
window.material = material;
window.mesh     = mesh;
window.scene    = scene;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  uniforms.time.value += 0.02;
  renderer.render(scene, camera);
}

animate();

// attach pointer listeners so GUI-driven uniform changes get used
window.addEventListener('pointermove', onPointerMove, { passive: true });
window.addEventListener('pointerdown', () => {
  // bump the ripple amplitude on click/tap (optional)
  if (window.material && window.material.uniforms && window.material.uniforms.mouseAmp) {
    window.material.uniforms.mouseAmp.value = Math.min(1.0, (window.material.uniforms.mouseAmp.value || 0) + 0.45);
  }
}, { passive: true });


// Handle Resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
});
