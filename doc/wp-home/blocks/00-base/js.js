/* Scroll suave para anclas del navbar (#inicio, /#mucuna, URL completa, etc.) */
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
    if (!hash || hash === '#') return false;
    var target = document.querySelector(hash);
    if (!target) return false;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (history.replaceState) {
      history.replaceState(null, '', hash);
    }
    return true;
  }

  document.addEventListener(
    'click',
    function (e) {
      var link = e.target.closest('a[href*="#"]');
      if (!link) return;

      var hash = getHash(link.getAttribute('href'));
      if (!hash || hash === '#') return;

      // Solo si la sección existe en esta página
      if (!document.querySelector(hash)) return;

      e.preventDefault();
      scrollToHash(hash);
    },
    false
  );

  // Si entras con #en-la-url, también suaviza
  if (window.location.hash) {
    var hash = window.location.hash;
    window.setTimeout(function () {
      scrollToHash(hash);
    }, 50);
  }
})();

/* Tienda: inyecta la descripción corta si existe #tienda */
(function () {
  function stripHtml(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return (tmp.textContent || tmp.innerText || '').replace(/[ \t\n\r]+/g, ' ').trim();
  }

  function cards() {
    return Array.prototype.slice.call(
      document.querySelectorAll(
        'ul.products li.product, .wc-block-grid__product, li.wc-block-product, .wc-block-product'
      )
    );
  }

  function cardId(card) {
    var data = parseInt(card.getAttribute('data-vg-id') || '0', 10);
    if (data) return data;
    var m = String(card.className || '').match(/post-([0-9]+)/);
    if (m) return parseInt(m[1], 10);
    var el =
      card.querySelector('[data-product_id]') ||
      card.querySelector('[data-wc-product-id]');
    if (el) {
      return (
        parseInt(el.getAttribute('data-product_id') || el.getAttribute('data-wc-product-id'), 10) || 0
      );
    }
    return 0;
  }

  function cardTitle(card) {
    var title =
      card.querySelector('.woocommerce-loop-product__title') ||
      card.querySelector('h2') ||
      card.querySelector('h3');
    return title ? title.textContent.replace(/[ \t\n\r]+/g, ' ').trim().toLowerCase() : '';
  }

  function findProduct(card, products) {
    var id = cardId(card);
    var i;
    if (id) {
      for (i = 0; i < products.length; i += 1) {
        if (Number(products[i].id) === id) return products[i];
      }
    }
    var name = cardTitle(card);
    if (name) {
      for (i = 0; i < products.length; i += 1) {
        if ((products[i].name || '').replace(/[ \t\n\r]+/g, ' ').trim().toLowerCase() === name) {
          return products[i];
        }
      }
    }
    return null;
  }

  function insertDesc(card, text) {
    if (!text || card.querySelector('.vg-loop-desc')) return;
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
  }

  function firstVisibleCat(product) {
    var cats = product.categories || [];
    for (var i = 0; i < cats.length; i += 1) {
      var slug = (cats[i].slug || '').toLowerCase();
      if (slug && slug !== 'uncategorized' && slug !== 'sin-categoria') {
        return cats[i];
      }
    }
    return null;
  }

  function styleCard(card, product) {
    var btn = card.querySelector(
      'a.button, a.add_to_cart_button, button.add_to_cart_button'
    );
    if (btn) {
      if (
        btn.classList.contains('product_type_variable') ||
        btn.classList.contains('product_type_grouped')
      ) {
        btn.textContent = 'Ver opciones';
      } else {
        btn.textContent = 'Agregar';
      }
    }

    var cat = product ? firstVisibleCat(product) : null;
    if (cat && !card.querySelector('.vg-shop-badge')) {
      var badge = document.createElement('span');
      badge.className = 'vg-shop-badge';
      badge.textContent = cat.name;
      card.insertBefore(badge, card.firstChild);
    }

    var labelText = '';
    if (product && product.tags && product.tags.length) {
      labelText = product.tags[0].name;
    } else if (cat) {
      labelText = cat.name;
    }
    if (labelText && !card.querySelector('.vg-shop-cat')) {
      var label = document.createElement('span');
      label.className = 'vg-shop-cat';
      label.textContent = labelText;
      var title =
        card.querySelector('.woocommerce-loop-product__title') ||
        card.querySelector('h2') ||
        card.querySelector('h3');
      if (title && title.parentNode) {
        title.parentNode.insertBefore(label, title);
      }
    }

    var price = card.querySelector('.price');
    var isVariable =
      (product && product.type === 'variable') ||
      (btn && btn.classList.contains('product_type_variable'));
    if (price && isVariable && !price.querySelector('.vg-price-from')) {
      var from = document.createElement('span');
      from.className = 'vg-price-from';
      from.textContent = 'Desde ';
      price.insertBefore(from, price.firstChild);
    }
  }

  var filterCat = '';
  var filterSort = 'tag';
  var filterBound = false;

  function slugify(s) {
    return String(s || '')
      .toLowerCase()
      .split(' ')
      .join('-');
  }

  function catsOf(p) {
    var cats = (p && p.categories) || [];
    var out = [];
    var i;
    var slug;
    var name;
    for (i = 0; i < cats.length; i += 1) {
      slug = String(cats[i].slug || '').toLowerCase();
      name = slugify(cats[i].name || '');
      if (slug && out.indexOf(slug) === -1) out.push(slug);
      if (name && out.indexOf(name) === -1) out.push(name);
    }
    return out;
  }

  function tagOf(p) {
    var tags = (p && p.tags) || [];
    var i;
    var best = 9999;
    for (i = 0; i < tags.length; i += 1) {
      var n = parseInt(String(tags[i].name || '').trim(), 10);
      if (!isNaN(n) && n < best) best = n;
    }
    return best;
  }

  function priceOf(p) {
    var prices = (p && p.prices) || {};
    if (prices.price_range && prices.price_range.min_amount) {
      return parseInt(prices.price_range.min_amount, 10) || 0;
    }
    return parseInt(prices.price || prices.regular_price || '0', 10) || 0;
  }

  function applyShopFilter() {
    var list = cards();
    var vis = 0;
    var parent = null;
    list.forEach(function (card) {
      var hay = ' ' + (card.getAttribute('data-vg-cats') || '') + ' ';
      var show = !filterCat || hay.indexOf(' ' + filterCat + ' ') !== -1;
      if (show) {
        card.style.removeProperty('display');
        vis += 1;
      } else {
        card.style.setProperty('display', 'none', 'important');
      }
      if (!parent) parent = card.parentNode;
    });
    list.sort(function (a, b) {
      var ta = parseInt(a.getAttribute('data-vg-tag') || '9999', 10);
      var tb = parseInt(b.getAttribute('data-vg-tag') || '9999', 10);
      var pa = parseInt(a.getAttribute('data-vg-price') || '0', 10);
      var pb = parseInt(b.getAttribute('data-vg-price') || '0', 10);
      var ia = cardId(a);
      var ib = cardId(b);
      if (isNaN(ta)) ta = 9999;
      if (isNaN(tb)) tb = 9999;
      if (filterSort === 'price-asc') return pa - pb;
      if (filterSort === 'price-desc') return pb - pa;
      if (filterSort === 'date') return ib - ia;
      if (filterSort === 'popularity') return (parseInt(a.getAttribute('data-vg-pop') || '0', 10) || 0) - (parseInt(b.getAttribute('data-vg-pop') || '0', 10) || 0);
      return ta - tb;
    });
    if (parent) {
      list.forEach(function (card) {
        if (card.parentNode === parent) parent.appendChild(card);
      });
    }
    var count = document.getElementById('vg-shop-count');
    if (count) count.textContent = vis === 1 ? '1 producto' : vis + ' productos';
    var empty = document.getElementById('vg-shop-empty');
    if (empty) empty.hidden = vis > 0;
  }

  function bindShopFilter() {
    if (filterBound) return;
    var wrap = document.getElementById('vg-shop-filters');
    if (!wrap) return;
    filterBound = true;
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.vg-filter') : null;
      if (!btn) return;
      filterCat = btn.getAttribute('data-cat') || '';
      var all = wrap.querySelectorAll('.vg-filter');
      var i;
      for (i = 0; i < all.length; i += 1) {
        var on = (all[i].getAttribute('data-cat') || '') === filterCat;
        all[i].className = on ? 'vg-filter is-active' : 'vg-filter';
        all[i].setAttribute('aria-pressed', on ? 'true' : 'false');
      }
      applyShopFilter();
    });
    var sel = document.getElementById('vg-shop-sort');
    if (sel) {
      sel.addEventListener('change', function () {
        filterSort = sel.value || 'tag';
        applyShopFilter();
      });
    }
  }

  function inject() {
    if (!document.getElementById('tienda')) return;
    if (window.__vgShopDesc) return;
    window.__vgShopDesc = true;

    function run() {
      bindShopFilter();
      var list = cards();
      if (!list.length) return false;

      list.forEach(function (card) {
        styleCard(card, null);
      });

      fetch(
        (window.location.origin || '') + '/wp-json/wc/store/v1/products?per_page=100',
        { credentials: 'same-origin' }
      )
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (products) {
          cards().forEach(function (card, index) {
            var p = findProduct(card, products || []);
            if (p) {
              var text = stripHtml(p.short_description || '');
              if (!text) text = stripHtml(p.description || '');
              if (text.length > 140) text = text.slice(0, 137) + '...';
              insertDesc(card, text);
              card.setAttribute('data-vg-id', String(p.id));
              card.setAttribute('data-vg-cats', catsOf(p).join(' '));
              card.setAttribute('data-vg-tag', String(tagOf(p)));
              card.setAttribute('data-vg-price', String(priceOf(p)));
              card.setAttribute('data-vg-pop', String(index));
            }
            styleCard(card, p || null);
          });
          applyShopFilter();
        })
        .catch(function (err) {
          console.warn('[VG] Short description failed:', err);
          bindShopFilter();
        });
      return true;
    }

    if (run()) return;
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (run() || tries >= 12) clearInterval(timer);
    }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
