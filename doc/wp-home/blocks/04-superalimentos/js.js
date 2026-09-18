// SUPERALIMENTOS — pégalo en la pestaña JS del bloque FOOTER (después del shortcode).
// Evita el caracter ampersand: WordPress lo convierte en entidad HTML y el script deja de correr.
(function () {
  if (window.__vgSuperLoaded) return;

  var LEAF =
    '<svg viewBox="0 0 40 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21C11 18 6 11 9 3c11 3 14 10 11 18z"/><path d="M20 21c9-3 14-10 11-18-11 3-14 10-11 18z"/><path d="M20 21V8"/></svg>';

  function stripHtml(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function productsList() {
    if (!document.getElementById('superalimentos')) return null;
    var footer = document.querySelector('.vg-products-footer');
    if (!footer) return document.querySelector('ul.products');
    var node = footer.previousElementSibling;
    var list;
    while (node) {
      if (node.matches) {
        if (node.matches('ul.products')) return node;
      }
      list = node.querySelector ? node.querySelector('ul.products') : null;
      if (list) return list;
      node = node.previousElementSibling;
    }
    return document.querySelector('ul.products');
  }

  function cards() {
    var list = productsList();
    if (!list) return [];
    return Array.prototype.slice.call(list.querySelectorAll('li.product, .wc-block-grid__product'));
  }

  function titleOf(card) {
    return (
      card.querySelector('.woocommerce-loop-product__title') ||
      card.querySelector('h2') ||
      card.querySelector('h3')
    );
  }

  function cardTitle(card) {
    var t = titleOf(card);
    return t ? t.textContent.replace(/\s+/g, ' ').trim().toLowerCase() : '';
  }

  function cardId(card) {
    var m = String(card.className || '').match(/post-(\d+)/);
    if (m) return parseInt(m[1], 10);
    var el = card.querySelector('[data-product_id]');
    if (el) return parseInt(el.getAttribute('data-product_id'), 10) || 0;
    return 0;
  }

  function insertAfter(ref, node) {
    if (!ref) return;
    if (!ref.parentNode) return;
    if (ref.nextSibling) ref.parentNode.insertBefore(node, ref.nextSibling);
    else ref.parentNode.appendChild(node);
  }

  function permalinkOf(card, product) {
    if (product) {
      if (product.permalink) return product.permalink;
    }
    var loop =
      card.querySelector('a.woocommerce-LoopProduct-link[href]') ||
      card.querySelector('a.woocommerce-loop-product__link[href]');
    if (loop) return loop.href;
    var title = titleOf(card);
    var tlink = null;
    if (title) {
      if (title.closest) tlink = title.closest('a[href]');
    }
    if (tlink) {
      if (tlink.className.indexOf('button') === -1) return tlink.href;
    }
    var any = card.querySelector('a[href]:not(.add_to_cart_button):not(.button)');
    return any ? any.href : '';
  }

  function originOf(product) {
    var i;
    var attrs = product ? product.attributes || [] : [];
    for (i = 0; i < attrs.length; i += 1) {
      var n = ((attrs[i].name || '') + ' ' + (attrs[i].taxonomy || '')).toLowerCase();
      if (/origen|origin|procedencia|pa[ií]s/.test(n)) {
        if (attrs[i].terms) {
          if (attrs[i].terms[0]) return attrs[i].terms[0].name;
        }
      }
    }
    var pool = [].concat(product ? product.tags || [] : [], product ? product.categories || [] : []);
    for (i = 0; i < pool.length; i += 1) {
      var blob = ((pool[i].slug || '') + ' ' + (pool[i].name || '')).toLowerCase();
      if (/importado|internacional/.test(blob)) return 'Importado';
      if (/nacional|colombia/.test(blob)) return 'Nacional';
    }
    return 'Nacional';
  }

  function ensureOrigin(card, label, url) {
    var el = card.querySelector('.vg-origin');
    var title = titleOf(card);
    var nested = false;
    if (title) {
      if (title.closest) {
        if (title.closest('a[href]')) nested = true;
      }
    }
    var tagName = 'span';
    if (url) {
      if (!nested) tagName = 'a';
    }
    if (!el || el.tagName.toLowerCase() !== tagName) {
      var next = document.createElement(tagName);
      next.className = 'vg-origin';
      if (el) {
        if (el.parentNode) el.parentNode.replaceChild(next, el);
      } else if (title) insertAfter(title, next);
      else card.appendChild(next);
      el = next;
    }
    el.textContent = label || 'Nacional';
    if (el.tagName === 'A') {
      if (url) el.setAttribute('href', url);
    }
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
    leaf.innerHTML = LEAF;
    var host =
      card.querySelector('a.woocommerce-LoopProduct-link') ||
      card.querySelector('a.woocommerce-loop-product__link') ||
      card;
    host.appendChild(leaf);
  }

  function bindCardNav(card, url) {
    if (!url) return;
    if (card.getAttribute('data-vg-nav')) return;
    card.setAttribute('data-vg-nav', '1');
    card.addEventListener('click', function (e) {
      if (e.target.closest('a.button, button, .add_to_cart_button, a.added_to_cart')) return;
      if (e.target.closest('a[href]')) return;
      window.location.href = url;
    });
  }

  function findCardForProduct(product) {
    var id = Number(product ? product.id : 0);
    var name = String(product ? product.name || '' : '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    var list = cards();
    var i;
    var card;
    for (i = 0; i < list.length; i += 1) {
      card = list[i];
      if (id) {
        if (cardId(card) === id) return card;
      }
    }
    for (i = 0; i < list.length; i += 1) {
      card = list[i];
      if (name) {
        if (cardTitle(card) === name) return card;
      }
    }
    return null;
  }

  function decorateCard(card, product) {
    var url = permalinkOf(card, product);
    ensureOrigin(card, originOf(product), url);
    var text = stripHtml(product ? product.short_description || '' : '');
    if (!text) text = stripHtml(product ? product.description || '' : '');
    if (text.length > 140) text = text.slice(0, 137) + '…';
    ensureDesc(card, text);
    ensureLeaf(card);
    bindCardNav(card, url);
  }

  function restRoot() {
    var link = document.querySelector('link[rel="https://api.w.org/"]');
    if (link) {
      if (link.href) return link.href;
    }
    if (window.wpApiSettings) {
      if (window.wpApiSettings.root) return window.wpApiSettings.root;
    }
    return (window.location.origin || '') + '/wp-json/';
  }

  function isCarouselView() {
    return (window.innerWidth || document.documentElement.clientWidth || 0) <= 1024;
  }

  function currentSlide(list, items) {
    var box = list.getBoundingClientRect();
    var mid = box.left + list.clientWidth / 2;
    var best = 0;
    var bestDist = Infinity;
    items.forEach(function (card, i) {
      var c = card.getBoundingClientRect();
      var d = Math.abs(c.left + c.width / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }

  function goToSlide(list, items, index) {
    if (!items.length) return;
    var len = items.length;
    var next = ((index % len) + len) % len;
    list.scrollTo({ left: next * list.clientWidth, behavior: 'smooth' });
  }

  function applyCarouselMode() {
    var list = productsList();
    if (!list) return;
    var on = isCarouselView();
    var items = cards();
    var i;
    var shell = list.parentNode;
    document.body.classList.add('vg-has-super');
    document.body.classList.toggle('vg-super-carousel', on);
    list.classList.toggle('vg-is-carousel', on);
    if (shell) {
      if (shell.classList) {
        if (shell.classList.contains('vg-super-slider')) shell.classList.toggle('is-active', on);
      }
    }

    if (list.parentNode) {
      if (list.parentNode.style) {
        list.parentNode.style.setProperty('max-width', '100%', 'important');
        list.parentNode.style.setProperty('width', '100%', 'important');
        list.parentNode.style.setProperty('min-width', '0', 'important');
        list.parentNode.style.setProperty('box-sizing', 'border-box');
        if (on) {
          list.parentNode.style.setProperty('overflow', 'hidden', 'important');
          list.parentNode.style.setProperty('padding', '0 2.75rem', 'important');
        } else {
          list.parentNode.style.setProperty('overflow', 'visible', 'important');
          list.parentNode.style.setProperty('padding', '0', 'important');
        }
      }
    }

    if (on) {
      list.style.setProperty('display', 'flex', 'important');
      list.style.setProperty('flex-direction', 'row', 'important');
      list.style.setProperty('flex-wrap', 'nowrap', 'important');
      list.style.setProperty('justify-content', 'flex-start', 'important');
      list.style.setProperty('overflow-x', 'auto', 'important');
      list.style.setProperty('overflow-y', 'hidden', 'important');
      list.style.setProperty('width', '100%', 'important');
      list.style.setProperty('max-width', '100%', 'important');
      list.style.setProperty('min-width', '0', 'important');
      list.style.setProperty('gap', '0', 'important');
      list.style.setProperty('padding', '0', 'important');
      list.style.setProperty('margin', '0', 'important');
      list.style.setProperty('scroll-snap-type', 'x mandatory');
      list.style.setProperty('-webkit-overflow-scrolling', 'touch');
      list.style.setProperty('box-sizing', 'border-box');
    } else {
      list.style.setProperty('display', 'flex', 'important');
      list.style.setProperty('flex-wrap', 'wrap', 'important');
      list.style.setProperty('justify-content', 'center', 'important');
      list.style.setProperty('overflow', 'visible', 'important');
      list.style.setProperty('width', 'min(1200px, calc(100% - 3rem))', 'important');
      list.style.setProperty('max-width', '1200px', 'important');
      list.style.setProperty('margin', '0 auto', 'important');
      list.style.setProperty('gap', '1.25rem', 'important');
      list.style.setProperty('padding', '0', 'important');
      list.style.removeProperty('flex-direction');
      list.style.removeProperty('overflow-x');
      list.style.removeProperty('overflow-y');
      list.style.removeProperty('min-width');
      list.style.removeProperty('scroll-snap-type');
    }

    for (i = 0; i < items.length; i += 1) {
      items[i].style.setProperty('float', 'none', 'important');
      items[i].style.setProperty('clear', 'none', 'important');
      items[i].style.setProperty('background', '#ede4d4', 'important');
      items[i].style.setProperty('box-sizing', 'border-box');
      if (on) {
        items[i].style.setProperty('flex', '0 0 100%', 'important');
        items[i].style.setProperty('width', '100%', 'important');
        items[i].style.setProperty('max-width', '100%', 'important');
        items[i].style.setProperty('min-width', '0', 'important');
        items[i].style.setProperty('scroll-snap-align', 'center');
      } else {
        items[i].style.setProperty('flex', '0 1 240px', 'important');
        items[i].style.setProperty('width', 'min(240px, 100%)', 'important');
        items[i].style.setProperty('max-width', '260px', 'important');
        items[i].style.removeProperty('min-width');
        items[i].style.removeProperty('scroll-snap-align');
      }
    }
  }

  function setupSlider() {
    var list = productsList();
    var items = cards();
    if (!list) return;
    if (!items.length) return;
    if (list.getAttribute('data-vg-carousel')) return;
    list.setAttribute('data-vg-carousel', '1');

    var shell = document.createElement('div');
    shell.className = 'vg-super-slider';
    list.parentNode.insertBefore(shell, list);
    shell.appendChild(list);

    function arrowBtn(dir, label) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vg-super-arrow vg-super-' + dir;
      btn.setAttribute('aria-label', label);
      btn.innerHTML =
        dir === 'prev'
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var now = currentSlide(list, items);
        goToSlide(list, items, dir === 'prev' ? now - 1 : now + 1);
      });
      return btn;
    }

    shell.appendChild(arrowBtn('prev', 'Producto anterior'));
    shell.appendChild(arrowBtn('next', 'Producto siguiente'));

    var dots = document.createElement('div');
    dots.className = 'vg-super-dots';
    items.forEach(function (card, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vg-super-dot' + (i === 0 ? ' is-active' : '');
      btn.setAttribute('aria-label', 'Producto ' + (i + 1));
      btn.addEventListener('click', function () {
        goToSlide(list, items, i);
      });
      dots.appendChild(btn);
    });
    shell.appendChild(dots);

    list.addEventListener(
      'scroll',
      function () {
        var best = currentSlide(list, items);
        var buttons = dots.querySelectorAll('.vg-super-dot');
        Array.prototype.forEach.call(buttons, function (btn, i) {
          if (i === best) btn.classList.add('is-active');
          else btn.classList.remove('is-active');
        });
      },
      { passive: true }
    );
  }

  function loadDescriptions() {
    var q = String.fromCharCode(38);
    var url = restRoot() + 'wc/store/v1/products?per_page=50' + q + 'orderby=date' + q + 'order=desc';
    fetch(url, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (products) {
        if (!Array.isArray(products)) return;
        products.forEach(function (product) {
          var card = findCardForProduct(product);
          if (card) decorateCard(card, product);
        });
        cards().forEach(function (card) {
          var link = permalinkOf(card, null);
          if (!card.querySelector('.vg-origin')) ensureOrigin(card, 'Nacional', link);
          ensureLeaf(card);
          bindCardNav(card, link);
        });
        applyCarouselMode();
      })
      .catch(function (err) {
        console.warn('[VG] No se pudo cargar descripciones:', err);
      });
  }

  function run() {
    if (!document.getElementById('superalimentos')) return false;
    var list = productsList();
    if (!list) return false;
    window.__vgSuperLoaded = true;
    document.body.classList.add('vg-has-super');
    cards().forEach(function (card) {
      var url = permalinkOf(card, null);
      ensureOrigin(card, 'Nacional', url);
      ensureLeaf(card);
      bindCardNav(card, url);
    });
    setupSlider();
    applyCarouselMode();
    window.addEventListener('resize', applyCarouselMode);
    window.addEventListener('orientationchange', applyCarouselMode);
    loadDescriptions();
    return true;
  }

  function boot() {
    if (window.__vgSuperLoaded) return;
    if (run()) return;
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (run() || tries >= 20) clearInterval(timer);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
