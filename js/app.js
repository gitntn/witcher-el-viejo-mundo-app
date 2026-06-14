/* ============================================================
   The Witcher: El Viejo Mundo — Compañero de Caza
   Lógica de la aplicación (vanilla JS, sin dependencias)
   Datos de reglas: reglamento oficial ES + expansión Skellige
   ============================================================ */

"use strict";

/* ---------------- Constantes de juego ---------------- */

const STORAGE_KEY = "viejoMundoCompanion.v1";

const TERRAINS = {
  bosque:  { label: "Bosque",  icon: "🌲", color: "var(--bosque)" },
  montana: { label: "Montaña", icon: "⛰",  color: "var(--montana)" },
  agua:    { label: "Agua",    icon: "🌊", color: "var(--agua)" },
};

/* Localizaciones del mapa del Viejo Mundo agrupadas por tipo de Terreno
   (6 fichas de Localización por terreno, como las 18 del juego de mesa). */
const LOCATIONS = {
  bosque:  ["Brokilon", "Glenmore", "Burdorff", "Ellander", "Dol Blathanna", "Riedbrune"],
  montana: ["Kaer Morhen", "Mahakam", "Ard Carraigh", "Ban Ard", "Kaer Seren", "Blaviken"],
  agua:    ["Novigrad", "Cintra", "Cidaris", "Oxenfurt", "Vengerberg", "Attre"],
};

/* Compensaciones iniciales por número de jugadores (Reglamento, pág. 8). */
const SETUP_TABLE = {
  1: [
    { gold: 3, cards: 5, note: "Modo en Solitario (pág. 33): toma 3 de Oro y roba 5 cartas." },
  ],
  2: [
    { gold: 2, cards: 3 },
    { gold: 4, cards: 5 },
  ],
  3: [
    { gold: 2, cards: 3 },
    { gold: 4, cards: 4 },
    { gold: 6, cards: 5 },
  ],
  4: [
    { gold: 4, cards: 2 },
    { gold: 5, cards: 3 },
    { gold: 6, cards: 4 },
    { gold: 7, cards: 5 },
  ],
  5: [
    { gold: 5, cards: 2 },
    { gold: 5, cards: 3 },
    { gold: 5, cards: 4 },
    { gold: 7, cards: 4 },
    { gold: 7, cards: 5 },
  ],
};

/* Ambientación narrativa por familia de monstruo. */
const FAMILY_LORE = [
  { match: /putrido|podrido/i,      text: "El hedor a carne podrida te golpea antes de verlo. Cada paso de la criatura deja un reguero de pus que abrasa la hierba, y tu medallón tiembla como un pájaro atrapado." },
  { match: /nido/i,                 text: "La tierra está removida y sembrada de huesos roídos. Del agujero brota un coro de chasquidos húmedos: no cazas a una bestia, sino a la madriguera entera." },
  { match: /necrofago/i,            text: "Huele a tumba abierta y a lluvia vieja. Los carroñeros han dejado de disputarse los cadáveres: algo más grande ha reclamado este festín, y te está mirando." },
  { match: /espectro/i,             text: "El aire se enfría de golpe y la luz parece espesarse. Un lamento que no pertenece a este mundo se arrastra entre los árboles, y tu plata vibra pidiendo salir de la vaina." },
  { match: /vampiro/i,              text: "Demasiado silencio. Ni grillos, ni aves, ni viento. Solo un perfume dulzón a sangre seca y la certeza de que la sombra que acabas de ver no era la tuya." },
  { match: /bruja/i,                text: "Las ofrendas podridas cuelgan de los árboles y los fetiches de hueso giran sin viento. La vieja del pantano sabe que has venido… llevaba tiempo esperándote." },
  { match: /reliquia/i,             text: "Esta criatura ya era vieja cuando los primeros hombres cruzaron las esferas. La tierra misma parece obedecerla, y tu medallón vibra con una fuerza que pocas veces has sentido." },
  { match: /insectoide/i,           text: "El bosque cruje con un repiqueteo de quitina. Entre los troncos, restos envueltos en seda cuelgan como frutos maduros. El caparazón de la bestia brilla, húmedo, esperándote." },
  { match: /hibrido/i,              text: "Una sombra alada cruza el sol y los caballos enloquecen. Garras, plumas y hambre: la bestia ha marcado este territorio como su coto de caza, y tú acabas de entrar en él." },
  { match: /draconido/i,            text: "Huesos calcinados marcan el camino hasta el risco. Un chillido agudo corta el cielo: el wyverno ha alzado el vuelo y ya ha visto la plata de tu espada." },
  { match: /ogroide/i,              text: "Las pisadas son tan profundas que podrías dormir en ellas. Rocas apiladas, árboles arrancados de cuajo: aquí vive algo enorme, y no le gustan las visitas." },
  { match: /maldito/i,              text: "La aldea entera calla cuando preguntas por la bestia. Hay una maldición en el aire, vieja y rencorosa, y esta noche la luna saldrá llena." },
  { match: /planta/i,               text: "El claro está demasiado verde, demasiado quieto. Bajo el manto de flores dulzonas, la tierra late despacio. Algo con raíces ha aprendido a tener hambre." },
];
const DEFAULT_LORE = "Tu medallón vibra. El rastro es fresco, el contrato está firmado y la bestia te espera donde el camino se acaba. Es hora de trabajar.";

