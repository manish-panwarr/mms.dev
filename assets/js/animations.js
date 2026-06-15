(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP and ScrollTrigger are required. Load them before animations.js.');
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);

  // Always mark js-enabled regardless of reduced-motion preference
  // so .js-enabled .reveal-hidden FOUC prevention CSS works correctly
  document.body.classList.add('js-enabled');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    document.body.classList.add('gsap-active');

    if (prefersReducedMotion) {
      initReducedMotion();
      return;
    }

    initFullAnimation();
  }

  // @info Immediately reveals all animated elements without motion for reduced-motion users
  function initReducedMotion() {
    document.querySelectorAll(
      '.card-animate, .section-title, .service-card, .bento-card, .animate-cert-main, .animate-cert-thumbs .certificate-card, .card-animate, .contact-wrapper > *, .footer > *'
    ).forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }

  function initFullAnimation() {
    // 1. PAGE LOAD ENTRANCE TIMELINE
    const loadTimeline = gsap.timeline({
      defaults: { ease: 'power4.out', duration: 1.2 },
    });

    loadTimeline.from('.header', {
      y: -50,
      opacity: 0,
      duration: 1.0,
    });

    const heroCards = document.querySelectorAll('.home-dashboard .card-animate');
    if (heroCards.length > 0) {
      loadTimeline.from(heroCards, {
        y: 60,
        opacity: 0,
        filter: 'blur(6px)',
        stagger: 0.07,
        duration: 1.3,
        ease: 'power3.out',
        // PERF: clearProps essential — removes inline filter/opacity so CSS hover transitions work
        clearProps: 'all',
      }, '-=0.6');
    }

    if (document.querySelector('.dashboard-footer')) {
      loadTimeline.from('.dashboard-footer', {
        opacity: 0,
        y: 20,
        duration: 0.8,
      }, '-=0.8');
    }

    // 2. SCROLL TRIGGER REVEALS
    const makeScrollReveal = (selector, vars) => {
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return;
      elements.forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: vars.start || 'top 88%',
            toggleActions: 'play none none none',
          },
          ...vars.from,
        });
      });
    };

    const makeGroupReveal = (containerSelector, itemSelector, vars) => {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      const items = container.querySelectorAll(itemSelector);
      if (!items.length) return;
      gsap.from(items, {
        scrollTrigger: {
          trigger: container,
          start: vars.start || 'top 82%',
          toggleActions: 'play none none none',
        },
        ...vars.from,
      });
    };

    makeScrollReveal('.section-title', {
      start: 'top 88%',
      from: { y: 35, opacity: 0, duration: 1.0, ease: 'power3.out' },
    });

    makeGroupReveal('.bento-grid', '.bento-card', {
      start: 'top 82%',
      from: { y: 50, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'power3.out', clearProps: 'all' },
    });

    const certSection = document.querySelector('.certificate-container');
    if (certSection) {
      gsap.from('.animate-cert-main', {
        scrollTrigger: { trigger: certSection, start: 'top 80%', toggleActions: 'play none none none' },
        x: -40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      gsap.from('.animate-cert-thumbs .certificate-card', {
        scrollTrigger: { trigger: certSection, start: 'top 75%', toggleActions: 'play none none none' },
        y: 30,
        opacity: 0,
        stagger: 0.05,
        duration: 1.0,
        ease: 'power3.out',
        clearProps: 'all',
      });
    }

    makeGroupReveal('.skills-grid', '.card-animate', {
      start: 'top 82%',
      from: { y: 45, opacity: 0, stagger: 0.06, duration: 1.2, ease: 'power3.out', clearProps: 'all' },
    });

    const contactWrapper = document.querySelector('.contact-section-wrapper');
    if (contactWrapper) {
      gsap.from(Array.from(contactWrapper.children), {
        scrollTrigger: { trigger: contactWrapper, start: 'top 80%', toggleActions: 'play none none none' },
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1.0,
        ease: 'power3.out',
        clearProps: 'all',
      });
    }

    if (document.querySelector('.footer')) {
      gsap.from('.footer > *', {
        scrollTrigger: { trigger: '.footer', start: 'top 92%', toggleActions: 'play none none none' },
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }
})();
