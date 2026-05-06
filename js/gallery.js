/**
 * gallery.js — Gallery lightbox / keyboard navigation
 */
(function () {
  'use strict';

  var cards = document.querySelectorAll('.gallery-card');
  if (!cards.length) return;

  // Make cards keyboard-accessible
  cards.forEach(function (card, i) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    var name = card.querySelector('.gallery-card__name');
    if (name) card.setAttribute('aria-label', 'Ver ' + name.textContent);

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
    card.addEventListener('click', function () { openLightbox(i); });
  });

  // ── Simple lightbox ──
  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Imagen ampliada');
  overlay.innerHTML =
    '<div class="lightbox-inner">' +
      '<button class="lightbox-close" aria-label="Cerrar">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
      '<button class="lightbox-prev" aria-label="Anterior">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>' +
      '</button>' +
      '<div class="lightbox-media"></div>' +
      '<button class="lightbox-next" aria-label="Siguiente">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</button>' +
      '<div class="lightbox-caption"></div>' +
    '</div>';
  document.body.appendChild(overlay);

  var lbMedia   = overlay.querySelector('.lightbox-media');
  var lbCaption = overlay.querySelector('.lightbox-caption');
  var lbClose   = overlay.querySelector('.lightbox-close');
  var lbPrev    = overlay.querySelector('.lightbox-prev');
  var lbNext    = overlay.querySelector('.lightbox-next');
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    renderSlide(currentIndex);
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    cards[currentIndex].focus();
  }

  function renderSlide(index) {
    var card = cards[index];
    var img  = card.querySelector('.gallery-card__img');
    var name = card.querySelector('.gallery-card__name');
    var cat  = card.querySelector('.gallery-card__cat');

    lbMedia.innerHTML = '';
    if (img && img.src && !img.src.endsWith('undefined')) {
      var clone = img.cloneNode();
      clone.style.cssText = 'max-height:80vh; max-width:100%; object-fit:contain; border-radius:12px;';
      lbMedia.appendChild(clone);
    } else {
      // Show placeholder
      var ph = card.querySelector('.gallery-card__placeholder').cloneNode(true);
      ph.style.cssText = 'width:420px; max-width:90vw; height:315px; border-radius:12px; position:static;';
      lbMedia.appendChild(ph);
    }

    lbCaption.innerHTML = (name ? '<strong>' + name.textContent + '</strong>' : '') +
                          (cat  ? ' <span>' + cat.textContent + '</span>' : '');
    lbPrev.style.display = index === 0 ? 'none' : '';
    lbNext.style.display = index === cards.length - 1 ? 'none' : '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () { if (currentIndex > 0) renderSlide(--currentIndex); });
  lbNext.addEventListener('click', function () { if (currentIndex < cards.length - 1) renderSlide(++currentIndex); });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft'  && currentIndex > 0)              renderSlide(--currentIndex);
    if (e.key === 'ArrowRight' && currentIndex < cards.length-1) renderSlide(++currentIndex);
  });

  // ── Lightbox styles (injected) ──
  var style = document.createElement('style');
  style.textContent = [
    '.lightbox-overlay{position:fixed;inset:0;background:rgba(27,27,27,0.93);z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.3s ease;}',
    '.lightbox-overlay.is-open{opacity:1;pointer-events:all;}',
    '.lightbox-inner{position:relative;max-width:90vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;gap:1rem;}',
    '.lightbox-close{position:fixed;top:1.5rem;right:1.5rem;background:rgba(254,253,251,0.1);border:1.5px solid rgba(254,253,251,0.25);border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;color:#FEFDFB;cursor:pointer;transition:all 0.2s;}',
    '.lightbox-close:hover{background:rgba(254,253,251,0.2);}',
    '.lightbox-close svg,.lightbox-prev svg,.lightbox-next svg{width:20px;height:20px;}',
    '.lightbox-prev,.lightbox-next{position:fixed;top:50%;transform:translateY(-50%);background:rgba(254,253,251,0.1);border:1.5px solid rgba(254,253,251,0.2);border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;color:#FEFDFB;cursor:pointer;transition:all 0.2s;}',
    '.lightbox-prev{left:1.5rem;} .lightbox-next{right:1.5rem;}',
    '.lightbox-prev:hover,.lightbox-next:hover{background:rgba(64,145,108,0.5);}',
    '.lightbox-caption{color:rgba(254,253,251,0.8);text-align:center;font-family:Raleway,sans-serif;font-size:0.9rem;}',
    '.lightbox-caption strong{color:#FEFDFB;font-size:1rem;display:block;margin-bottom:0.25rem;}',
    '.lightbox-caption span{font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:#74C69D;}',
  ].join('');
  document.head.appendChild(style);

})();
