/**
 * reviews.js — Reviews carousel
 */
(function () {
  'use strict';

  var track   = document.querySelector('.reviews-track');
  var btnPrev = document.querySelector('.reviews-btn--prev');
  var btnNext = document.querySelector('.reviews-btn--next');
  var dotsEl  = document.querySelector('.reviews-dots');

  if (!track) return;

  var cards   = Array.from(track.querySelectorAll('.review-card'));
  var current = 0;
  var perView = getPerView();
  var maxIdx  = Math.max(0, cards.length - perView);
  var autoInterval;

  fixCardWidths();
  buildDots();
  update();

  // ── Controls ──
  if (btnPrev) btnPrev.addEventListener('click', function () { goTo(current - 1); });
  if (btnNext) btnNext.addEventListener('click', function () { goTo(current + 1); });

  // ── Dots ──
  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    var numDots = maxIdx + 1;
    for (var i = 0; i < numDots; i++) {
      (function (idx) {
        var btn = document.createElement('button');
        btn.className = 'reviews-dot' + (idx === 0 ? ' is-active' : '');
        btn.setAttribute('aria-label', 'Ir a reseña ' + (idx + 1));
        btn.addEventListener('click', function () { goTo(idx); });
        dotsEl.appendChild(btn);
      })(i);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIdx));
    update();
    restartAuto();
  }

  function update() {
    var cardWidth = cards[0] ? cards[0].offsetWidth + getGap() : 0;
    track.style.transform = 'translateX(-' + (current * cardWidth) + 'px)';

    if (btnPrev) btnPrev.disabled = (current === 0);
    if (btnNext) btnNext.disabled = (current >= maxIdx);

    // Update dots
    if (dotsEl) {
      var dots = dotsEl.querySelectorAll('.reviews-dot');
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === current);
      });
    }
  }

  // ── Touch / swipe ──
  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    var delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) {
      goTo(delta < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  // ── Keyboard navigation ──
  document.addEventListener('keydown', function (e) {
    var section = document.querySelector('.reviews-section');
    if (!section) return;
    var rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // ── Auto-advance ──
  function startAuto() {
    autoInterval = setInterval(function () {
      goTo(current >= maxIdx ? 0 : current + 1);
    }, 6000);
  }

  function restartAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  // Pause on hover
  var carousel = document.querySelector('.reviews-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', function () { clearInterval(autoInterval); });
    carousel.addEventListener('mouseleave', startAuto);
  }

  // ── Responsive resize ──
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var newPer = getPerView();
      if (newPer !== perView) {
        perView = newPer;
        maxIdx  = Math.max(0, cards.length - perView);
        current = Math.min(current, maxIdx);
        buildDots();
      }
      fixCardWidths();
      update();
    }, 150);
  });

  function getPerView() {
    if (window.innerWidth <= 540) return 1;
    if (window.innerWidth <= 860) return 2;
    return 3;
  }

  // Calcula y asigna el ancho exacto de cada card basado en el wrapper real.
  // Fórmula: cardW = (wrapperWidth - gap × (perView - 1)) / perView
  // Esto garantiza que exactamente `perView` cards caben sin overflow ni gap
  // y que el translateX del slide quede perfectamente centrado en todos los tamaños.
  function fixCardWidths() {
    var wrapper = document.querySelector('.reviews-track-wrapper');
    if (!wrapper) return;
    var gap   = getGap();
    var cardW = (wrapper.offsetWidth - gap * (perView - 1)) / perView;
    cards.forEach(function (c) {
      c.style.width     = cardW + 'px';
      c.style.flexBasis = cardW + 'px';
    });
  }

  function getGap() {
    var style = window.getComputedStyle(track);
    var raw = style.columnGap || style.gap || '0';
    var n   = parseInt(raw, 10);
    return isNaN(n) ? 0 : n;
  }

  // Start auto-advance (only if user hasn't opted out of motion)
  if (!document.documentElement.classList.contains('reduce-motion')) {
    startAuto();
  }

})();