/* Efectos de la Decisión de Combate. */
const DECISION_EFFECTS = {
  buena: [
    "El Monstruo comienza el Combate con <strong>1 carta menos</strong> en su Reserva de Vida.",
    "Inicias con un <strong>Escudo Quen</strong>: sube 1 tu nivel de Escudo (sin superar tu nivel de Defensa).",
    "Tu aproximación es impecable: <strong>tomas el primer Turno de Combate</strong>, como si tuvieras la Ficha de Rastro de este Monstruo.",
    "Durante tu primer Turno de Combate, <strong>roba 1 carta adicional</strong>.",
    "La bestia descuida su huida: el monstruo <strong>pierde un rastro</strong>. Si vence o huye, este Combate no te obliga a tomar su Ficha de Rastro.",
    "Encuentras hierbas frescas por el camino: <strong>roba 1 Poción</strong> antes de comenzar el Combate.",
  ],
  mala: [
    "Con las prisas pierdes parte del equipo: <strong>descarta 1 Poción</strong> sin usar (si no tienes, descarta 1 carta de tu mano).",
    "La bestia te sorprende a media guardia: <strong>baja 1 tu nivel de Escudo</strong> antes de empezar.",
    "Pisas una rama seca en el peor momento: <strong>el Monstruo toma el primer Turno de Combate</strong>, incluso si tienes su Ficha de Rastro.",
    "El terreno juega en tu contra: <strong>descarta 1 carta aleatoria de tu mano</strong> antes de que se cree la Reserva de Vida.",
    "Llegas exhausto al choque: durante tu primer Turno de Combate, <strong>robas 1 carta menos</strong>.",
  ],
  estandar: [
    "Sin ventajas ni penalizaciones. <strong>Que el acero decida.</strong>",
    "Ninguno de los dos cede terreno. <strong>Comenzáis el choque en igualdad de condiciones.</strong>",
    "La bestia te mide y tú la mides a ella. <strong>Combate sin modificadores.</strong>",
  ],
};

const DECISION_KINDS = {
  buena:    { tag: "✦ Maniobra Exitosa", color: "var(--green)" },
  mala:     { tag: "✖ Error Táctico",    color: "var(--blood)" },
  estandar: { tag: "⚔ Choque Estándar",  color: "var(--amber)" },
};

/* ---------------- Utilidades ---------------- */

const $ = (sel) => document.querySelector(sel);

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const roman = (n) => ["", "I", "II", "III"][n] || n;

function monstersByLevel(level) {
  return Object.keys(MONSTERS_DATA).filter((name) => MONSTERS_DATA[name].nivel === level);
}

function loreFor(name) {
  const tipo = (MONSTERS_DATA[name] && MONSTERS_DATA[name].tipo) || "";
  const hit = FAMILY_LORE.find((f) => f.match.test(tipo)) || FAMILY_LORE.find((f) => f.match.test(name));
  return hit ? hit.text : DEFAULT_LORE;
}

/* Tilt 3D con brillo dinámico (se desactiva con prefers-reduced-motion). */
function attachTilt(el, maxDeg = 7) {
  if (REDUCED_MOTION || !window.PointerEvent) return;
  el.addEventListener("pointermove", (ev) => {
    const r = el.getBoundingClientRect();
    const px = (ev.clientX - r.left) / r.width;
    const py = (ev.clientY - r.top) / r.height;
    el.style.setProperty("--ry", ((px - 0.5) * 2 * maxDeg).toFixed(2) + "deg");
    el.style.setProperty("--rx", ((0.5 - py) * 2 * maxDeg).toFixed(2) + "deg");
    el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
    el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
  });
  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  });
}

