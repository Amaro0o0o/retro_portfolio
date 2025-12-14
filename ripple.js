// ===============================
//  RIPPLE BACKGROUND SYSTEM
// ===============================

window.addEventListener("DOMContentLoaded", () => {

  // MAIN SCENE
  const scene = new THREE.Scene();
  const d = 5;
  const aspect = window.innerWidth / window.innerHeight;

  const camera = new THREE.OrthographicCamera(
    -d * aspect,
    d * aspect,
    d,
    -d,
    0.1,
    100
  );
  camera.position.set(0, 10, 18);
  camera.lookAt(0, 0, 0);
  camera.zoom = 1.5;
  camera.updateProjectionMatrix();

  // RENDERER
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ⭐ this line is new:
  renderer.domElement.classList.add('ripple-bg');

  document.body.prepend(renderer.domElement);


  // LIGHTS
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const dir = new THREE.DirectionalLight(0xffffff, 3);
  dir.position.set(0, 20, 10);
  scene.add(dir);

  // GEOMETRY
  const geometry = new THREE.PlaneGeometry(20, 20, 128, 128);
  geometry.rotateX(-Math.PI / 2);

  // SHADERS
  const vertexShader = `
    uniform float time;
    uniform float amplitude;
    uniform vec2 mousePos;
    uniform float mouseAmp;
    uniform float mouseFalloff;
    uniform vec2 mouseCenter;
    uniform float centerInfluence;
    varying float vDist;

    float gauss(float x, float sigma) {
      return exp(-(x*x)/(2.0*sigma*sigma));
    }

    void main() {
      vec3 pos = position;

      float dO = length(pos.xz);
      vDist = dO;

      float dC = distance(pos.xz, mouseCenter);
      float mainEnv = max(0.0, 1.0 - dC * 0.05);
      float mainWave = sin(dC*2.6 - time*1.6) * amplitude * mainEnv * centerInfluence;

      float dL = distance(pos.xz, mousePos);
      float env = gauss(dL, mouseFalloff);
      float local = mouseAmp * env * sin((1.0 - dL) * 4.5 - time * 2.5) * 0.35;

      pos.y += mainWave + local;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying float vDist;
    uniform float time;

    vec3 palette(float t) {
      vec3 nightfall = vec3(0.07, 0.09, 0.16);
      vec3 dusk = vec3(0.18, 0.23, 0.35);
      vec3 bloom = vec3(0.46, 0.36, 0.55);
      vec3 breeze = vec3(0.58, 0.69, 0.67);
      vec3 ember = vec3(0.94, 0.67, 0.54);

      float coolBlend = smoothstep(0.0, 0.55, t);
      float warmBlend = smoothstep(0.25, 0.95, t);

      vec3 cool = mix(nightfall, dusk, coolBlend);
      vec3 midtone = mix(bloom, breeze, smoothstep(0.2, 0.8, t));
      vec3 warm = mix(breeze, ember, warmBlend);

      vec3 base = mix(cool, midtone, smoothstep(0.15, 0.75, t));
      return mix(base, warm, smoothstep(0.45, 0.95, t));
    }
    

    void main() {
      float t = smoothstep(0.0, 11.0, vDist);

      float pulse = sin(vDist * 1.6 - time * 1.2) * 0.035;
      float shimmer = sin(vDist * 4.0 + time * 0.7) * 0.02;

      float mixValue = clamp(t + pulse + shimmer, 0.0, 1.0);
      vec3 col = palette(mixValue);

      col = mix(col, pow(col, vec3(1.2)), 0.35);
      float glow = smoothstep(3.5, 0.0, vDist);
      col += glow * 0.18;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  // MATERIAL
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      amplitude: { value: 0.12 },
      mousePos: { value: new THREE.Vector2(0, 0) },
      mouseAmp: { value: 0.0 },
      mouseFalloff: { value: 1.6 },
      mouseCenter: { value: new THREE.Vector2(0, 0) },
      centerInfluence: { value: 1.0 }
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide
  });
  window.material = material;

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // RIPPLE LOGIC
  let mouseAmpTarget = 0.0;
  let displayedAmp = 0.0;
  const origin = new THREE.Vector2(0, 0);
  const mouseCenterTarget = new THREE.Vector2(0, 0);
  let lastMove = performance.now() * 0.001;

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const dt = clock.getDelta();
    material.uniforms.time.value += dt;

    const now = performance.now() * 0.001;
    const idle = (now - lastMove) > 3.0;

    // Center follow
    material.uniforms.mouseCenter.value.lerp(
      idle ? origin : mouseCenterTarget,
      1.0 - Math.exp(-6.5 * dt)
    );

    // Amplitude smoothing
    displayedAmp += (mouseAmpTarget - displayedAmp) * (1.0 - Math.exp(-12.0 * dt));
    mouseAmpTarget *= Math.exp(-dt / 2.4);
    displayedAmp *= 0.995;

    material.uniforms.mouseAmp.value = displayedAmp;

    if (idle) {
      material.uniforms.mousePos.value.lerp(origin, 0.05);
    }

    renderer.render(scene, camera);
  }

  animate();

  // MOUSE INTERACTION
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  function onMove(e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hit = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(plane, hit)) return;

    material.uniforms.mousePos.value.set(hit.x, hit.z);

    // soft ripple impulse
    mouseAmpTarget = Math.min(1, mouseAmpTarget * 0.6 + 0.28);

    mouseCenterTarget.set(hit.x, hit.z);
    lastMove = performance.now() * 0.001;
  }

  window.addEventListener("pointermove", onMove, { passive: true });

  // RESIZE
  window.addEventListener("resize", () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

});
