(function () {
  'use strict';

  if (navigator.maxTouchPoints > 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // NOTE: Half-sizes derived from CSS .custom-cursor-dot (6px) and .custom-cursor-ring (32px)
  const DOT_HALF  = 3;
  const RING_HALF = 16;

  const LERP_DOT          = 0.25;
  const LERP_RING         = 0.09;
  const LERP_RING_MAGNETIC = 0.16;
  const LERP_SCALE        = 0.12;
  const LERP_OPACITY      = 0.1;

  const HOVER_SELECTOR = 'a, button, .card, .project-card, .bento-card, .certificate-card, .floating-cert-badge, .filter-btn, .logo-link, .social-icons a, input, textarea';
  const MAGNETIC_CLASSES = new Set(['btn', 'btn-primary-dash', 'btn-outline-dash', 'filter-btn', 'submit-btn', 'logo-link']);

  const mouse    = { x: -100, y: -100 };
  const dotPos   = { x: -100, y: -100 };
  const ringPos  = { x: -100, y: -100 };
  const magCenter = { x: 0, y: 0 };

  let dot, ring;
  let targetRingScale = 1, currentRingScale = 1;
  let targetDotScale  = 1, currentDotScale  = 1;
  let targetOpacity   = 0, currentOpacity   = 0;
  let activeMagEl   = null;
  let activeMagRect = null;
  let rafId = null;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function init() {
    dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    dot.setAttribute('aria-hidden', 'true');

    ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';
    ring.setAttribute('aria-hidden', 'true');

    document.body.append(dot, ring);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', () => { targetOpacity = 0; });
    document.addEventListener('mouseenter', () => { targetOpacity = 1; });
    window.addEventListener('scroll', refreshMagRect, { passive: true });
    window.addEventListener('resize', refreshMagRect);
    document.body.addEventListener('mouseover', onMouseOver);
    document.body.addEventListener('mouseout', onMouseOut);

    document.addEventListener('visibilitychange', onVisibilityChange);

    rafId = requestAnimationFrame(tick);
  }

  function onVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      rafId = requestAnimationFrame(tick);
    }
  }

  function refreshMagRect() {
    if (activeMagEl) {
      activeMagRect = activeMagEl.getBoundingClientRect();
    }
  }

  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    targetOpacity = 1;
  }

  function isMagneticTarget(el) {
    for (const cls of MAGNETIC_CLASSES) {
      if (el.classList.contains(cls)) return true;
    }
    return el.tagName === 'BUTTON' || !!el.closest('.navbar') || !!el.closest('.social-icons');
  }

  function onMouseOver(e) {
    const target = e.target.closest(HOVER_SELECTOR);
    if (!target) return;

    ring.classList.add('cursor-hover');
    targetRingScale = 1.6;
    targetDotScale  = 0.2;

    if (isMagneticTarget(target)) {
      if (activeMagEl !== target) {
        activeMagEl   = target;
        activeMagRect = target.getBoundingClientRect();
      }
    } else {
      activeMagEl   = null;
      activeMagRect = null;
    }
  }

  function onMouseOut(e) {
    const target = e.target.closest(HOVER_SELECTOR);
    if (!target) return;

    const next = e.relatedTarget?.closest(HOVER_SELECTOR);
    if (!next) {
      ring.classList.remove('cursor-hover');
      targetRingScale = 1;
      targetDotScale  = 1;
      activeMagEl     = null;
      activeMagRect   = null;
    }
  }

  function tick() {
    dotPos.x = lerp(dotPos.x, mouse.x, LERP_DOT);
    dotPos.y = lerp(dotPos.y, mouse.y, LERP_DOT);

    if (activeMagEl) {
      if (!activeMagRect) activeMagRect = activeMagEl.getBoundingClientRect();
      magCenter.x = activeMagRect.left + activeMagRect.width  / 2;
      magCenter.y = activeMagRect.top  + activeMagRect.height / 2;
      const targetX = magCenter.x * 0.7 + mouse.x * 0.3;
      const targetY = magCenter.y * 0.7 + mouse.y * 0.3;
      ringPos.x = lerp(ringPos.x, targetX, LERP_RING_MAGNETIC);
      ringPos.y = lerp(ringPos.y, targetY, LERP_RING_MAGNETIC);
    } else {
      ringPos.x = lerp(ringPos.x, mouse.x, LERP_RING);
      ringPos.y = lerp(ringPos.y, mouse.y, LERP_RING);
    }

    currentRingScale = lerp(currentRingScale, targetRingScale, LERP_SCALE);
    currentDotScale  = lerp(currentDotScale,  targetDotScale,  LERP_SCALE);
    currentOpacity   = lerp(currentOpacity,   targetOpacity,   LERP_OPACITY);

    dot.style.opacity  = currentOpacity;
    ring.style.opacity = currentOpacity;
    dot.style.transform  = `translate3d(${dotPos.x  - DOT_HALF}px,  ${dotPos.y  - DOT_HALF}px,  0) scale(${currentDotScale})`;
    ring.style.transform = `translate3d(${ringPos.x - RING_HALF}px, ${ringPos.y - RING_HALF}px, 0) scale(${currentRingScale})`;

    rafId = requestAnimationFrame(tick);
  }
})();
