/**
 * animations.js — GSAP ScrollTrigger animations
 * Requires GSAP + ScrollTrigger loaded before this script
 */
(function () {
  'use strict';

  // Bail if GSAP not available or user prefers reduced motion
  if (typeof gsap === 'undefined') { revealFallback(); return; }
  if (document.documentElement.classList.contains('reduce-motion')) return;

  gsap.registerPlugin(ScrollTrigger);

  // ── Hero entrance ──
  var heroTl = gsap.timeline({ delay: 0.2 });

  heroTl
    .fromTo('.hero__eyebrow',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo('.hero__title',
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo('.hero__subtitle',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
    .fromTo('.hero__actions',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo('.hero__scroll',
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power1.out' },
      '-=0.3'
    );

  // ── Hours strip ──
  gsap.from('.hours-strip__item', {
    scrollTrigger: { trigger: '.hours-strip', start: 'top 90%' },
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // ── About ──
  gsap.from('.about__content > *', {
    scrollTrigger: { trigger: '.about', start: 'top 75%' },
    opacity: 0,
    x: -40,
    duration: 0.8,
    stagger: 0.14,
    ease: 'power3.out'
  });

  gsap.from('.about__visual', {
    scrollTrigger: { trigger: '.about__visual', start: 'top 80%' },
    opacity: 0,
    x: 40,
    duration: 0.9,
    ease: 'power3.out'
  });

  // ── Section headers ──
  gsap.utils.toArray('.menu-section__header, .gallery-section__header, .branches-section__header, .reviews-section__header, .reservation-section__header').forEach(function (el) {
    gsap.from(el.children, {
      scrollTrigger: { trigger: el, start: 'top 82%' },
      opacity: 0,
      y: 28,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out'
    });
  });

  // ── Menu items ──
  gsap.from('.menu-tab', {
    scrollTrigger: { trigger: '.menu-tabs', start: 'top 85%' },
    opacity: 0,
    y: 16,
    duration: 0.5,
    stagger: 0.06,
    ease: 'power2.out'
  });

  // ── Gallery cards stagger ──
  gsap.from('.gallery-card', {
    scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%' },
    opacity: 0,
    y: 35,
    scale: 0.96,
    duration: 0.65,
    stagger: 0.08,
    ease: 'power2.out'
  });

  // ── Branch cards ──
  gsap.from('.branch-card', {
    scrollTrigger: { trigger: '.branches-grid', start: 'top 80%' },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // ── Review cards ──
  gsap.from('.review-card', {
    scrollTrigger: { trigger: '.reviews-track', start: 'top 85%' },
    opacity: 0,
    x: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // ── Reservation form ──
  gsap.from('.reservation-form-wrap', {
    scrollTrigger: { trigger: '.reservation-form-wrap', start: 'top 80%' },
    opacity: 0,
    y: 50,
    duration: 1.0,
    ease: 'power3.out'
  });

  // ── Footer brand ──
  gsap.from('.footer__brand', {
    scrollTrigger: { trigger: '.footer', start: 'top 90%' },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out'
  });

  // ── Animated stat counters ──
  var statEls = document.querySelectorAll('.about__stat-number[data-count]');
  statEls.forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    gsap.fromTo({ val: 0 }, { val: target }, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: function () {
        el.textContent = prefix + (Number.isInteger(target) ? Math.round(this.targets()[0].val) : this.targets()[0].val.toFixed(1)) + suffix;
      }
    });
  });

  // ── Parallax hero sutil — solo el fallback para no mover el video ──
  gsap.to('.hero__fallback', {
    scrollTrigger: { trigger: '.hero', scrub: 1.5 },
    yPercent: 18,
    ease: 'none'
  });

  // ── CSS-only fallback if GSAP not available ──
  function revealFallback() {
    document.querySelectorAll('.gsap-from-bottom, .gsap-from-left, .gsap-from-right, .gsap-scale-in').forEach(function (el) {
      el.style.opacity    = '1';
      el.style.transform  = 'none';
      el.style.visibility = 'visible';
    });
  }

})();
