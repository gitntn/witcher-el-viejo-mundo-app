# El Viejo Mundo — Compañero de Caza 🐺⚔

App companion (no oficial) para el juego de mesa **The Witcher: El Viejo Mundo**, con soporte
para la expansión **Islas Skellige**. Gestiona los monstruos activos del tablero, genera
decisiones narrativas de combate y te guía por las consecuencias de cada resultado, para que
la mesa se concentre en jugar.

> Proyecto de fans, en español. No incluye material con copyright: solo texto de ayuda,
> datos propios y referencias de páginas al reglamento oficial.

## ✨ Qué hace

1. **Pantalla de Inicio** — estética de fantasía oscura. Eliges de 1 a 5 jugadores; la app
   calcula internamente la pila de reserva de monstruos de Nivel I para la reaparición
   (1 ficha con 4 jugadores, 2 fichas con 5).
2. **Preparación** — muestra el Oro y las cartas iniciales de cada jugador según el orden de
   turno (tabla oficial), más los pasos extra de partidas de 4/5 jugadores, de 2 jugadores y
   del Modo en Solitario. El botón **«Iniciar la Cacería»** baraja digitalmente los monstruos
   y asigna los tres primeros al tablero.
3. **Tablero Principal (Rastros Activos)** — las 3 bestias activas, cada una ligada a su
   Terreno (🌲 Bosque, ⛰ Montaña, 🌊 Agua) con su Nivel (I/II/III), familia, Vida,
   **Localización Activa** y **Localización de Debilidad**. Incluye los eventos globales
   **Lucha Entre Brujos** y **Lucha contra Dagon**.
4. **Evento de Monstruo (Cacería)** — ambientación narrativa de la criatura y la sección
   ámbar **«Aplica esta regla del monstruo»** con su Habilidad Especial. Botón para
   **Generar una Decisión de Combate**.
5. **Decisión de Combate** — una cinemática de texto aleatoria con tres posibles resultados:
   **Maniobra Exitosa** (verde, otorga un bonus), **Error Táctico** (rojo, impone una
   penalización) o **Choque Estándar** (ámbar, sin modificadores). Después se juega el
   combate físico en la mesa y se registra el resultado.
6. **Resoluciones**:
   - **La bestia ha caído** — recompensas (2 de Oro, Trofeo, Fatiga…) y reaparición
     automática de un monstruo de Nivel superior (o de la pila de reserva en partidas
     de 4/5 jugadores; en Solitario no reaparecen).
   - **El monstruo huyó** — la bestia viaja a su **Localización de Debilidad** y se cura por
     completo; cobras 2 de Oro y una carta de coste 0.
   - **La bestia te venció** — penalizaciones de la Derrota Absoluta (Ficha de Rastro,
     carta de coste 0, máximo 2 cartas en la Fase III) y fin de turno. El monstruo no se mueve.
7. **Lucha Entre Brujos** — recordatorio de la Fase de Apuestas (máximo 1 de Oro, contra la
   banca, no disponible a 2 jugadores) y resolución según venza el Atacante o el Defensor,
   con recompensas en verde y consecuencias del perdedor.
8. **Lucha contra Dagon** (Islas Skellige) — la carta del Señor de las Profundidades
   (Vida 15 y su regla especial) y sus dos desenlaces: **«Dagon fue ahuyentado»**
   (2 de Oro, carta de coste 0, carta de Bonus de Dagon, mover su miniatura en el Medidor
   de Peligro, sin Fatiga) o **«Derrota Total»** (Rastro de Dagon, carta de coste 0,
   1 carta menos en la Fase III).

La partida se guarda automáticamente en el navegador (`localStorage`): puedes cerrar la
pestaña y retomar la cacería donde la dejaste.

## 📱 App instalable y sin conexión (PWA)

La app es una **Progressive Web App**: desde el móvil (o el escritorio) puedes
**«Añadir a la pantalla de inicio» / «Instalar»** y se abrirá a pantalla completa, como
una app nativa, con su propio icono. Un *service worker* cachea todo el contenido
(las 29 cartas incluidas), así que una vez abierta **funciona sin conexión** — ideal para
la mesa de juego aunque no haya wifi.

