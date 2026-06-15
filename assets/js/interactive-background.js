(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.error('Three.js is required. Load it before interactive-background.js.');
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let scene, camera, renderer;
  let particleSystem1, particleSystem2;
  let particleCount1, particleCount2;
  let sharedGlowTexture;
  let rafId = null;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let windowHalfX = window.innerWidth  / 2;
  let windowHalfY = window.innerHeight / 2;

  let resizeTimer = null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    let canvas = document.getElementById('three-background-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'three-background-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);
    }

    const isMobile = window.innerWidth < 768;
    particleCount1 = isMobile ? 1200 : 4000;
    particleCount2 = isMobile ? 200  : 600;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.z = 20;

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });
    // PERF: Cap pixel ratio at 1.25 to limit fragment shader fill-rate on high-DPI screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setSize(window.innerWidth, window.innerHeight);

    sharedGlowTexture = createGlowTexture();
    buildParticles();

    // Signal to CSS that the particle layer is active
    document.body.classList.add('particle-bg-active');

    window.addEventListener('resize', onWindowResizeDebounced);

    // Only track mouse on non-reduced-motion
    if (!prefersReducedMotion) {
      document.addEventListener('mousemove', onMouseMove);
    }

    document.addEventListener('visibilitychange', onVisibilityChange);

    rafId = requestAnimationFrame(animate);
  }

  function createGlowTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width  = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const cx = size / 2;
    const gradient = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
    gradient.addColorStop(0,   'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(56, 189, 248, 0.9)');
    gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
    gradient.addColorStop(1,   'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(canvas);
  }

  function buildParticles() {
    const makeSystem = (count, size, opacity, zOffset) => {
      const positions = new Float32Array(count * 3);
      const spread = size > 0.2 ? 60 : 50;
      const zSpread = size > 0.2 ? 40 : 45;

      for (let i = 0; i < count * 3; i += 3) {
        positions[i]     = (Math.random() - 0.5) * spread;
        positions[i + 1] = (Math.random() - 0.5) * spread;
        positions[i + 2] = (Math.random() - 0.5) * zSpread - zOffset;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.PointsMaterial({
        size,
        map: sharedGlowTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity,
      });

      return new THREE.Points(geo, mat);
    };

    particleSystem1 = makeSystem(particleCount1, 0.16, 0.65, 20);
    particleSystem2 = makeSystem(particleCount2, 0.42, 0.80, 15);

    scene.add(particleSystem1);
    scene.add(particleSystem2);
  }

  function disposeParticles() {
    if (particleSystem1) {
      scene.remove(particleSystem1);
      particleSystem1.geometry.dispose();
      particleSystem1.material.dispose();
      particleSystem1 = null;
    }
    if (particleSystem2) {
      scene.remove(particleSystem2);
      particleSystem2.geometry.dispose();
      particleSystem2.material.dispose();
      particleSystem2 = null;
    }
  }

  function onMouseMove(e) {
    mouseX = (e.clientX - windowHalfX) / windowHalfX;
    mouseY = (e.clientY - windowHalfY) / windowHalfY;
  }

  function onWindowResizeDebounced() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onWindowResize, 150);
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth  / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const isMobileNow    = window.innerWidth < 768;
    const currentIsMobile = particleCount1 < 2000;

    if (isMobileNow !== currentIsMobile) {
      disposeParticles();

      // @warning dispose texture before recreating to prevent VRAM leak
      if (sharedGlowTexture) {
        sharedGlowTexture.dispose();
        sharedGlowTexture = null;
      }

      particleCount1 = isMobileNow ? 1200 : 4000;
      particleCount2 = isMobileNow ? 200  : 600;

      sharedGlowTexture = createGlowTexture();
      buildParticles();
    }
  }

  function onVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      rafId = requestAnimationFrame(animate);
    }
  }

  function animate() {
    rafId = requestAnimationFrame(animate);

    const time = Date.now() * 0.00005;

    if (!prefersReducedMotion) {
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
    }

    if (particleSystem1) {
      particleSystem1.rotation.y = time * 0.15 + targetX * 0.08;
      particleSystem1.rotation.x = time * 0.05 + targetY * 0.05;
    }

    if (particleSystem2) {
      particleSystem2.rotation.y = -time * 0.08 + targetX * 0.12;
      particleSystem2.rotation.x = -time * 0.03 + targetY * 0.08;
    }

    renderer.render(scene, camera);
  }
})();
