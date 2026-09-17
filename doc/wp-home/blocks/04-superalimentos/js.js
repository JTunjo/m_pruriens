// SUPERALIMENTOS — añade la descripción corta a cada tarjeta WooCommerce
// Pega SOLO este archivo en la pestaña JavaScript (nada de HTML).
(function () {
  function stripHtml(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return (tmp.textContent || tmp.innerText || '').trim();
  }

  function findProductCard(productId) {
    var byClass = document.querySelector(
      'ul.products li.product.post-' + productId
    );
    if (byClass) return byClass;

    var btn = document.querySelector(
      'ul.products li.product a.add_to_cart_button[data-product_id="' +
        productId +
        '"]'
    );
    return btn ? btn.closest('li.product') : null;
  }

  function injectDescriptions(products) {
    if (!Array.isArray(products)) return;

    products.forEach(function (product) {
      var card = findProductCard(product.id);
      if (!card) return;
      if (card.querySelector('.vg-loop-desc')) return;

      var text = stripHtml(product.short_description || '');
      if (!text) return;
      if (text.length > 140) text = text.slice(0, 137) + '…';

      var p = document.createElement('p');
      p.className = 'vg-loop-desc';
      p.textContent = text;

      var title =
        card.querySelector('.woocommerce-loop-product__title') ||
        card.querySelector('h2') ||
        card.querySelector('h3');
      var price = card.querySelector('.price');

      if (title && title.parentNode) {
        if (price && title.nextElementSibling === price) {
          title.parentNode.insertBefore(p, price);
        } else if (title.nextSibling) {
          title.parentNode.insertBefore(p, title.nextSibling);
        } else {
          title.parentNode.appendChild(p);
        }
      } else if (price && price.parentNode) {
        price.parentNode.insertBefore(p, price);
      } else {
        card.appendChild(p);
      }
    });
  }

  function load() {
    var api =
      (window.location.origin || '') +
      '/wp-json/wc/store/v1/products?per_page=12&orderby=date&order=desc';

    fetch(api, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(injectDescriptions)
      .catch(function (err) {
        console.warn('[VG] No se pudo cargar descripciones:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
