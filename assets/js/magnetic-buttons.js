(function () {
  'use strict';

  if (typeof gsap === 'undefined') {
    console.error('GSAP is required. Load it before magnetic-buttons.js.');
    return;
  }

  if (navigator.maxTouchPoints > 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const TARGET_SELECTOR = '.btn-primary-dash, .btn-outline-dash, .filter-btn, .load-more-btn, .submit-btn, .logo-link, .navbar a, .social-icons a, .footer-social a, .footer-icon-top a, .magnetic-btn';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const targets = document.querySelectorAll(TARGET_SELECTOR);

    targets.forEach((button) => {
      button.style.transformStyle   = 'preserve-3d';
      button.style.backfaceVisibility = 'hidden';

      const isNavbarLink  = !!button.closest('.navbar');
      const isSocialIcon  = !!button.closest('.social-icons') || !!button.closest('.footer-social');

      let strength = 0.35;
      if (isNavbarLink) strength = 0.25;
      if (isSocialIcon) strength = 0.45;

      let rect     = null;
      let children = null;

      // PERF: rAF flag prevents queuing multiple GSAP tweens per frame
      let rafPending = false;
      let pendingX = 0, pendingY = 0;

      button.addEventListener('mouseenter', () => {
        rect     = button.getBoundingClientRect();
        children = button.querySelectorAll('i, span, h3, h4');
      });

      button.addEventListener('mousemove', (e) => {
        if (!rect) rect = button.getBoundingClientRect();

        pendingX = e.clientX - (rect.left + rect.width  / 2);
        pendingY = e.clientY - (rect.top  + rect.height / 2);

        if (!rafPending) {
          rafPending = true;
          requestAnimationFrame(() => {
            rafPending = false;

            gsap.to(button, {
              x: pendingX * strength,
              y: pendingY * strength,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto',
            });

            if (!children) children = button.querySelectorAll('i, span, h3, h4');
            if (children.length > 0) {
              gsap.to(children, {
                x: pendingX * strength * 0.45,
                y: pendingY * strength * 0.45,
                duration: 0.35,
                ease: 'power2.out',
                stagger: 0.01,
                overwrite: 'auto',
              });
            }
          });
        }
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.85,
          ease: 'elastic.out(1.1, 0.4)',
          overwrite: 'auto',
        });

        if (children && children.length > 0) {
          gsap.to(children, {
            x: 0,
            y: 0,
            duration: 0.85,
            ease: 'elastic.out(1.1, 0.4)',
            overwrite: 'auto',
          });
        }

        // Reset cache — fresh rect needed next hover (handles scroll/resize)
        rect     = null;
        children = null;
      });
    });
  }
})();