/* ---------------- Estado ---------------- */

let state = null;

function newState(playerCount) {
  return {
    playerCount,
    started: false,
    solo: playerCount === 1,
    reserveL1: playerCount === 4 ? 1 : playerCount === 5 ? 2 : 0,
    pools: { 1: shuffle(monstersByLevel(1)), 2: shuffle(monstersByLevel(2)), 3: shuffle(monstersByLevel(3)) },
    defeated: { 1: [], 2: [], 3: [] },
    locPools: {
      bosque: shuffle(LOCATIONS.bosque),
      montana: shuffle(LOCATIONS.montana),
      agua: shuffle(LOCATIONS.agua),
    },
    active: [],          // [{ name, level, terrain, location, weakLocation }]
    log: [],
  };
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* sin persistencia */ }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && s.started ? s : null;
  } catch (e) { return null; }
}

/* Roba una ficha de monstruo del nivel indicado; si la pila se agota,
   se rebaraja con los monstruos ya retirados de ese nivel (regla de pilas vacías). */
function drawMonster(level) {
  if (state.pools[level].length === 0 && state.defeated[level].length > 0) {
    state.pools[level] = shuffle(state.defeated[level]);
    state.defeated[level] = [];
  }
  return state.pools[level].pop() || null;
}

function drawLocation(terrain, exclude) {
  let pool = state.locPools[terrain].filter((l) => l !== exclude);
  if (pool.length === 0) pool = LOCATIONS[terrain].filter((l) => l !== exclude);
  const loc = pick(pool);
  state.locPools[terrain] = state.locPools[terrain].filter((l) => l !== loc);
  if (state.locPools[terrain].length === 0) {
    state.locPools[terrain] = shuffle(LOCATIONS[terrain]);
  }
  return loc;
}

function spawnAt(terrain, level) {
  const name = drawMonster(level);
  if (!name) return null;
  const location = drawLocation(terrain);
  return {
    name,
    level: MONSTERS_DATA[name].nivel,
    terrain,
    location,
    weakLocation: drawLocation(terrain, location),
  };
}

/* Preparación inicial de los 3 monstruos según el número de jugadores. */
function initialSpawns() {
  const terrains = shuffle(["bosque", "montana", "agua"]);
  let levels;
  if (state.solo) {
    levels = [1, 2, 3]; // Solitario: 1 ficha de cada nivel
  } else if (state.playerCount === 2) {
    levels = [1, 1, 2]; // 2 jugadores: 2 de Nivel I y 1 de Nivel II
  } else {
    levels = [1, 1, 1]; // 3-5 jugadores: 3 de Nivel I
  }
  state.active = terrains.map((t, i) => spawnAt(t, levels[i]));
}

/* ---------------- Navegación ---------------- */

const SCREENS = [
  "screen-inicio", "screen-preparacion", "screen-tablero",
  "screen-monstruo", "screen-resolucion", "screen-brujos", "screen-dagon",
];

function applyShow(id) {
  SCREENS.forEach((s) => $("#" + s).classList.toggle("hidden", s !== id));
  window.scrollTo(0, 0);
}

/* Cambia de pantalla con la View Transitions API si está disponible. */
function show(id) {
  if (!REDUCED_MOTION && document.startViewTransition) {
    document.startViewTransition(() => applyShow(id));
  } else {
    applyShow(id);
  }
}

document.addEventListener("click", (ev) => {
  const goto = ev.target.closest("[data-goto]");
  if (goto) show(goto.dataset.goto);
});

/* ---------------- 1. Pantalla de Inicio ---------------- */

let pendingPlayers = null;

function setupNotes(n) {
  switch (n) {
    case 1: return "Modo en Solitario: se colocarán 3 monstruos, uno de cada Nivel (I, II y III). Derrota a los 3 y obtén el Trofeo de Atributo para ganar.";
    case 2: return "Partida de 2 jugadores: se colocarán 2 monstruos de Nivel I y 1 de Nivel II (el Jugador Inicial elige su Terreno).";
    case 3: return "Partida de 3 jugadores: se colocarán 3 monstruos de Nivel I, uno por cada tipo de Terreno.";
    case 4: return "Partida de 4 jugadores: además de los 3 monstruos de Nivel I, se añadirá 1 ficha de Monstruo de Nivel I a la pila de reserva para la reaparición.";
    case 5: return "Partida de 5 jugadores: además de los 3 monstruos de Nivel I, se añadirán 2 fichas de Monstruo de Nivel I a la pila de reserva para la reaparición.";
  }
  return "";
}

