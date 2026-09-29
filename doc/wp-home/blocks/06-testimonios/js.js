/*
  TESTIMONIOS — datos desde Google Apps Script (JSON)
  Cambia VG_TESTIMONIOS_URL si el servicio cambia.
  Campos: nombre, ciudad, texto, foto, iniciales

  Carrusel: siempre en movil; en desktop solo si hay mas de 4.
  Autoplay cada 5s.

  NOTA WP: no usar operadores AND dobles en este archivo.
  El bloque HTML de WP los convierte en entidad &#8230; y rompe el script.
*/
var VG_TESTIMONIOS_URL =
  'https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSQqouumIQOWq7JKMuz52Kae09HDZmTrvLjIIFr0xKN5rWpWCQ8UUkNx5-D_2LpFOJBfwY1AvYdV1o2scHFrdlljZPqGEWQGk9bcj3sxQUT1Zi5RSCdDW4uwajj-Fsaq-2LRt88gmr28oKa93vE76y-BQ86f_43Xj1GrRg0dFQksmetsS7vJSZ6Wd0grYFw_PNuunShDySed1S4twBYxT1OYJ_3sxGK-s1pL0DGAADg66277PF7IsMwavL6s1BChppodX08pH_K9H_fM01xkn5O3_CiHg' +
  String.fromCharCode(38) +
  'lib=M2SnLJq7JDL7qFd-lVq2TdiASQRJPY_AZ';

