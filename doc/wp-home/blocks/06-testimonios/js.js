/*
  TESTIMONIOS — datos desde Google Apps Script (JSON)
  Cambia VG_TESTIMONIOS_URL si el servicio cambia.
  Campos esperados: nombre, ciudad, texto, foto, iniciales
*/
var VG_TESTIMONIOS_URL =
  'https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSQqouumIQOWq7JKMuz52Kae09HDZmTrvLjIIFr0xKN5rWpWCQ8UUkNx5-D_2LpFOJBfwY1AvYdV1o2scHFrdlljZPqGEWQGk9bcj3sxQUT1Zi5RSCdDW4uwajj-Fsaq-2LRt88gmr28oKa93vE76y-BQ86f_43Xj1GrRg0dFQksmetsS7vJSZ6Wd0grYFw_PNuunShDySed1S4twBYxT1OYJ_3sxGK-s1pL0DGAADg66277PF7IsMwavL6s1BChppodX08pH_K9H_fM01xkn5O3_CiHg&lib=M2SnLJq7JDL7qFd-lVq2TdiASQRJPY_AZ';

(function () {
  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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

  function renderTestimonios(items) {
    var grid = document.getElementById('vg-testimonios-grid');
    if (!grid) return;

    if (!Array.isArray(items) || !items.length) {
      grid.innerHTML =
        '<p class="vg-testimonios-error">No hay testimonios por ahora.</p>';
      return;
    }

    grid.innerHTML = items.map(renderTestimonial).join('');
  }

  function loadingSpinner() {
    return (
      '<div class="vg-spinner" role="status" aria-live="polite">' +
      '<span class="vg-spinner-ring" aria-hidden="true"></span>' +
      '<span class="vg-spinner-text">Cargando testimonios…</span>' +
      '</div>'
    );
  }

  function loadTestimonios() {
    var grid = document.getElementById('vg-testimonios-grid');
    if (!grid) return;

    grid.innerHTML = loadingSpinner();

    fetch(VG_TESTIMONIOS_URL, { method: 'GET', mode: 'cors' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var items = Array.isArray(data)
          ? data
          : data && Array.isArray(data.testimonios)
            ? data.testimonios
            : data && Array.isArray(data.data)
              ? data.data
              : [];
        renderTestimonios(items);
      })
      .catch(function (err) {
        console.error('[VG] Error cargando testimonios:', err);
        grid.innerHTML =
          '<p class="vg-testimonios-error">No se pudieron cargar los testimonios.</p>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTestimonios);
  } else {
    loadTestimonios();
  }
})();
