# Producto — que pegar

El bloque **Producto individual** no hereda el CSS de Home ni de Tienda. Hay que pegar `block0` **dentro del Grupo**, como primer bloque (debajo del Header, antes de las migas).

```
Header
Grupo
  HTML block0          ← pegar esto
  Migas de pan
  Avisos
  Columnas (foto + compra)
  Related Products
Footer
```

| Bloque | HTML | CSS | JavaScript |
|---|---|---|---|
| **block0** | `block0/html.html` | `block0/css.css` | `block0/js.js` |

1. **Apariencia → Editor → Plantillas → Producto individual**.
2. Abre el **Grupo** (el que contiene migas, columnas y relacionados).
3. **+** al inicio de ese grupo → **HTML personalizado** (3 pestañas).
4. Pega HTML, CSS y JavaScript. No borres los bloques de WooCommerce.
5. **Guardar**. Abre un producto publicado (**Ver**) y recarga con Ctrl+F5.

En el editor, la fila de confianza y «Cómo consumirlo» no se ven: el JavaScript las coloca al abrir la página real, debajo del botón y antes de relacionados.

La etiqueta rosa (categoría) sale de la categoría del producto. SKU, marcas, etiquetas y las estrellas vacías quedan ocultos.
