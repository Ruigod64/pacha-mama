/**
 * main.js — Core app init: navbar, menu tabs, loader, scroll-spy
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // ── Video de fondo — compatible con Opera y navegadores que bloquean autoplay ──
    var video = document.getElementById('heroVideo');
    if (video) {
      function tryPlay() {
        var p = video.play();
        if (p !== undefined) { p.catch(function () {}); }
      }

      tryPlay();

      // Si el autoplay fue bloqueado (Opera), reintenta en el primer gesto del usuario
      function onUserGesture() {
        tryPlay();
        document.removeEventListener('scroll',     onUserGesture);
        document.removeEventListener('touchstart', onUserGesture);
        document.removeEventListener('click',      onUserGesture);
      }
      document.addEventListener('scroll',     onUserGesture, { once: true, passive: true });
      document.addEventListener('touchstart', onUserGesture, { once: true, passive: true });
      document.addEventListener('click',      onUserGesture, { once: true });
    }

    // ── Navbar scroll behaviour ──
    var navbar    = document.getElementById('navbar');
    var siteHeader = document.querySelector('.site-header');
    var navToggle = document.getElementById('navToggle');
    var navMenu   = document.getElementById('navMenu');

    if (siteHeader) {
      var scrolled = false;
      function checkScroll() {
        var shouldScroll = window.scrollY > 60;
        if (shouldScroll !== scrolled) {
          scrolled = shouldScroll;
          siteHeader.classList.toggle('is-scrolled', shouldScroll);
        }
      }
      window.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
    }

    // ── Mobile nav toggle ──
    if (navToggle && navMenu) {

      function openMenu() {
        navMenu.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        if (siteHeader) siteHeader.classList.add('menu-is-open');
        document.body.style.overflow = 'hidden';
      }

      function closeMenu() {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        // Espera a que termine la animación de cierre (420ms) ANTES de
        // restaurar backdrop-filter en el header. Si se hace de inmediato,
        // el header se convierte en containing block del menú fixed y
        // la animación de salida se corta visualmente.
        setTimeout(function () {
          if (siteHeader) siteHeader.classList.remove('menu-is-open');
        }, 430);
      }

      navToggle.addEventListener('click', function () {
        var isOpen = navMenu.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
      });

      // Cerrar al hacer click en un link
      navMenu.querySelectorAll('.navbar__link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });

      // Cerrar con tecla Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('is-open')) closeMenu();
      });

      // Cerrar al tocar fuera del menú (solo el overlay, no el drawer)
      navMenu.addEventListener('click', function (e) {
        if (e.target === navMenu) closeMenu();
      });
    }

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id     = this.getAttribute('href');
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var offset = (navbar ? navbar.offsetHeight : 0) + 12;
        var top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });

    // ── Scroll-spy: highlight current nav link ──
    var sections = document.querySelectorAll('section[id], div[id]');
    var navLinks = document.querySelectorAll('.navbar__link[href^="#"]');

    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = '#' + entry.target.id;
            navLinks.forEach(function (l) {
              l.classList.toggle('is-current', l.getAttribute('href') === id);
            });
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' });

      sections.forEach(function (s) { spy.observe(s); });
    }

    // ── Menu Tabs ──
    var tabs   = document.querySelectorAll('.menu-tab');
    var panels = document.querySelectorAll('.menu-panel');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.getAttribute('data-tab');

        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) { p.classList.remove('is-active'); });

        this.classList.add('is-active');
        this.setAttribute('aria-selected', 'true');
        var panel = document.getElementById('tab-' + target);
        if (panel) panel.classList.add('is-active');
      });

      // Keyboard: arrow keys move between tabs
      tab.addEventListener('keydown', function (e) {
        var tabArr = Array.from(tabs);
        var idx    = tabArr.indexOf(this);
        var next;
        if (e.key === 'ArrowRight') { next = tabArr[idx + 1] || tabArr[0]; }
        if (e.key === 'ArrowLeft')  { next = tabArr[idx - 1] || tabArr[tabArr.length - 1]; }
        if (next) { next.focus(); next.click(); }
      });
    });

    // ── Hero scroll indicator click ──
    var scrollBtn = document.querySelector('.hero__scroll');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', function () {
        var target = document.getElementById('nosotros');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // ── Video fallback ──
    var video    = document.getElementById('heroVideo');
    var fallback = document.getElementById('heroFallback');
    if (video && fallback) {
      function showFallback() {
        video.style.display = 'none';
        fallback.classList.add('is-visible');
      }
      video.addEventListener('error', showFallback);
      if (video.canPlayType && !video.canPlayType('video/mp4')) {
        showFallback();
      }
    }

  });

})();