function buildPlayerPicker() {
  const wrap = $("#player-picker");
  wrap.innerHTML = "";
  for (let n = 1; n <= 5; n++) {
    const b = document.createElement("button");
    b.className = "pp-btn";
    b.innerHTML = `<span class="pp-num">${n}</span><span class="pp-lbl">${n === 1 ? "brujo" : "brujos"}</span>`;
    b.addEventListener("click", () => {
      pendingPlayers = n;
      wrap.querySelectorAll(".pp-btn").forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel");
      $("#setup-note").textContent = setupNotes(n);
      $("#btn-continuar").disabled = false;
    });
    wrap.appendChild(b);
  }
}

$("#btn-continuar").addEventListener("click", () => {
  state = newState(pendingPlayers);
  renderPreparacion();
  show("screen-preparacion");
});

/* ---------------- 2. Pantalla de Preparación ---------------- */

function renderPreparacion() {
  const n = state.playerCount;
  $("#prep-sub").textContent = state.solo
    ? "Partida en Solitario — prepara la partida como una de 2/3 jugadores con estos cambios."
    : `Partida de ${n} jugadores — compensaciones según el orden de Turno (Reglamento, pág. 8).`;

  const list = $("#prep-list");
  list.innerHTML = "";
  SETUP_TABLE[n].forEach((p, i) => {
    const li = document.createElement("li");
    li.style.setProperty("--i", i);
    const who = state.solo ? "B" : (i + 1);
    li.innerHTML = `
      <span class="prep-badge">${who}</span>
      <span class="prep-what">
        <strong>${state.solo ? "Brujo solitario" : "Jugador " + (i + 1)}:</strong>
        toma <strong>${p.gold} de Oro</strong> y roba <strong>${p.cards} cartas</strong> de su mazo.
        ${p.note ? `<small>${p.note}</small>` : ""}
      </span>`;
    list.appendChild(li);
  });

  const extras = $("#prep-extras");
  extras.innerHTML = "";
  let extraIdx = 0;
  const addExtra = (html) => {
    const div = document.createElement("div");
    div.className = "prep-extra";
    div.style.setProperty("--i", extraIdx++);
    div.innerHTML = html;
    extras.appendChild(div);
  };

  if (n >= 4) {
    addExtra(`<strong>Pila de reserva:</strong> la app ha apartado <strong>${state.reserveL1} ficha(s) de Monstruo de Nivel I</strong>. Mientras queden, cada Monstruo Derrotado será reemplazado por una de ellas en lugar de uno de Nivel superior.`);
    addExtra(`<strong>Ventaja de entrenamiento:</strong> comenzando por el Jugador 1 y en sentido horario, cada Jugador elige uno de sus Atributos y <strong>sube 1 su nivel</strong>.`);
  }
  if (n === 2) {
    addExtra(`<strong>Monstruos:</strong> se roban 2 fichas de Nivel I y 1 de Nivel II. El Jugador Inicial elige el Terreno del Monstruo de Nivel II (la app lo asigna al azar: cambiadlo en la mesa si preferís otro).`);
  }
  if (state.solo) {
    addExtra(`<strong>Trofeos de Atributo:</strong> baraja un set (uno de cada tipo), roba 1 al azar y colócalo bocarriba junto al tablero. Es uno de los 4 Trofeos que necesitas para ganar (y no puede ser el último).`);
    addExtra(`<strong>Ataques del Monstruo:</strong> en cada Turno del Monstruo, tira un dado — con 1-3 usa Embestida, con 4-6 usa Mordisco.`);
  }
}

$("#btn-iniciar-caceria").addEventListener("click", () => {
  initialSpawns();
  state.started = true;
  save();
  renderTablero();
  show("screen-tablero");
});

/* ---------------- 3. Tablero Principal ---------------- */

