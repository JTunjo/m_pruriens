# Terciopelo — Guía de configuración para WordPress + WooCommerce

Esta guía explica cómo convertir el mockup de **Terciopelo** (la tienda de Mucuna Pruriens incluida en este proyecto) en una tienda real funcionando sobre **WordPress + WooCommerce**, con catálogo, carrito y checkout, precios en **COP** y la identidad de marca (acento magenta `#C9137E` sobre base crema/espresso).

> **Qué es este proyecto:** un prototipo de alta fidelidad en HTML/JS. **No es** un tema de WordPress instalable directamente. Sirve como **referencia visual y funcional**: copias sus colores, tipografías, textos, estructura de páginas y lista de productos a una instalación real de WooCommerce.

---

## 0. Resumen del flujo

1. Instalar WordPress + WooCommerce.
2. Configurar tienda en **COP** (Colombia).
3. Cargar los **6 productos** del catálogo (con variantes).
4. Aplicar la **identidad de marca** (colores, fuentes, logo).
5. Configurar **envíos**, **cupón `MUCUNA10`** y **pasarelas de pago** (Colombia).
6. Maquetar Inicio / Tienda / Carrito / Checkout.
7. Páginas legales y puesta en marcha.

---

## 1. Requisitos previos

- **Hosting** con PHP 7.4+ (recomendado 8.1+), MySQL 5.7+/MariaDB 10.4+, HTTPS activo.
- **WordPress** 6.x.
- **WooCommerce** (plugin gratuito, última versión).
- Acceso al panel de administración (`/wp-admin`).

Hostings comunes en Colombia/LatAm: cualquiera con instalador de WordPress (1‑click) funciona. Asegúrate de tener **certificado SSL** (obligatorio para cobrar pagos).

---

## 2. Instalar WooCommerce

1. En `wp-admin` → **Plugins → Añadir nuevo** → busca **WooCommerce** → **Instalar** → **Activar**.
2. Corre el asistente de configuración (**Setup Wizard**):
   - **País / región:** Colombia.
   - **Moneda:** Peso colombiano (COP).
   - **Tipo de productos:** Productos físicos.
3. WooCommerce crea automáticamente las páginas **Tienda**, **Carrito**, **Finalizar compra (Checkout)** y **Mi cuenta**.

---

## 3. Configurar moneda COP

**WooCommerce → Ajustes → General:**

| Campo | Valor |
|---|---|
| Moneda | Peso colombiano (COP) |
| Posición de la moneda | Izquierda (`$`) |
| Separador de miles | `.` (punto) |
| Separador de decimales | `,` (coma) |
| Número de decimales | `0` |

> Esto produce el formato `$45.900` igual que en el mockup. El COP normalmente **no usa decimales**, por eso se pone `0`.

---

## 4. Cargar los productos

**Productos → Añadir nuevo** para cada uno. Estos son los datos exactos del mockup:

### 4.1 Productos con variantes (usar tipo **Producto variable**)

**Mucuna en Polvo Pura** — categoría `Polvos`
- Descripción: *Nuestra mucuna estrella: vainas cosechadas a mano, secadas al sol y molidas en frío para conservar la L‑DOPA. Sabor terroso y achocolatado, ideal en batidos, café o avena.*
- Atributo **Presentación**: `100 g`, `250 g`, `500 g`
- Variaciones / precios: `100 g → 45.900` · `250 g → 89.900` · `500 g → 149.900`
- Etiquetas: Ánimo, Foco, Energía

**Semillas de Mucuna Tostadas** — categoría `Semillas`
- Descripción: *El ojo de venado entero, tostado suavemente. Para preparar en infusión, moler en casa o usar en repostería funcional.*
- Atributo **Presentación**: `250 g`, `500 g`
- Precios: `250 g → 38.900` · `500 g → 68.900`

**Chocolate de Mucuna 70%** — categoría `Chocolate`
- Descripción: *Cacao colombiano 70% fundido con mucuna en polvo. El gusto del chocolate oscuro con el respaldo del frijol terciopelo.*
- Atributo **Presentación**: `Barra 80 g`, `Pack x3`
- Precios: `Barra 80 g → 28.900` · `Pack x3 → 79.900`

### 4.2 Productos simples (tipo **Producto simple**)

| Producto | Categoría | Precio | Descripción |
|---|---|---|---|
| Barras Reset de las 3pm (Caja x6) | Snacks | 42.900 | Dátil, almendra, cacao y mucuna prensados en una barra densa para el bajón de las 3 de la tarde. |
| Cacao + Mucuna para Preparar (300 g) | Snacks | 54.900 | Mezcla para chocolate caliente funcional: cacao, especias y mucuna. |
| Bliss Balls de Mucuna (Caja x9) | Snacks | 36.900 | Bocados de coco, dátil, cacao y mucuna rodados a mano. |

