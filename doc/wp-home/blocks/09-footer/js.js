/* Quita el ancho estrecho del footer de Twenty Twenty-Five */
(function () {
  var el = document.getElementById('vg-footer');
  if (!el) return;

  var n = el.parentElement;
  while (n && n !== document.body) {
    n.classList.add('vg-footer-host', 'alignfull');
    n.style.setProperty('max-width', 'none', 'important');
    n.style.setProperty('width', '100%', 'important');
    n.style.setProperty('margin-left', '0', 'important');
    n.style.setProperty('margin-right', '0', 'important');
    if (n.tagName === 'FOOTER' || n.classList.contains('wp-block-template-part')) break;
    n = n.parentElement;
  }
})();

/* Mueve el WhatsApp al <body> y lo oculta si el mini carrito está abierto */
(function () {
  var wrap = document.getElementById('vg-wa-float-wrap') || document.querySelector('.vg-wa-float');
  if (wrap && wrap.parentNode !== document.body) {
    document.body.appendChild(wrap);
  }

  function isCartOpen() {
    if (document.querySelector('.wc-block-mini-cart__button[aria-expanded="true"]')) return true;
    if (document.querySelector('.wc-block-mini-cart--open')) return true;
    var drawer = document.querySelector('.wc-block-mini-cart__drawer, .wc-block-components-drawer');
    if (drawer && drawer.getAttribute('aria-hidden') === 'false') return true;
    var overlay = document.querySelector('.wc-block-components-drawer__screen-overlay');
    if (overlay && !overlay.classList.contains('wc-block-components-drawer__screen-overlay--is-hidden')) return true;
    return false;
  }

  function sync() {
    var el = document.getElementById('vg-wa-float-wrap');
    if (!el) return;
    var open = isCartOpen();
    el.classList.toggle('vg-wa-hidden', open);
    document.body.classList.toggle('vg-wa-cart-open', open);
  }

  sync();
  var obs = new MutationObserver(sync);
  obs.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-expanded', 'aria-hidden', 'class']
  });
  document.addEventListener('click', function () { setTimeout(sync, 30); }, true);
})();