function renderTablero() {
  const wrap = $("#board-cards");
  wrap.innerHTML = "";
  state.active.forEach((m, idx) => {
    const t = TERRAINS[m.terrain];
    const d = MONSTERS_DATA[m.name];
    const img = cardImage(m.name);
    const card = document.createElement("button");
    card.className = "mcard";
    card.style.setProperty("--tcolor", t.color);
    card.style.setProperty("--i", idx);
    const artUrl = img || TERRAIN_IMG[m.terrain];
    card.innerHTML = `
      <span class="mcard-level">Nivel ${roman(m.level)}</span>
      <span class="mcard-art${img ? "" : " is-emblema"}" style="--art:url('${artUrl}')"></span>
      <span class="mcard-body">
        <span class="mcard-terrain">${t.icon} ${t.label}</span>
        <span class="mcard-name">${m.name}</span>
        <span class="mcard-type">${d.tipo} · Vida ${d.vida}</span>
        <ul class="mcard-stats">
          <li><span class="k">Localización activa</span><span class="v">${m.location}</span></li>
          <li><span class="k">Localización de debilidad</span><span class="v weak">${m.weakLocation}</span></li>
        </ul>
        <span class="mcard-cta">Rastrear y combatir →</span>
      </span>
      <span class="mcard-glare"></span>`;
    card.addEventListener("click", () => openMonster(idx));
    attachTilt(card, 5);
    wrap.appendChild(card);
  });

  const reserveTxt = state.reserveL1 > 0 ? ` · Reserva de Nivel I: ${state.reserveL1} ficha(s)` : "";
  const modeTxt = state.solo ? "Modo en Solitario" : `${state.playerCount} jugadores`;
  $("#board-status").textContent = `${modeTxt}${reserveTxt}`;
}

$("#btn-reset").addEventListener("click", () => {
  if (confirm("¿Terminar esta partida y empezar una nueva? Se perderá el estado del tablero.")) {
    localStorage.removeItem(STORAGE_KEY);
    state = null;
    pendingPlayers = null;
    $("#btn-continuar").disabled = true;
    $("#setup-note").textContent = "";
    buildPlayerPicker();
    show("screen-inicio");
  }
});

/* ---------------- 4. Evento de Monstruo (Cacería) ---------------- */

let currentIdx = null;

function openMonster(idx) {
  currentIdx = idx;
  const m = state.active[idx];
  const d = MONSTERS_DATA[m.name];
  const t = TERRAINS[m.terrain];

  const stage = $("#monster-stage");
  stage.style.setProperty("--tcolor", t.color);

  const img = cardImage(m.name);
  const backdrop = img || TERRAIN_IMG[m.terrain];
  stage.querySelector(".stage-backdrop").style.setProperty("--m-img", `url('${backdrop}')`);

  const fig = $("#m-card-float");
  if (img) {
    fig.classList.remove("sin-carta");
    $("#m-card-img").src = img;
    $("#m-card-img").alt = "Carta de " + m.name;
  } else {
    fig.classList.add("sin-carta");
  }

  $("#m-terrain").textContent = `${t.icon} ${t.label} · ${m.location}`;
  $("#m-name").textContent = m.name;
  $("#m-meta").textContent = `${d.tipo} · Nivel ${roman(m.level)} · Reserva de Vida: ${d.vida} · Debilidad: ${m.weakLocation}`;
  $("#m-narrativa").textContent = loreFor(m.name);
  $("#m-habilidad").textContent = d.habilidad;

  $("#decision-result").classList.add("hidden");
  $("#combat-actions").classList.add("hidden");
  $("#btn-decision").classList.remove("hidden");
  show("screen-monstruo");
}

function rollDecision() {
  const m = state.active[currentIdx];
  const d = MONSTERS_DATA[m.name];
  const kind = pick(["buena", "mala", "estandar"]);
  const pool = { buena: d.buenas, mala: d.malas, estandar: d.estandar }[kind] || [];
  const texto = pool.length ? pick(pool) : "Avanzas hacia la bestia con la plata desenvainada.";
  const efecto = pick(DECISION_EFFECTS[kind]);
  const k = DECISION_KINDS[kind];

  const box = $("#decision-result");
  // reinicia la animación de revelado
  box.classList.add("hidden");
  void box.offsetWidth;
  box.style.setProperty("--dcolor", k.color);
  $("#d-tag").textContent = k.tag;
  $("#d-texto").textContent = "«" + texto + "»";
  $("#d-efecto").innerHTML = efecto;
  box.classList.remove("hidden");
  $("#btn-decision").classList.add("hidden");
  $("#combat-actions").classList.remove("hidden");
}

$("#btn-decision").addEventListener("click", rollDecision);
$("#btn-redecision").addEventListener("click", rollDecision);

/* ---------------- 5/6. Resoluciones ---------------- */

