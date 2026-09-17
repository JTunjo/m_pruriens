# Carrito — que pegar

El bloque **Carrito** de WooCommerce no usa el CSS de Home ni de Tienda. Hay que pegar `block0` **arriba** de ese bloque.

```
HTML block0          ← pegar esto
Carrito (WooCommerce) ← ya esta; no lo borres
```

| Bloque | HTML | CSS | JavaScript |
|---|---|---|---|
| **block0** | `block0/html.html` | `block0/css.css` | vacia (o `block0/js.js`) |

1. En **Paginas → Carrito**, **+** → HTML personalizado (3 pestanas).
2. Pega HTML + CSS. JS vacio.
3. Deja el bloque Carrito de WooCommerce debajo.
4. **Guardar** y abre **Ver pagina** (Ctrl+F5). El editor no siempre aplica estos estilos.

El recuadro **+** debajo de “Proceder al pago” es del editor; en la web no sale.

## Checkout

Misma receta en **Paginas → Finalizar compra**: pega el mismo `block0` arriba del bloque Checkout. El CSS ya cubre ambos.

## Mini carrito (cajon del icono)

Eso **no** es la pagina Carrito. Es el bloque Mini-Cart del header; sale en todas las paginas. El CSS de `block0` no le aplica.

### Textos y botones (editor)

1. **Apariencia → Editor**.
2. Clic en el **icono del carrito** del header (o **Partes de plantilla → Mini-Cart**).
3. Se abre el cajon con la misma lista de bloques que el carrito grande (`Filled Mini Cart`, titulo, productos, botones).
4. Clic en **Ver mi carrito** o **Ir a finalizar compra** → en la barra lateral puedes cambiar el texto del boton.
5. El `(items: 2)` es el bloque **Items Counter**. Seleccionalo y **borralo** o **oculalo** (ojo) si no lo quieres. El titulo **Tu carrito** se edita en el bloque de titulo.

Guarda. Recarga el sitio con Ctrl+F5.

### Estilos (color del boton, fuentes)

Hay que pegar CSS **en todo el sitio**, no en la pagina Carrito:

1. **Apariencia → Editor → Estilos** (icono de medio circulo, arriba a la derecha).
2. Tres puntitos → **CSS adicional**.
3. Pega **solo** el CSS de `blocks/mini-cart/css.css` (sin HTML, sin etiquetas).
4. **Guardar**.

Si WordPress dice que el CSS no es valido por el marcado `<>`, es que se copio un comentario o HTML con esas etiquetas. Vuelve a copiar el archivo; ya no las tiene.

Ese CSS también **oculta el WhatsApp flotante** mientras el cajón está abierto. Si el icono sigue tapando el carrito, vuelve a pegar este archivo completo en CSS adicional y recarga con Ctrl+F5.

Si no encuentras CSS adicional: pega ese mismo CSS al final del bloque de estilos del footer (`doc/wp-home/blocks/09-footer/html.html`) y vuelve a guardar la parte Footer.

## Textos en ingles

`Add coupons`, `Estimated total`, `items` y `Shipping will be calculated at checkout` no se editan en el bloque. Usa **Say What?** o Loco Translate (dominio `woocommerce`).