### 4.3 Campos recomendados por producto
- **Modo de uso** e **Ingredientes**: agrégalos como pestañas de descripción adicionales (con el bloque "Descripción larga" o un plugin de pestañas como *WooCommerce Tab Manager*).
- **Imágenes:** sube las fotos reales del producto. En el mockup los espacios de imagen son marcadores (drag-and-drop) justamente para que coloques tu fotografía real.
- **Categorías de producto** a crear: `Polvos`, `Semillas`, `Chocolate`, `Snacks` (coinciden con los filtros del mockup).

> **Atajo:** puedes cargar todo de una vez con **Productos → Importar** usando un CSV. WooCommerce trae un importador nativo. Estructura mínima de columnas: `Name, Type (simple/variable), Categories, Regular price, Description, Images`.

---

## 5. Aplicar la identidad de marca

El mockup define el sistema visual. Tienes dos caminos:

### Opción A — Tema de bloques + CSS (recomendado, sin código pesado)
Usa un tema moderno (ej. **Twenty Twenty‑Four**, **Botiga**, **Blocksy** o **Astra**) y aplica los tokens de marca.

**Colores de marca:**
| Token | HEX | Uso |
|---|---|---|
| Acento (magenta) | `#C9137E` | Botones, enlaces, precios destacados |
| Acento hover | `#A60E66` | Hover de botones |
| Fondo crema | `#F6F1E7` | Fondo general |
| Tarjeta crema | `#F1E7D6` / `#FFFFFF` | Tarjetas / paneles |
| Texto espresso | `#2A211C` | Texto principal |
| Texto suave | `#6B5D52` | Texto secundario |
| Plum oscuro | `#2E0E20` | Footer y bandas oscuras |

En **Apariencia → Editor → Estilos** (tema de bloques) define estos colores en la paleta, o pégalos en **Apariencia → Personalizar → CSS adicional**:

```css
:root{
  --tc-accent:#C9137E;
  --tc-accent-dark:#A60E66;
  --tc-cream:#F6F1E7;
  --tc-espresso:#2A211C;
  --tc-soft:#6B5D52;
  --tc-plum:#2E0E20;
}
body{ background:var(--tc-cream); color:var(--tc-espresso); }
a, .price{ color:var(--tc-espresso); }
.woocommerce a.button, .woocommerce button.button.alt,
.wc-block-components-button{
  background:var(--tc-accent) !important; color:#fff !important;
  border:none !important; border-radius:8px !important;
}
.woocommerce a.button:hover, .woocommerce button.button.alt:hover{
  background:var(--tc-accent-dark) !important;
}
```

**Tipografías** (todas en Google Fonts, gratis):
- Títulos: **Spectral** (peso 600; itálica para acentos)
- Texto: **Hanken Grotesk** (400/500/600)
- Etiquetas / datos / precios pequeños: **Space Mono** (mayúsculas, con `letter-spacing`)