function fatigueReminder() {
  return "Sufre <strong>Fatiga</strong>: destruye tantas Cartas de Acción (de tu mazo, mano o descartes) como indique tu posición actual en el Marcador de Trofeo.";
}

function commonEnd() {
  return [
    "Baraja todas las Cartas de Combate de Monstruo para formar un nuevo mazo.",
    "Baraja tu mazo, pila de descartes y mano para formar un nuevo mazo, y sube tu Escudo hasta tu nivel de Defensa.",
  ];
}

function resolveVictory() {
  const m = state.active[currentIdx];
  const steps = [
    "Toma la <strong>Carta de Monstruo</strong> y desliza su Trofeo bajo tu Tablero de Jugador (habilidad visible).",
    "Ganas <strong>2 de Oro</strong>.",
    "Voltea la carta y lee en voz alta su <strong>descripción de Combate</strong>.",
    "Avanza <strong>1 espacio en el Marcador de Trofeo</strong> — si alcanzas el último espacio, ¡ganas la partida!",
    fatigueReminder(),
    ...commonEnd(),
    "Procede a la <strong>Fase III</strong> de tu Turno.",
  ];

  state.defeated[m.level].push(m.name);

  let spawnHtml = null;
  if (state.solo) {
    state.active.splice(currentIdx, 1);
    spawnHtml = `<p class="sp-label">Modo en Solitario</p>
      <p class="sp-meta">No aparece ningún monstruo nuevo. Quedan ${state.active.length} bestia(s) por derrotar.</p>`;
  } else {
    let newLevel;
    let fromReserve = false;
    if (state.reserveL1 > 0) {
      newLevel = 1;
      state.reserveL1--;
      fromReserve = true;
    } else {
      newLevel = Math.min(m.level + 1, 3);
    }
    const nm = spawnAt(m.terrain, newLevel);
    if (nm) {
      state.active[currentIdx] = nm;
      const t = TERRAINS[nm.terrain];
      spawnHtml = `<p class="sp-label">${fromReserve ? "Reaparición desde la pila de reserva" : "Un nuevo horror ocupa su lugar"}</p>
        <p class="sp-name">${nm.name} — Nivel ${roman(nm.level)}</p>
        <p class="sp-meta">${t.icon} ${t.label} · aparece en <strong>${nm.location}</strong> · debilidad: ${nm.weakLocation}</p>`;
    } else {
      state.active.splice(currentIdx, 1);
      spawnHtml = `<p class="sp-label">Las pilas están vacías</p><p class="sp-meta">No quedan fichas de Monstruo disponibles de ese nivel.</p>`;
    }
  }

  showResolution({
    title: "⚔ La bestia ha caído",
    sub: "El contrato está cumplido. Cobra tu recompensa, brujo.",
    steps,
    spawnHtml,
    terrainColor: TERRAINS[m.terrain].color,
  });
}

function resolveFlee() {
  const m = state.active[currentIdx];
  const oldLoc = m.location;
  // Diseño de la app: el monstruo huye a su Localización de Debilidad y sana por completo.
  m.location = m.weakLocation;
  m.weakLocation = drawLocation(m.terrain, m.location);

  const steps = [
    "Ganas <strong>2 de Oro</strong> por ahuyentar a la bestia.",
    "Añade una <strong>Carta de Acción de coste 0</strong> a tu pila de descartes.",
    `El monstruo escapa de <strong>${oldLoc}</strong> hacia su Localización de Debilidad: <strong>${m.location}</strong>.`,
    "La bestia descansa y <strong>se cura por completo</strong>: el próximo brujo la encontrará con la Reserva de Vida llena (nueva debilidad: <strong>" + m.weakLocation + "</strong>).",
    ...commonEnd(),
    "Procede a la <strong>Fase III</strong> de tu Turno.",
  ];

  showResolution({
    title: "🌫 El monstruo huyó del combate",
    sub: "Noqueado, pero la bestia quedó al borde de la muerte (0-1 cartas en su Reserva de Vida).",
    steps,
    spawnHtml: null,
    terrainColor: TERRAINS[m.terrain].color,
  });
}

