(function () {
  if (window.__vgShop) return;
  window.__vgShop = true;

  var cat = '';
  var sort = 'menu_order';

  function cards() {
    return Array.prototype.slice.call(
      document.querySelectorAll('ul.products li.product')
    );
  }

  function slugify(s) {
    return String(s || '').toLowerCase().split(' ').join('-');
  }

  function hasCat(card, slug) {
    if (!slug) return true;
    var cls = ' ' + card.className + ' ';
    if (cls.indexOf(' product_cat-' + slug + ' ') !== -1) return true;
    var data = ' ' + (card.getAttribute('data-vg-cats') || '') + ' ';
    if (data.indexOf(' ' + slug + ' ') !== -1) return true;
    return false;
  }

  function tagNum(card) {
    var t = parseInt(card.getAttribute('data-vg-tag') || '', 10);
    if (!isNaN(t)) return t;
    var best = 9999;
    String(card.className).split(' ').forEach(function (part) {
      var n;
      if (part.indexOf('product_tag-') === 0) {
        n = parseInt(part.slice(12), 10);
        if (!isNaN(n) && best > n) best = n;
      }
    });
    return best;
  }

  function priceNum(card) {
    var t = parseInt(card.getAttribute('data-vg-price') || '', 10);
    if (!isNaN(t) && t > 0) return t;
    var el = card.querySelector('.woocommerce-Price-amount');
    if (!el) return 0;
    return parseInt(String(el.textContent || '').replace(/[^0-9]/g, ''), 10) || 0;
  }

  function postId(card) {
    var parts = (' ' + card.className + ' ').split(' post-');
    if (parts.length > 1) return parseInt(parts[1], 10) || 0;
    return 0;
  }

  function orig(card) {
    return parseInt(card.getAttribute('data-vg-pop') || card.getAttribute('data-vg-i') || '0', 10) || 0;
  }

  function apply() {
    var list = cards();
    var vis = 0;
    list.forEach(function (card) {
      var show = hasCat(card, cat);
      if (show) {
        card.className = String(card.className).split(' vg-hide').join('');
        vis += 1;
      } else if (card.className.indexOf('vg-hide') === -1) {
        card.className += ' vg-hide';
      }
    });
    list.sort(function (a, b) {
      if (sort === 'price') return priceNum(a) - priceNum(b);
      if (sort === 'price-desc') return priceNum(b) - priceNum(a);
      if (sort === 'date') return postId(b) - postId(a);
      if (sort === 'popularity') return orig(a) - orig(b);
      return tagNum(a) - tagNum(b);
    });
    list.forEach(function (card) {
      if (card.parentNode) card.parentNode.appendChild(card);
    });
    var count = document.getElementById('vg-shop-count');
    if (count) {
      count.textContent = vis === 1 ? '1 producto' : vis + ' productos';
    }
    var empty = document.getElementById('vg-shop-empty');
    if (empty) empty.hidden = vis > 0;
  }

  window.vgVGFilt = function (btn) {
    cat = (btn && btn.getAttribute('data-cat')) || '';
    var wrap = document.getElementById('vg-shop-filters');
    var all = wrap ? wrap.querySelectorAll('.vg-filter') : [];
    Array.prototype.forEach.call(all, function (btnEl) {
      var on = (btnEl.getAttribute('data-cat') || '') === cat;
      btnEl.className = on ? 'vg-filter is-active' : 'vg-filter';
      btnEl.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    apply();
  };

  window.vgVGSort = function (sel) {
    sort = (sel && sel.value) || 'menu_order';
    apply();
  };

  function findProduct(card, products) {
    var id = postId(card);
    var found = null;
    if (!id) return null;
    products.forEach(function (p) {
      if (!found && Number(p.id) === id) found = p;
    });
    return found;
  }

  function catsOf(p) {
    var cats = (p && p.categories) || [];
    var out = [];
    cats.forEach(function (c) {
      var slug = String(c.slug || '').toLowerCase();
      var name = slugify(c.name || '');
      if (slug && out.indexOf(slug) === -1) out.push(slug);
      if (name && out.indexOf(name) === -1) out.push(name);
    });
    return out;
  }

  function tagOf(p) {
    var tags = (p && p.tags) || [];
    var best = 9999;
    tags.forEach(function (tg) {
      var n = parseInt(String(tg.name || '').trim(), 10);
      if (!isNaN(n) && best > n) best = n;
    });
    return best;
  }

  function priceOf(p) {
    var prices = (p && p.prices) || {};
    if (prices.price_range && prices.price_range.min_amount) {
      return parseInt(prices.price_range.min_amount, 10) || 0;
    }
    return parseInt(prices.price || prices.regular_price || '0', 10) || 0;
  }

  function ingest(products) {
    if (!products || !products.length) return;
    cards().forEach(function (card) {
      var p = findProduct(card, products);
      if (!p) return;
      card.setAttribute('data-vg-cats', catsOf(p).join(' '));
      card.setAttribute('data-vg-tag', String(tagOf(p)));
      card.setAttribute('data-vg-price', String(priceOf(p)));
      var pop = 9999;
      products.forEach(function (item, i) {
        if (Number(item.id) === Number(p.id)) pop = i;
      });
      card.setAttribute('data-vg-pop', String(pop));
    });
    apply();
  }

  function bind() {
    var wrap = document.getElementById('vg-shop-filters');
    if (wrap && !wrap.getAttribute('data-vg-bound')) {
      wrap.setAttribute('data-vg-bound', '1');
      wrap.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.vg-filter') : null;
        if (btn) window.vgVGFilt(btn);
      });
    }
    var sel = document.getElementById('vg-shop-sort');
    if (sel && !sel.getAttribute('data-vg-bound')) {
      sel.setAttribute('data-vg-bound', '1');
      sel.addEventListener('change', function () {
        window.vgVGSort(sel);
      });
    }
  }

  function boot() {
    cards().forEach(function (card, i) {
      if (!card.getAttribute('data-vg-i')) {
        card.setAttribute('data-vg-i', String(i));
      }
    });
    bind();
    apply();
    fetch(
      (window.location.origin || '') +
        '/wp-json/wc/store/v1/products?per_page=100&orderby=popularity',
      { credentials: 'same-origin' }
    )
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(ingest)
      .catch(function () {
        apply();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
