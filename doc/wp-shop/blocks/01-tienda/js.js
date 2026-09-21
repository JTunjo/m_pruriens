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

  function stripHtml(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function titleOf(card) {
    return (
      card.querySelector('.woocommerce-loop-product__title') ||
      card.querySelector('h2') ||
      card.querySelector('h3')
    );
  }

  function insertAfter(ref, node) {
    if (!ref) return;
    if (!ref.parentNode) return;
    if (ref.nextSibling) ref.parentNode.insertBefore(node, ref.nextSibling);
    else ref.parentNode.appendChild(node);
  }

  function permalinkOf(card, product) {
    if (product && product.permalink) return product.permalink;
    var loop =
      card.querySelector('a.woocommerce-LoopProduct-link[href]') ||
      card.querySelector('a.woocommerce-loop-product__link[href]');
    if (loop) return loop.href;
    var title = titleOf(card);
    var tlink = title && title.closest ? title.closest('a[href]') : null;
    if (tlink && tlink.className.indexOf('button') === -1) return tlink.href;
    var any = card.querySelector('a[href]:not(.add_to_cart_button):not(.button)');
    return any ? any.href : '';
  }

  function originOf(product) {
    var found = '';
    var attrs = product ? product.attributes || [] : [];
    attrs.forEach(function (attr) {
      if (found) return;
      var n = ((attr.name || '') + ' ' + (attr.taxonomy || '')).toLowerCase();
      if (/origen|origin|procedencia|pa[ií]s/.test(n) && attr.terms && attr.terms[0]) {
        found = attr.terms[0].name;
      }
    });
    if (found) return found;
    var pool = [].concat(product ? product.tags || [] : [], product ? product.categories || [] : []);
    pool.forEach(function (item) {
      if (found) return;
      var blob = ((item.slug || '') + ' ' + (item.name || '')).toLowerCase();
      if (/importado|internacional/.test(blob)) found = 'Importado';
      else if (/nacional|colombia/.test(blob)) found = 'Nacional';
    });
    return found || 'Nacional';
  }

  function ensureOrigin(card, label, url) {
    var el = card.querySelector('.vg-origin');
    var title = titleOf(card);
    var nested = !!(title && title.closest && title.closest('a[href]'));
    var tagName = url && !nested ? 'a' : 'span';
    if (!el || el.tagName.toLowerCase() !== tagName) {
      var next = document.createElement(tagName);
      next.className = 'vg-origin';
      if (el && el.parentNode) el.parentNode.replaceChild(next, el);
      else if (title) insertAfter(title, next);
      else card.appendChild(next);
      el = next;
    }
    el.textContent = label || 'Nacional';
    if (el.tagName === 'A' && url) el.setAttribute('href', url);
    return el;
  }

  function ensureDesc(card, text) {
    if (!text) return null;
    var p = card.querySelector('.vg-loop-desc');
    if (!p) {
      p = document.createElement('p');
      p.className = 'vg-loop-desc';
      var origin = card.querySelector('.vg-origin');
      var title = titleOf(card);
      if (origin) insertAfter(origin, p);
      else if (title) insertAfter(title, p);
      else card.appendChild(p);
    }
    p.textContent = text;
    return p;
  }

  function ensureLeaf(card) {
    if (card.querySelector('.vg-leaf')) return;
    var leaf = document.createElement('span');
    leaf.className = 'vg-leaf';
    leaf.setAttribute('aria-hidden', 'true');
    var price = card.querySelector('.price');
    var desc = card.querySelector('.vg-loop-desc');
    if (price && price.parentNode) price.parentNode.insertBefore(leaf, price);
    else if (desc) insertAfter(desc, leaf);
    else {
      var host =
        card.querySelector('a.woocommerce-LoopProduct-link') ||
        card.querySelector('a.woocommerce-loop-product__link') ||
        card;
      host.appendChild(leaf);
    }
  }

  function bindCardNav(card, url) {
    if (!url || card.getAttribute('data-vg-nav')) return;
    card.setAttribute('data-vg-nav', '1');
    card.addEventListener('click', function (e) {
      if (e.target.closest('a.button, button, .add_to_cart_button, a.added_to_cart')) return;
      if (e.target.closest('a[href]')) return;
      window.location.href = url;
    });
  }

  function decorateCard(card, product) {
    var url = permalinkOf(card, product);
    ensureOrigin(card, originOf(product), url);
    var text = stripHtml(product ? product.short_description || '' : '');
    if (!text) text = stripHtml(product ? product.description || '' : '');
    if (text.length > 140) text = text.slice(0, 137) + '\u2026';
    ensureDesc(card, text);
    ensureLeaf(card);
    bindCardNav(card, url);
  }

  function decorateAll(products) {
    cards().forEach(function (card) {
      decorateCard(card, products ? findProduct(card, products) : null);
    });
  }

  function ingest(products) {
    if (!products || !products.length) {
      decorateAll(null);
      apply();
      return;
    }
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
    decorateAll(products);
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

  function start() {
    cards().forEach(function (card, i) {
      if (!card.getAttribute('data-vg-i')) {
        card.setAttribute('data-vg-i', String(i));
      }
    });
    bind();
    decorateAll(null);
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
        decorateAll(null);
        apply();
      });
  }

  function boot() {
    if (!document.getElementById('tienda')) return;
    if (cards().length) {
      start();
      return;
    }
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (cards().length) {
        clearInterval(timer);
        start();
      } else if (tries >= 20) {
        clearInterval(timer);
      }
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
