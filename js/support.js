/**
 * support.js — Feature detection & polyfills for older browsers
 * Runs before any other script
 */
(function () {
  'use strict';

  var doc = document.documentElement;

  // ── requestAnimationFrame polyfill ──
  (function () {
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    var lastTime = 0;
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame  = window[vendors[x] + 'CancelAnimationFrame']
                                  || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (cb) {
        var now  = new Date().getTime();
        var wait = Math.max(0, 16 - (now - lastTime));
        var id   = window.setTimeout(function () { cb(now + wait); }, wait);
        lastTime = now + wait;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) { clearTimeout(id); };
    }
  })();

  // ── CSS.supports safe wrapper ──
  function supports(prop, val) {
    try {
      return window.CSS && CSS.supports(prop, val);
    } catch (e) { return false; }
  }

  // ── Feature flags on <html> ──
  if (!supports('display', 'grid'))           doc.classList.add('no-grid');
  if (!supports('aspect-ratio', '1'))         doc.classList.add('no-aspect-ratio');
  if (!supports('backdrop-filter', 'blur(1px)') &&
      !supports('-webkit-backdrop-filter', 'blur(1px)'))
                                              doc.classList.add('no-backdrop');
  if (!supports('gap', '1rem'))               doc.classList.add('no-gap');
  if (!supports('font-size', 'clamp(1rem,2vw,2rem)'))
                                              doc.classList.add('no-clamp');
  if (!supports('scroll-behavior', 'smooth')) doc.classList.add('no-smooth-scroll');
  if (!supports('color', 'var(--t)'))         doc.classList.add('no-custom-props');

  // ── Touch detection ──
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    doc.classList.add('is-touch');
  }

  // ── Reduced motion ──
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    doc.classList.add('reduce-motion');
  }

  // ── Smooth scroll polyfill for anchor links ──
  if (doc.classList.contains('no-smooth-scroll')) {
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
          var target = document.querySelector(this.getAttribute('href'));
          if (!target) return;
          e.preventDefault();
          smoothScrollTo(target.getBoundingClientRect().top + window.pageYOffset - 80, 700);
        });
      });
    });
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function smoothScrollTo(to, duration) {
    var start     = window.pageYOffset;
    var change    = to - start;
    var startTime = performance && performance.now ? performance.now() : Date.now();
    function tick(now) {
      var elapsed  = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + change * easeInOutQuad(progress));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ── IntersectionObserver presence ──
  if (!window.IntersectionObserver) {
    doc.classList.add('no-intersection-observer');
  }

})();
