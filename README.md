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

## 🗡 Cómo usarla

Es una web estática sin dependencias ni instalación:

- **Opción 1:** abre `index.html` directamente en tu navegador.
- **Opción 2 (recomendada para el móvil en la mesa):** actívala en GitHub Pages
  (Settings → Pages → Deploy from branch → `main`) y abre la URL desde cualquier dispositivo.

## 📁 Estructura

```
├── index.html          # Las 8 pantallas de la app
├── css/styles.css      # Estética de fantasía oscura (pergamino, ámbar, acero)
└── js/
    ├── app.js          # Estado de partida, tablero, decisiones y resoluciones
    └── data/monsters.js# 29 monstruos: nivel, vida, tipo, habilidad y ~70 textos narrativos c/u
```

## 🧌 Datos de monstruos

`js/data/monsters.js` contiene 29 criaturas (10 de Nivel I, 12 de Nivel II y 7 de Nivel III),
cada una con su Habilidad Especial y tres pilas de textos de decisión (`buenas`, `malas`,
`estandar`) que alimentan el generador narrativo.

## ⚖ Aviso

The Witcher® y El Viejo Mundo son propiedad de sus respectivos dueños (CD PROJEKT S.A. /
Go On Board). Esta app es una ayuda de mesa creada por fans, sin ánimo de lucro y no está
afiliada ni patrocinada por los titulares de la marca.
