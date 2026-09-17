# Tienda — que pegar en cada bloque

WordPress convierte `<` en el JavaScript y lo rompe (`i < n` deja de ser JS valido). El `js.js` nuevo no usa ese simbolo.

```
Coleccion del producto   ← ocultala o borrala
HTML block0
HTML block01
[/] Shortcode
HTML foot
```

| Bloque | HTML | CSS | JavaScript |
|---|---|---|---|
| **block0** | `block0/html.html` | `block0/css.css` | `block0/js.js` (solo scroll) |
| **block01** | `01-tienda/html.html` | `01-tienda/css.css` | **`01-tienda/js.js` (obligatorio, vuelve a pegarlo)** |
| **Shortcode** | `[products limit="48" columns="3" orderby="menu_order" order="ASC"]` | — | — |
| **foot** | `foot/html.html` | vacia | **vacia** |

Comprobacion: Ctrl+F5 y en consola `vgVGFilt` debe ser `function`.