function resolveDefeat() {
  const m = state.active[currentIdx];
  const t = TERRAINS[m.terrain];
  const steps = [
    `Toma 1 <strong>Ficha de Rastro</strong> de Terreno ${t.icon} ${t.label} (si aún no la tienes): la próxima vez tomarás el primer Turno contra esta bestia.`,
    "Añade una <strong>Carta de Acción de coste 0</strong> a tu pila de descartes.",
    "Solo durante este Turno: en la <strong>Fase III robas un máximo de 2 cartas</strong>.",
    `El monstruo permanece en <strong>${m.location}</strong> y se curará por completo antes del próximo Combate.`,
    ...commonEnd(),
    "Tu Turno termina. Lámete las heridas, brujo: la bestia seguirá ahí mañana.",
  ];

  showResolution({
    title: "☠ La bestia te venció",
    sub: "Derrota Absoluta: fuiste Noqueado y el monstruo conservó 2 o más cartas de Vida.",
    steps,
    spawnHtml: null,
    terrainColor: TERRAINS[m.terrain].color,
    grim: true,
  });
}

function showResolution({ title, sub, steps, spawnHtml, terrainColor, grim }) {
  $("#res-title").textContent = title;
  $("#res-sub").textContent = sub;
  const ul = $("#res-steps");
  ul.innerHTML = "";
  steps.forEach((s, i) => {
    const li = document.createElement("li");
    li.style.setProperty("--i", i);
    if (grim) li.classList.add("bad");
    li.innerHTML = s;
    ul.appendChild(li);
  });
  const sp = $("#res-spawn");
  if (spawnHtml) {
    sp.style.setProperty("--tcolor", terrainColor || "var(--amber)");
    sp.innerHTML = spawnHtml;
    sp.classList.remove("hidden");
  } else {
    sp.classList.add("hidden");
  }
  save();
  show("screen-resolucion");
}

$("#btn-victoria").addEventListener("click", resolveVictory);
$("#btn-huida").addEventListener("click", resolveFlee);
$("#btn-derrota").addEventListener("click", resolveDefeat);
$("#btn-res-volver").addEventListener("click", () => {
  renderTablero();
  show("screen-tablero");
});

/* ---------------- Lucha Entre Brujos ---------------- */

function renderBrujos() {
  const list = $("#apuestas-list");
  const twoP = state && state.playerCount === 2;
  list.innerHTML = "";
  const items = twoP
    ? ["En partidas de <strong>2 jugadores no se pueden realizar Apuestas</strong>. Pasad directamente al Combate."]
    : [
        "Antes del Combate, los demás Jugadores pueden <strong>apostar (opcionalmente) hasta 1 de Oro</strong> cada uno.",
        "Las Apuestas se hacen <strong>contra la banca</strong>, no contra los otros brujos.",
        "No hace falta estar en la Localización del Combate para apostar.",
        "Ambos combatientes barajan sus descartes con sus mazos (conservando su mano). El <strong>Jugador Activo toma el primer Turno</strong>.",
      ];
  items.forEach((html) => {
    const li = document.createElement("li");
    li.innerHTML = html;
    list.appendChild(li);
  });
  $("#brujos-result").classList.add("hidden");
  $("#brujos-pick").classList.remove("hidden");
}

function brujosOutcome(attackerWon) {
  $("#brujos-pick").classList.add("hidden");
  const res = $("#brujos-result");
  res.classList.remove("hidden");

  const winList = $("#bw-list");
  const loseList = $("#bl-list");
  winList.innerHTML = "";
  loseList.innerHTML = "";

  if (attackerWon) {
    $("#bw-title").textContent = "⚔ Vencedor: Brujo Atacante";
    $("#bl-title").textContent = "Brujo Defensor";
    [
      "Toma 1 <strong>Trofeo de Brujo</strong> de la Escuela derrotada (si aún no lo tienes: máximo 1 por Escuela).",
      "Lee su descripción de Combate y <strong>avanza 1 en el Marcador de Trofeo</strong>.",
      fatigueReminder(),
      "Gana <strong>Oro según la Reputación del oponente</strong> (1, 2 o 3, indicado junto a su posición en el Marcador de Trofeo).",
      "Procede a la Fase III con normalidad (roba hasta 3 cartas).",
    ].forEach((h) => { const li = document.createElement("li"); li.innerHTML = h; winList.appendChild(li); });
    [
      "Añade una <strong>Carta de Acción de coste 0</strong> a tu pila de descartes.",
      "Baraja tu mazo y <strong>roba 3 cartas</strong> inmediatamente.",
      "No pierdes ninguno de tus Trofeos.",
    ].forEach((h) => { const li = document.createElement("li"); li.innerHTML = h; loseList.appendChild(li); });
  } else {
    $("#bw-title").textContent = "🛡 Vencedor: Brujo Defensor";
    $("#bl-title").textContent = "Brujo Atacante";
    [
      "Gana <strong>Oro según la Reputación del oponente</strong> (1, 2 o 3 del Marcador de Trofeo).",
      "<strong>No obtiene Trofeo</strong> (solo el atacante puede ganarlo).",
      "Baraja su mazo y <strong>roba 4 cartas</strong> inmediatamente.",
    ].forEach((h) => { const li = document.createElement("li"); li.innerHTML = h; winList.appendChild(li); });
    [
      "Añade una <strong>Carta de Acción de coste 0</strong> a tu pila de descartes.",
      "En la <strong>Fase III solo robas 2 cartas</strong> (en vez de 3) durante este Turno.",
    ].forEach((h) => { const li = document.createElement("li"); li.innerHTML = h; loseList.appendChild(li); });
  }
}