(function () {
  if (window.__vgTestimoniosBooted) return;
  window.__vgTestimoniosBooted = true;

  var AUTO_MS = 5000;
  var timer = null;
  var AMP = String.fromCharCode(38);

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, AMP + 'amp;')
      .replace(/</g, AMP + 'lt;')
      .replace(/>/g, AMP + 'gt;')
      .replace(/"/g, AMP + 'quot;')
      .replace(/'/g, AMP + '#39;');
  }

  function initialsFrom(item) {
    if (item.iniciales) return item.iniciales;
    var parts = String(item.nombre || '').trim().split(/\s+/);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function renderTestimonial(item) {
    var nombre = escapeHtml(item.nombre || '');
    var ciudad = escapeHtml(item.ciudad || '');
    var texto = escapeHtml(item.texto || '');
    var foto = String(item.foto || '').trim();
    var avatar;

    if (foto) {
      avatar =
        '<img class="vg-testimonial-avatar" src="' +
        escapeHtml(foto) +
        '" alt="' +
        nombre +
        '" width="120" height="120" loading="lazy">';
    } else {
      avatar =
        '<div class="vg-testimonial-avatar vg-testimonial-avatar-ph" aria-hidden="true">' +
        escapeHtml(initialsFrom(item)) +
        '</div>';
    }

    return (
      '<article class="vg-testimonial">' +
      avatar +
      '<blockquote><p>' +
      texto +
      '</p></blockquote>' +
      '<footer><strong>' +
      nombre +
      '</strong><span>' +
      ciudad +
      '</span></footer>' +
      '</article>'
    );
  }

  function loadingSpinner() {
    return (
      '<div class="vg-spinner" role="status" aria-live="polite">' +
      '<span class="vg-spinner-ring" aria-hidden="true"></span>' +
      '<span class="vg-spinner-text">Cargando testimonios...</span>' +
      '</div>'
    );
  }

  function cards(grid) {
    return Array.prototype.slice.call(grid.querySelectorAll('.vg-testimonial'));
  }

  function isMobile() {
    return (window.innerWidth || document.documentElement.clientWidth || 0) <= 768;
  }

  function needsCarousel(n) {
    return isMobile() || n > 4;
  }

  function currentSlide(list, items) {
    var mid = list.getBoundingClientRect().left + list.clientWidth / 2;
    var best = 0;
    var bestDist = Infinity;
    var i;
    var c;
    var d;
    for (i = 0; i < items.length; i += 1) {
      c = items[i].getBoundingClientRect();
      d = Math.abs(c.left + c.width / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  }

  function goToSlide(list, items, index) {
    if (!items.length) return;
    var next = ((index % items.length) + items.length) % items.length;
    list.scrollTo({ left: next * list.clientWidth, behavior: 'smooth' });
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startAuto(list, items, shell) {
    stopAuto();
    if (!shell) return;
    if (!shell.classList.contains('is-active')) return;
    if (items.length < 2) return;
    if (window.matchMedia) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    }
    timer = setInterval(function () {
      if (!shell.classList.contains('is-active')) return;
      goToSlide(list, items, currentSlide(list, items) + 1);
    }, AUTO_MS);
  }

  function ensureShell(grid) {
    if (grid.parentNode) {
      if (grid.parentNode.classList.contains('vg-testi-slider')) {
        return grid.parentNode;
      }
    }
    var shell = document.createElement('div');
    shell.className = 'vg-testi-slider';
    grid.parentNode.insertBefore(shell, grid);
    shell.appendChild(grid);
    return shell;
  }

  function syncDots(shell, list, items) {
    var best = currentSlide(list, items);
    var buttons = shell.querySelectorAll('.vg-testi-dot');
    var i;
    for (i = 0; i < buttons.length; i += 1) {
      if (i === best) buttons[i].classList.add('is-active');
      else buttons[i].classList.remove('is-active');
    }
  }

  function buildControls(shell, list, items) {
    if (shell.getAttribute('data-vg-controls')) return;
    shell.setAttribute('data-vg-controls', '1');

    var makeArrow = function (dir, label) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vg-testi-arrow vg-testi-' + dir;
      btn.setAttribute('aria-label', label);
      btn.innerHTML =
        dir === 'prev'
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        stopAuto();
        goToSlide(
          list,
          items,
          dir === 'prev' ? currentSlide(list, items) - 1 : currentSlide(list, items) + 1
        );
        startAuto(list, items, shell);
      });
      return btn;
    };

    shell.appendChild(makeArrow('prev', 'Testimonio anterior'));
    shell.appendChild(makeArrow('next', 'Testimonio siguiente'));

    var dots = document.createElement('div');
    dots.className = 'vg-testi-dots';
    items.forEach(function (_card, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vg-testi-dot' + (i === 0 ? ' is-active' : '');
      btn.setAttribute('aria-label', 'Testimonio ' + (i + 1));
      btn.addEventListener('click', function () {
        stopAuto();
        goToSlide(list, items, i);
        startAuto(list, items, shell);
      });
      dots.appendChild(btn);
    });
    shell.appendChild(dots);

    list.addEventListener(
      'scroll',
      function () {
        syncDots(shell, list, items);
      },
      { passive: true }
    );

    shell.addEventListener('mouseenter', stopAuto);
    shell.addEventListener('mouseleave', function () {
      startAuto(list, items, shell);
    });
  }

  function applyCarousel(grid) {
    var items = cards(grid);
    var on = needsCarousel(items.length);
    var shell = ensureShell(grid);
    var i;

    shell.classList.toggle('is-active', on);
    grid.classList.toggle('vg-is-carousel', on);

    if (!on) {
      stopAuto();
      grid.scrollLeft = 0;
      for (i = 0; i < items.length; i += 1) {
        items[i].style.removeProperty('flex');
        items[i].style.removeProperty('width');
        items[i].style.removeProperty('max-width');
        items[i].style.removeProperty('scroll-snap-align');
      }
      return;
    }

    buildControls(shell, grid, items);

    for (i = 0; i < items.length; i += 1) {
      items[i].style.setProperty('flex', '0 0 100%', 'important');
      items[i].style.setProperty('width', '100%', 'important');
      items[i].style.setProperty('max-width', '100%', 'important');
      items[i].style.setProperty('scroll-snap-align', 'center');
    }

    syncDots(shell, grid, items);
    startAuto(grid, items, shell);
  }

  function pickItems(data) {
    if (Array.isArray(data)) return data;
    if (data) {
      if (Array.isArray(data.testimonios)) return data.testimonios;
      if (Array.isArray(data.data)) return data.data;
    }
    return [];
  }

  function renderTestimonios(items) {
    var grid = document.getElementById('vg-testimonios-grid');
    if (!grid) return;

    if (!Array.isArray(items) || !items.length) {
      grid.innerHTML =
        '<p class="vg-testimonios-error">No hay testimonios por ahora.</p>';
      return;
    }

    stopAuto();

    var parent = grid.parentNode;
    if (parent) {
      if (parent.classList.contains('vg-testi-slider')) {
        var grand = parent.parentNode;
        grand.insertBefore(grid, parent);
        grand.removeChild(parent);
      }
    }

    grid.classList.remove('vg-is-carousel');
    grid.innerHTML = items.map(renderTestimonial).join('');

    try {
      applyCarousel(grid);
    } catch (err) {
      console.warn('[VG] Carrusel testimonios:', err);
    }
  }

  function loadTestimonios() {
    var grid = document.getElementById('vg-testimonios-grid');
    if (!grid) return false;
    if (grid.getAttribute('data-vg-loading')) return true;
    grid.setAttribute('data-vg-loading', '1');

    grid.innerHTML = loadingSpinner();

    fetch(VG_TESTIMONIOS_URL, { method: 'GET', mode: 'cors' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        renderTestimonios(pickItems(data));
      })
      .catch(function (err) {
        console.error('[VG] Error cargando testimonios:', err);
        grid.removeAttribute('data-vg-loading');
        grid.innerHTML =
          '<p class="vg-testimonios-error">No se pudieron cargar los testimonios.</p>';
      });

    return true;
  }

  function boot() {
    if (loadTestimonios()) return;
    var tries = 0;
    var wait = setInterval(function () {
      tries += 1;
      if (loadTestimonios()) {
        clearInterval(wait);
        return;
      }
      if (tries >= 40) clearInterval(wait);
    }, 250);
  }

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var grid = document.getElementById('vg-testimonios-grid');
      if (!grid) return;
      if (!cards(grid).length) return;
      try {
        applyCarousel(grid);
      } catch (err) {}
    }, 150);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
