/* Scroll suave. Pestana JavaScript de HTML block0. Nada mas. */
(function () {
  if (window.__vgSmoothScroll) return;
  window.__vgSmoothScroll = true;

  function getHash(href) {
    if (!href) return '';
    var i = href.indexOf('#');
    if (i === -1) return '';
    return href.slice(i);
  }

  function scrollToHash(hash) {
    if (!hash || hash === '#' ) return false;
    var target = document.querySelector(hash);
    if (!target) return false;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (history.replaceState) history.replaceState(null, '', hash);
    return true;
  }

  document.addEventListener(
    'click',
    function (e) {
      var link = e.target.closest('a[href*="#"]');
      if (!link) return;
      var hash = getHash(link.getAttribute('href'));
      if (!hash || hash === '#') return;
      if (!document.querySelector(hash)) return;
      e.preventDefault();
      scrollToHash(hash);
    },
    false
  );

  if (window.location.hash) {
    var hash = window.location.hash;
    window.setTimeout(function () {
      scrollToHash(hash);
    }, 50);
  }
})();
