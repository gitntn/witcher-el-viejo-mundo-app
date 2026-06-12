/* Mapa de imágenes de la app.
   Las cartas provienen de fotos propias del juego, recortadas automáticamente.
   "Trol" aún no tiene foto: usa el emblema de su terreno como respaldo. */

const CARD_SLUGS = {
  "Arachas": "arachas",
  "Arpía": "arpia",
  "Arquespor": "arquespor",
  "Barghest": "barghest",
  "Boira": "boira",
  "Demonio Podrido": "demonio-podrido",
  "Ekimmara": "ekimmara",
  "Nido de Ghuls": "nido-de-ghuls",
  "Nido de Nekkers": "nido-de-nekkers",
  "Nido de Sumergidos": "nido-de-sumergidos",
  "Aparición Nocturna": "aparicion-nocturna",
  "Bruja del Agua": "bruja-del-agua",
  "Bruja Sepulcral": "bruja-sepulcral",
  "Dama del Mediodía": "dama-del-mediodia",
  "Demonibestia": "demonibestia",
  "Grifo": "grifo",
  "Hombre Lobo": "hombre-lobo",
  "Manticora": "manticora",
  "Penitente": "penitente",
  "Susurradora": "susurradora",
  "Tejedora": "tejedora",
  "Wyverno": "wyverno",
  "Babagor": "babagor",
  "Estrige": "estrige",
  "Guisadora": "guisadora",
  "Lamia": "lamia",
  "Leshen": "leshen",
  "Yghern": "yghern",
  // "Trol": pendiente — añade la foto a Drive y créala como assets/img/cartas/trol.jpg
};

function cardImage(name) {
  const slug = CARD_SLUGS[name];
  return slug ? `assets/img/cartas/${slug}.jpg` : null;
}

const TERRAIN_IMG = {
  bosque: "assets/img/terrenos/bosque.jpg",
  montana: "assets/img/terrenos/montana.jpg",
  agua: "assets/img/terrenos/agua.jpg",
};

const COVER_IMG = "assets/img/portada.jpg";
