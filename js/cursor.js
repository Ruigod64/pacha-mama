/**
 * cursor.js — Custom leaf cursor
 */
(function () {
  'use strict';

  var cursor     = document.getElementById('customCursor');
  var leafNormal = document.getElementById('cursorNormal');
  var leafDark   = document.getElementById('cursorDark');

  if (!cursor) return;

  // Hide on touch devices
  if (document.documentElement.classList.contains('is-touch')) {
    cursor.style.display = 'none';
    return;
  }

  var posX = 0, posY = 0;
  var curX = 0, curY = 0;
  var raf;

  // Smooth follow with lerp
  function lerp(a, b, n) { return (1 - n) * a + n * b; }

  function loop() {
    curX = lerp(curX, posX, 0.14);
    curY = lerp(curY, posY, 0.14);
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener('mousemove', function (e) {
    posX = e.clientX;
    posY = e.clientY;
  });

  // Click — darker leaf
  document.addEventListener('mousedown', function () {
    cursor.classList.add('is-clicking');
  });
  document.addEventListener('mouseup', function () {
    cursor.classList.remove('is-clicking');
  });

  // Hover on interactive elements — rotate + scale
  var interactives = 'a, button, [role="button"], input, textarea, select, label, .gallery-card, .menu-item, .review-card';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(interactives)) {
      cursor.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(interactives)) {
      cursor.classList.remove('is-hovering');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', function () {
    cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    cursor.style.opacity = '1';
  });

  // ── Overlays sobre Google Maps ──
  // El overlay (pointer-events:auto) permite que document reciba mousemove
  // → el cursor sigue al mouse. En mousedown, lo hace transparente brevemente
  // para que el click/drag llegue al iframe; en mouseup lo restaura.
  document.querySelectorAll('.map-overlay').forEach(function (overlay) {
    overlay.addEventListener('mousedown', function () {
      overlay.style.pointerEvents = 'none';      // click pasa al iframe
      function restore() {
        overlay.style.pointerEvents = '';         // restaura captura del mouse
        document.removeEventListener('mouseup', restore);
      }
      document.addEventListener('mouseup', restore);
    });
  });

  // Init
  cursor.style.opacity = '0';
  document.addEventListener('mousemove', function showCursor() {
    cursor.style.opacity = '1';
    document.removeEventListener('mousemove', showCursor);
  }, { once: true });

  loop();

})();
