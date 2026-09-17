/*
  ============================================
  TESTIMONIOS — edita SOLO este array (JSON)
  ============================================
  Campos: nombre, ciudad, texto, foto, iniciales
  foto: URL de Medios (vacío = muestra iniciales)
  Foto ideal: 120×120 px, JPG/WebP, < 50 KB
*/
var VG_TESTIMONIOS = [
  {
    "nombre": "María José",
    "ciudad": "Medellín",
    "texto": "Empecé agregando mucuna a mi café de la mañana. Pequeño cambio, gran diferencia en cómo arranco el día.",
    "foto": "http://100.77.90.29:8090/wp-content/uploads/2026/09/images-6.jpg",
    "iniciales": "MJ"
  },
  {
    "nombre": "Andrea Castillo",
    "ciudad": "Bogotá",
    "texto": "Me encanta mezclar la cúrcuma en mis smoothies. El color, el aroma y lo fácil que es hacerlo parte del día.",
    "foto": "http://100.77.90.29:8090/wp-content/uploads/2026/09/images-5.jpg",
    "iniciales": "AC"
  },
  {
    "nombre": "Daniel Ruiz",
    "ciudad": "Cali",
    "texto": "Probé varios superalimentos y ahora tengo mis combinaciones favoritas para yogures y bowls de la tarde.",
    "foto": "http://100.77.90.29:8090/wp-content/uploads/2026/09/images-4.jpg",
    "iniciales": "DR"
  }
];

/* Scroll suave para anclas del navbar (#inicio, #mucuna, etc.) */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (history.replaceState) {
        history.replaceState(null, '', id);
      }
    });
  });
})();

/* Testimonios: pinta #vg-testimonios-grid desde VG_TESTIMONIOS */
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
        '" width="120" height="120">';
    } else {
      avatar =
        '<div class="vg-testimonial-avatar vg-testimonial-avatar-ph" aria-hidden="true">' +
        escapeHtml(initialsFrom(item)) +
        '</div>';
    }

    return (
      '<article class="vg-testimonial">' +
      avatar +
      '<blockquote><p>“' +
      texto +
      '”</p></blockquote>' +
      '<footer><strong>' +
      nombre +
      '</strong><span>' +
      ciudad +
      '</span></footer>' +
      '</article>'
    );
  }

  function renderTestimonios() {
    var grid = document.getElementById('vg-testimonios-grid');
    if (!grid) return;

    var items = Array.isArray(VG_TESTIMONIOS) ? VG_TESTIMONIOS : [];
    if (!items.length) {
      grid.innerHTML = '';
      return;
    }

    grid.innerHTML = items.map(renderTestimonial).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTestimonios);
  } else {
    renderTestimonios();
  }
})();