Cárgalas con un plugin de fuentes (la mayoría de temas de bloques tienen gestor de fuentes en el Editor) o así:
```html
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

**Iconos:** el mockup usa **Phosphor Icons (variante fill)**. En WordPress puedes incrustarlos con el CDN:
```html
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css">
<i class="ph-fill ph-leaf"></i>
```

**Logo:** la marca del seedling/*ojo de venado* es un SVG (óvalo magenta con banda). Está incrustado en el archivo `Terciopelo Mucuna Shop.dc.html` — búscalo (etiqueta `<svg viewBox="0 0 120 96">`), cópialo a un archivo `logo.svg` y súbelo en **Apariencia → Personalizar → Identidad del sitio**.

### Opción B — Tema a medida / agencia
Si quieres replicar el diseño pixel a pixel, entrega este proyecto a un desarrollador de temas WooCommerce. El HTML del mockup sirve como **maqueta de referencia** para construir las plantillas (`archive-product.php`, `single-product.php`, `cart.php`, `checkout.php` o sus equivalentes en bloques).

---

## 6. Envíos

El mockup tiene dos métodos y envío gratis sobre cierto monto.

**WooCommerce → Ajustes → Envío → Zonas de envío** → crea zona **Colombia**:

| Método | Configuración |
|---|---|
| **Estándar (3–5 días)** | Tarifa plana: `12.000` |
| **Express (24–48 h)** | Tarifa plana: `18.900` |
| **Envío gratis** | Activar con requisito *"Un importe mínimo de pedido"* = `120.000` |

> Para que "Envío gratis" reemplace al estándar al superar `$120.000`, ordena los métodos y/o usa la lógica de WooCommerce que oculta tarifas pagas cuando el envío gratis está disponible (Ajustes del método de envío gratis → "Aplica a: Un importe mínimo de pedido").

---

## 7. Cupón de descuento

El mockup incluye el cupón **`MUCUNA10`** = 10%.

**Marketing → Cupones → Añadir cupón:**
- Código: `MUCUNA10`
- Tipo de descuento: **Porcentaje**
- Importe: `10`
- (Opcional) Límite de uso, fecha de expiración.

> Asegúrate de que los cupones estén habilitados: **WooCommerce → Ajustes → General → "Habilitar el uso de códigos de cupón"**.

---

## 8. Pasarelas de pago (Colombia)

El mockup muestra **Tarjeta**, **PSE** y **Pago contra entrega**. En producción:

| Método mockup | Plugin / gateway recomendado en Colombia |
|---|---|
| Tarjeta crédito/débito | **Wompi**, **Mercado Pago**, **ePayco**, **PayU LatAm** o **Stripe** |
| **PSE** (débito bancario) | **Wompi**, **ePayco**, **PayU** o **Mercado Pago** (todos soportan PSE) |
| Contra entrega | WooCommerce nativo → **Pago contra entrega (Cash on delivery)** |

Pasos:
1. Instala el plugin de la pasarela elegida (ej. *Wompi for WooCommerce*).
2. Crea cuenta de comercio en la pasarela y obtén las **llaves API** (pública/privada).
3. **WooCommerce → Ajustes → Pagos** → activa y pega las llaves.
4. Activa **Pago contra entrega** nativo y nómbralo "Pago contra entrega".
5. Prueba en **modo sandbox** antes de salir a producción.

> Casi todas estas pasarelas colombianas incluyen **PSE** dentro del mismo plugin, así que con una sola integración cubres Tarjeta + PSE.

---

## 9. Maquetar las páginas

| Página del mockup | Equivalente WooCommerce | Cómo armarla |
|---|---|---|
| **Inicio** | Página de inicio (estática) | Constrúyela con el editor de bloques: hero, 4 tarjetas de beneficios, productos destacados (bloque *Productos*), banda "ritual de las 3pm", cita. |
| **Tienda** | Página **Tienda** (`shop`) | WooCommerce la genera. Activa filtros por categoría (bloque *Filtrar por categoría* o widget). |
| **Producto** | **Single product** | Plantilla nativa. Agrega galería, selector de presentación (atributo), pestañas Modo de uso/Ingredientes. |
| **Carrito** | Página **Carrito** | Nativa. Muestra subtotal, envío, cupón. |
| **Checkout** | Página **Finalizar compra** | Nativa. Contiene contacto, envío, método de envío y pago. |
| **Confirmación** | **Order received / Thank you** | Nativa tras el pago. Personaliza el texto "¡Pedido confirmado!". |

**Textos de marca reutilizables** (copia/pega del mockup):
- Barra superior: `ENVÍO GRATIS DESDE $120.000 · CULTIVADO Y MOLIDO EN COLOMBIA · 100% MUCUNA PRURIENS`
- Titular hero: *El frijol terciopelo para tu ánimo, foco y energía.*
- Beneficios: Ánimo y dopamina · Foco y claridad · Energía y vitalidad · Reset de las 3pm
- Cita: *"Cambié mi café de la tarde por la barra Reset. Sin bajón, sin ansiedad..."* — María José, Medellín

---

## 10. Páginas legales y avisos

Importante para suplementos/alimentos:
- **Términos y condiciones**, **Política de privacidad**, **Política de envíos y devoluciones**.
- **Aviso de salud:** Mucuna pruriens es un suplemento; incluye un descargo ("Este producto no pretende diagnosticar, tratar ni curar enfermedades. Consulta a tu médico"). Verifica los requisitos del **INVIMA** (Colombia) para comercializar suplementos/alimentos.

---

## 11. Checklist de puesta en marcha

- [ ] WooCommerce instalado y moneda en COP (formato `$45.900`).
- [ ] 6 productos cargados con categorías, variantes y fotos.
- [ ] Colores, fuentes (Spectral / Hanken Grotesk / Space Mono) y logo aplicados.
- [ ] Envíos (Estándar $12.000, Express $18.900, gratis desde $120.000).
- [ ] Cupón `MUCUNA10` (10%).
- [ ] Pasarela de pago en producción (Tarjeta + PSE) y contra entrega.
- [ ] Páginas Inicio/Tienda/Carrito/Checkout maquetadas.
- [ ] Páginas legales + aviso de salud / INVIMA.
- [ ] SSL activo y pago probado con una compra real.

---

## Archivos de este proyecto

| Archivo | Qué es |
|---|---|
| `Terciopelo Mucuna Shop.dc.html` | Mockup principal (Inicio, Tienda, Producto, Carrito, Checkout, Confirmación). Ábrelo en el navegador. |
| `ProductCard.dc.html` | Componente de tarjeta de producto reutilizable usado por el mockup. |
| `image-slot.js` | Componente para los espacios de imagen drag-and-drop. |
| `support.js` | Runtime interno del prototipo (no editar). |
| `SETUP-WordPress-WooCommerce.md` | Esta guía. |

> El mockup es la **fuente de verdad de diseño**. WordPress + WooCommerce es donde se vuelve una tienda transaccional real.