## 🎨 Imágenes y animaciones

- **Las 29 cartas de monstruo reales** fotografiadas del juego y recortadas
  automáticamente (detección de contornos + corrección de perspectiva). Si algún día
  faltara una imagen, la app muestra el emblema de su terreno como respaldo.
- **Arte de terrenos** (bosque, montaña, agua) para emblemas y fondos, y la **portada del
  manual** como fondo de la pantalla de inicio con efecto Ken Burns.
- **Set de iconos SVG propios** (dibujados a mano y verificados por rasterizado): terrenos
  (pino, montaña, olas), dado, espadas cruzadas, ráfaga de viento, calavera, **medallón de
  lobo**, moneda y trofeo. Se montan como sprite inline (`<symbol>` + `<use>`), heredan el
  color del contexto (`currentColor`) y reemplazan a los emoji, que se veían distintos en
  cada dispositivo.
- **Animaciones de última generación**: transiciones de pantalla con la View Transitions
  API, entradas escalonadas con desenfoque, cartas con **tilt 3D y brillo dinámico** al
  pasar el ratón, **medallón de brujo que vibra** (como cerca de un monstruo), **tirada
  animada del destino** al generar la Decisión de Combate (el medallón gira y cambia de
  color antes de revelar el resultado), **aparición dramática del nuevo monstruo** en el
  tablero tras una victoria (la carta se materializa girando, con un destello del color de
  su terreno y un banderín «Nuevo rastro»), brasas flotantes en las pantallas de cacería
  (azules en la de Dagon), revelado dramático de la decisión, destellos en botones y grano
  cinematográfico. Todo se desactiva con `prefers-reduced-motion`.

La foto de cada bestia se muestra como imagen destacada en su carta del tablero (con
fundido inferior hacia los datos), y de fondo difuminado en la pantalla de cacería.

## 🗡 Cómo usarla

Es una web estática sin dependencias ni instalación:

- **Opción 1:** abre `index.html` directamente en tu navegador.
- **Opción 2 (recomendada para el móvil en la mesa):** actívala en GitHub Pages
  (Settings → Pages → Deploy from branch → `main`) y abre la URL desde cualquier dispositivo.

## 📁 Estructura

```
├── index.html              # Las 8 pantallas de la app
├── manifest.webmanifest    # Metadatos PWA (nombre, iconos, standalone)
├── sw.js                   # Service worker: caché offline del app shell + cartas
├── css/styles.css          # Fantasía oscura + animaciones (tilt, embers, ken-burns)
├── assets/
│   ├── img/
│   │   ├── portada.jpg     # Portada del manual (fondo de inicio)
│   │   ├── dagon.jpg       # Tormenta de Skellige (fondo de Dagon)
│   │   ├── cartas/         # 29 fotos de cartas recortadas (todas las criaturas)
│   │   └── terrenos/       # bosque.jpg, montana.jpg, agua.jpg
│   └── icons/              # Iconos PWA + favicon + apple-touch-icon
└── js/
    ├── app.js              # Estado de partida, tablero, decisiones, resoluciones, tilt 3D, SW
    └── data/
        ├── monsters.js     # 29 monstruos: nivel, vida, tipo, habilidad y ~70 textos c/u
        └── images.js       # Mapa monstruo→carta, terrenos y portada
```

## 🧌 Datos de monstruos

`js/data/monsters.js` contiene 29 criaturas (10 de Nivel I, 12 de Nivel II y 7 de Nivel III),
cada una con su Habilidad Especial y tres pilas de textos de decisión (`buenas`, `malas`,
`estandar`) que alimentan el generador narrativo.

## ⚖ Aviso

The Witcher® y El Viejo Mundo son propiedad de sus respectivos dueños (CD PROJEKT S.A. /
Go On Board). Esta app es una ayuda de mesa creada por fans, sin ánimo de lucro y no está
afiliada ni patrocinada por los titulares de la marca.
