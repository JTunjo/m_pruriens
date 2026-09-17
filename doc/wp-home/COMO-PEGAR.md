# Home Velvet Greens — bloques independientes en WordPress

Cada carpeta en `blocks/` es **un bloque HTML personalizado** en la página Home.
Cada bloque tiene 3 archivos → 3 pestañas del editor:

| Archivo | Pestaña WP |
|---|---|
| `html.html` | **HTML** |
| `css.css` | **CSS** |
| `js.js` | **JavaScript** |

## Orden de los bloques

| # | Carpeta | Sección |
|---|---|---|
| 0 | `00-base` | Base |
| 1 | `01-inicio` | Hero |
| 2 | `02-nuestra-esencia` | Esencia |
| 3 | `03-mucuna` | Mucuna |
| 4 | `04-superalimentos` | Ver abajo (productos Woo) |
| 5 | `05-modo-de-uso` | Cómo consumirlos |
| 6 | `06-testimonios` | Testimonios |
| 7 | `07-cierre` | Cierre (cita, no es el pie de página) |
| 8 | `08-contacto` | Contacto |
| 9 | `09-footer` | Footer del sitio (plantilla WP, ver abajo) |

## Superalimentos (productos WooCommerce) — importante

No uses JS para listar productos (la pestaña JS se rompía con HTML).

En la Home, en este orden:

1. **Bloque HTML personalizado** → pega `04-superalimentos/html.html` + CSS del mismo folder. **JS vacío.**
2. **Bloque Shortcode** (Gutenberg: busca “Shortcode”) con exactamente:
   ```
   [products limit="12" columns="4" orderby="date" order="DESC"]
   ```
3. **Otro bloque HTML** → pega `04-superalimentos/html-footer.html` (botón “Ver todos”). El CSS ya está en el paso 1.

Así WooCommerce muestra foto, precio y **Añadir al carrito** solo.

La página completa **Tienda** (`/tienda`) se arma aparte: ver `doc/wp-shop/COMO-PEGAR.md`.

La página **Carrito** (y Checkout) se arma aparte: ver `doc/wp-cart/COMO-PEGAR.md`.

### Foto y descripción del producto
En **Productos → Mucuna 90g**:
1. Sube la **Imagen del producto** (ideal 400×400).
2. Completa la **Descripción corta** (sale en la tarjeta de la Home).
3. Actualiza / publica.

En el bloque encabezado de superalimentos, pestaña **JavaScript**, pega `04-superalimentos/js.js` (solo JS, sin HTML). Ese script añade la descripción corta bajo el nombre.

## Testimonios
Bloque `06-testimonios` → pestaña **JavaScript** → variable `VG_TESTIMONIOS_URL`.

Los datos ya **no** se editan en el JS: se cargan con `fetch` desde el servicio Google Apps Script (JSON).

Formato del JSON:
```json
[
  {
    "nombre": "María José",
    "ciudad": "Medellín",
    "texto": "...",
    "foto": "https://...",
    "iniciales": "MJ"
  }
]
```

Si cambia la URL del servicio, actualiza solo `VG_TESTIMONIOS_URL` en el JS.

## Navbar
`/#inicio` `/#nuestra-esencia` `/#mucuna` `/#superalimentos` `/#modo-de-uso` `/#testimonios` `/#contacto`

## Footer del sitio (plantilla WordPress)

Esto **no** va en la página Home. Va en el pie de **todo el sitio** (el de Twenty Twenty-Five con el gato, Blog, About, Shop).

Estás en: **Apariencia → Editor → Partes de plantilla → Footer**.

1. En el canvas, selecciona el grupo del footer (logo + Velvet Greens + menús) y **bórralo**. También borra “Twenty Twenty-Five” y “Designed with WordPress”.
2. **+** → busca **Personalizado HTML** (el bloque nativo de Gutenberg; no hace falta el de 3 pestañas).
3. Pega **todo** `09-footer/html.html` (el CSS ya va dentro de un `<style>`).
4. Cambia la URL del logo (súbelo a **Medios**), el WhatsApp, Instagram y Facebook.
5. **Guardar**.

## Botón de WhatsApp flotante (toda la web)

Va en el **mismo HTML del footer** (`09-footer/html.html`). Como el footer es plantilla del sitio, el icono se ve en Inicio, Tienda, Carrito, etc., y se queda fijo abajo a la derecha al hacer scroll.

1. En el HTML del footer, cambia el número (sin `+` ni espacios):

```
https://wa.me/573001234567
```

Ejemplo: `+57 318 609 6066` → `https://wa.me/573186096066`

2. Vuelve a pegar **todo** `09-footer/html.html` (reemplaza el HTML anterior, no lo dejes duplicado) en **Apariencia → Editor → Partes de plantilla → Footer** y **Guardar**.
3. Recarga el sitio con Ctrl+F5. Debe verse un **círculo verde** abajo a la derecha, no una barra.

Si usas el bloque de 3 pestañas: HTML + CSS + JS de `09-footer` (el JS mueve el botón al `body` para que el tema no lo estire).

Al abrir el **mini carrito**, el icono se oculta solo. Si no pasa: pega de nuevo `09-footer/html.html` en el Footer, o el CSS de `doc/wp-cart/blocks/mini-cart/css.css` en **Apariencia → Editor → Estilos → CSS adicional**.

Opcional: un mensaje prellenado en el chat:

```
https://wa.me/573001234567?text=Hola%2C%20quiero%20información%20sobre%20Mucuna
```

Si en vez de eso usas el bloque de 3 pestañas: HTML + CSS de `09-footer` (el JS es opcional).

Las columnas **Ayuda** apuntan a `/preguntas-frecuentes`, `/envios`, `/politicas` y `/terminos`. Crea esas páginas cuando las tengas, o cambia los `href` en el HTML.
