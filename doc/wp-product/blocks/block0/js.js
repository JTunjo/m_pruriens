(function () {
  if (window.__vgPdp) return;
  window.__vgPdp = true;

  function isEditor() {
    var cls = document.body ? String(document.body.className) : '';
    if (cls.indexOf('block-editor') !== -1) return true;
    if (cls.indexOf('wp-admin') !== -1) return true;
    return false;
  }

  function catText(meta) {
    var link = meta.querySelector('.posted_in a');
    var text = link ? String(link.textContent || '').trim() : '';
    if (!text) return '';
    var low = text.toLowerCase();
    if (low.indexOf('categor') !== -1) return '';
    if (low === 'uncategorized') return '';
    if (low.indexOf('sin categor') === 0) return '';
    return text;
  }

  function place() {
    if (isEditor()) return;
    if (!document.getElementById('producto-vg')) return;

    var trust = document.getElementById('vg-product-trust');
    var uso = document.getElementById('vg-pdp-uso');
    var cart = document.querySelector('.wp-block-woocommerce-add-to-cart-with-options')
      || document.querySelector('.wp-block-woocommerce-add-to-cart-form')
      || document.querySelector('form.cart');
    var details = document.querySelector('.wp-block-woocommerce-product-details')
      || document.querySelector('.woocommerce-tabs');
    var related = document.querySelector('.wp-block-woocommerce-product-collection')
      || document.querySelector('.wp-block-woocommerce-related-products')
      || document.querySelector('.related.products');
    var title = document.querySelector('.wp-block-columns .wp-block-post-title')
      || document.querySelector('.wp-block-woocommerce-product-title')
      || document.querySelector('h1.product_title')
      || document.querySelector('.wp-block-columns h1');
    var meta = document.querySelector('.wp-block-woocommerce-product-meta')
      || document.querySelector('.product_meta');

    if (cart && trust && cart.parentNode && trust.previousElementSibling !== cart) {
      cart.parentNode.insertBefore(trust, cart.nextSibling);
    }

    if (related && related.parentNode) {
      if (details && details !== related && details.nextElementSibling !== related && details.nextElementSibling !== uso) {
        related.parentNode.insertBefore(details, related);
      }
      if (uso && uso.nextElementSibling !== related) {
        related.parentNode.insertBefore(uso, related);
      }
    }

    if (title && meta && title.parentNode && !document.querySelector('.vg-pdp-cat')) {
      var name = catText(meta);
      if (name) {
        var label = document.createElement('p');
        label.className = 'vg-label vg-pdp-cat';
        label.textContent = name;
        title.parentNode.insertBefore(label, title);
      }
    }

    var ready = ' vg-pdp-ready';
    if (String(document.body.className).indexOf('vg-pdp-ready') === -1) {
      document.body.className += ready;
    }
  }

  function boot() {
    place();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  setTimeout(boot, 300);
  setTimeout(boot, 900);
})();