$("#btn-brujos").addEventListener("click", () => { renderBrujos(); show("screen-brujos"); });
$("#btn-gana-atacante").addEventListener("click", () => brujosOutcome(true));
$("#btn-gana-defensor").addEventListener("click", () => brujosOutcome(false));
$("#btn-brujos-otra").addEventListener("click", renderBrujos);

/* ---------------- Lucha contra Dagon (Skellige) ---------------- */

function renderDagon() {
  $("#dagon-result").classList.add("hidden");
  $("#dagon-pick").classList.remove("hidden");
}

function dagonOutcome(drivenAway) {
  $("#dagon-pick").classList.add("hidden");
  const res = $("#dagon-result");
  res.classList.remove("hidden");
  const ul = $("#dg-list");
  ul.innerHTML = "";

  let items;
  if (drivenAway) {
    $("#dg-title").textContent = "🌊 Dagon fue ahuyentado";
    items = [
      "Se cumple si <strong>ganaste el Combate</strong> o si fuiste derrotado pero Dagon quedó con <strong>0 o 1 cartas</strong> en su Reserva de Vida.",
      "Mueve la <strong>miniatura de Dagon</strong> a la casilla del Medidor de Peligro que corresponda al número de jugadores de tu partida.",
      "Ganas <strong>2 de Oro</strong>.",
      "Elige <strong>1 Carta de Acción de coste 0</strong> cualquiera de las 6 disponibles y añádela a tu pila de descartes.",
      "Toma la <strong>carta superior del mazo de Bonus de Dagon</strong> y colócala junto a tus Trofeos.",
      "<strong>No avanzas en el Marcador de Trofeo</strong> y <strong>no sufres Fatiga</strong>.",
      "Procede a la <strong>Fase III</strong> de tu Turno.",
    ];
  } else {
    $("#dg-title").textContent = "☠ Derrota Total";
    items = [
      "Te quedaste <strong>sin cartas</strong> y Dagon conservó <strong>2 o más</strong> en su Reserva de Vida.",
      "Dagon <strong>permanece emergido</strong> en su Localización del Medidor de Peligro: las aguas siguen siendo suyas.",
      "Toma la <strong>Ficha de Rastro de Dagon</strong> (si aún no la tienes).",
      "Elige <strong>1 Carta de Acción de coste 0</strong> cualquiera de las 6 disponibles y añádela a tu pila de descartes.",
      "Durante la <strong>Fase III de este Turno robas 1 carta menos</strong>.",
    ];
  }
  items.forEach((h, i) => {
    const li = document.createElement("li");
    li.style.setProperty("--i", i);
    if (!drivenAway) li.classList.add("bad");
    li.innerHTML = h;
    ul.appendChild(li);
  });
}

$("#btn-dagon").addEventListener("click", () => { renderDagon(); show("screen-dagon"); });
$("#btn-dagon-ahuyentado").addEventListener("click", () => dagonOutcome(true));
$("#btn-dagon-derrota").addEventListener("click", () => dagonOutcome(false));
$("#btn-dagon-otra").addEventListener("click", renderDagon);

/* ---------------- Arranque ---------------- */

function boot() {
  buildPlayerPicker();
  attachTilt($("#m-card-float"), 9);
  const saved = load();
  if (saved) {
    state = saved;
    renderTablero();
    applyShow("screen-tablero");
  } else {
    applyShow("screen-inicio");
  }
}

boot();

/* Registro del Service Worker (uso sin conexión, app instalable). */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => { /* sin offline */ });
  });
}
