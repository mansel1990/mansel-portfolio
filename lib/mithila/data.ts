// ============================================================
// THE LONG WALK HOME — all editable content lives here.
// Sanjay: tweak land names, plaque lines, riddle wording,
// captions, two-truths statements, and the finale letter freely.
// ============================================================

export type RiddlePuzzle = {
  type: "riddle";
  badge: "wife" | "mom" | "both";
  prompt: string;
  answers: string[];
  hints: [string, string];
};

export type SongGuessPuzzle = {
  type: "song-guess";
  options: string[];
  correctIndex: number;
  hint: string;
};

export type JigsawPuzzle = { type: "jigsaw"; photo: string };

export type ZoomPlacePuzzle = {
  type: "zoom-place";
  photo: string;
  answers: string[]; // empty = cinematic reveal + confirm button
  prompt: string;
};

export type BlockPuzzle = { type: "block-puzzle" };

export type TwoTruthsPuzzle = {
  type: "two-truths";
  statements: [string, string, string];
  fakeIndex: number;
};

export type Puzzle =
  | RiddlePuzzle
  | SongGuessPuzzle
  | JigsawPuzzle
  | ZoomPlacePuzzle
  | BlockPuzzle
  | TwoTruthsPuzzle;

export type Land = {
  id: string;
  index: number;
  title: string;
  years: string;
  places: string[];
  intro: string;
  gateName: string; // shown on the locked gate
  // theme palette (time of day moves dawn -> night across lands)
  sky: string;
  ground: string;
  accent: string;
  fog: string;
  puzzle: Puzzle | null; // null = gate open (tutorial land)
  photos: { src: string; caption?: string }[];
  song: { src: string; title: string }; // used by song-guess snippets
  plaques: string[]; // tappable prop lines — sneak inside jokes in here
};

const P = "/mithila/photos/";
const A = "/mithila/audio/";

// ---------- the entry gate ----------
export const gate = {
  prompt:
    "Every great story starts with a small lie.\nYours bought a ticket, packed a bag,\nand landed in a city that was waiting to meet its future.\n\nWhich city heard your first lie?",
  contains: "hyd",
  wrong: [
    "The road doesn't recognize you… yet.",
    "Hmm. The city shakes its head.",
    "Close your eyes. Remember the excuse. Now the city.",
  ],
};

// ---------- the ten lands ----------
export const lands: Land[] = [
  {
    id: "first-city",
    index: 0,
    title: "The First City",
    years: "2012 – 2014",
    places: ["Where it all began"],
    intro: "Before everything, two strangers and one sunrise.",
    gateName: "City Arch",
    sky: "#ffb98a",
    ground: "#8a6f5c",
    accent: "#ff8f66",
    fog: "#ffd9b8",
    puzzle: null, // tutorial land — the arch stands open
    photos: [{ src: P + "IMG_20141213_222149.webp" }],
    song: { src: A + "ch01.mp3", title: "Hey There Delilah" },
    plaques: [
      "This bus stop has watched a thousand hellos.",
      "Two bicycles, parked a little too close together.",
      "The chai here was never the point.",
    ],
  },
  {
    id: "bridge-of-two",
    index: 1,
    title: "The Bridge of Two",
    years: "2015",
    places: ["Two lives, one direction"],
    intro: "The year two roads quietly became one bridge.",
    gateName: "The Drawbridge",
    sky: "#ffd27a",
    ground: "#7d8a5c",
    accent: "#5cb8a8",
    fog: "#ffe9b8",
    puzzle: {
      type: "riddle",
      badge: "wife",
      prompt:
        "I belong to two people equally.\nSomehow, one of them gets 90% of me\nevery single night.\nWhat am I?",
      answers: ["blanket", "the blanket", "bedsheet", "duvet", "comforter", "quilt", "poduva"],
      hints: ["It's a nightly battle.", "One of you wakes up cold. It isn't you."],
    },
    photos: [
      { src: P + "IMG_20150124_225459.webp" },
      { src: P + "IMG_20150329_175107.webp" },
      { src: P + "IMG_20150614_220813.webp" },
    ],
    song: { src: A + "ch02.mp3", title: "Lonely — Akon" },
    plaques: [
      "Paper boats carry small promises downstream.",
      "A bench built for exactly two people.",
      "Lanterns lean in to listen.",
    ],
  },
  {
    id: "wedding-ghat",
    index: 2,
    title: "Wedding Ghat",
    years: "2016",
    places: ["Chennai"],
    intro: "Some promises are so big they need their own temple.",
    gateName: "Temple Doors",
    sky: "#ffe9a8",
    ground: "#a8845c",
    accent: "#e8483f",
    fog: "#fff3cc",
    puzzle: { type: "jigsaw", photo: P + "mithila-chennai-20160530.webp" },
    photos: [
      { src: P + "mithila-chennai-20160530.webp", caption: "Chennai" },
      { src: P + "IMG-20160401-WA0010.webp" },
      { src: P + "IMG_20160903_150654.webp" },
      { src: P + "IMG_20161116_175715.webp" },
      { src: P + "IMG_20161118_182425.webp" },
      { src: P + "IMG_20161203_103940.webp" },
    ],
    song: { src: A + "ch03.mp3", title: "Nothing Else Matters" },
    plaques: [
      "The marigolds remember the exact shade of that morning.",
      "These drums still keep the beat of that day.",
      "An oil lamp never really goes out.",
    ],
  },
  {
    id: "little-house",
    index: 3,
    title: "The Little House",
    years: "2017",
    places: ["Home"],
    intro: "Four walls, two people, infinite adjustments.",
    gateName: "Garden Gate",
    sky: "#a8d8ff",
    ground: "#6f9a5c",
    accent: "#f0b866",
    fog: "#d8ecff",
    puzzle: {
      type: "riddle",
      badge: "wife",
      prompt:
        "No matter what the map app says,\nno matter what the recipe says,\nno matter what he remembers —\nthe husband is always this.",
      answers: ["wrong", "always wrong", "incorrect", "mistaken"],
      hints: ["A one-word universal truth of marriage.", "The opposite of what he thinks he is."],
    },
    photos: [
      { src: P + "IMG_20170414_165807.webp" },
      { src: P + "IMG_20170416_095126.webp" },
      { src: P + "IMG_20170528_192310.webp" },
      { src: P + "IMG_20170723_164205.webp" },
      { src: P + "IMG_20170820_220616.webp" },
    ],
    song: { src: A + "ch04.mp3", title: "Aicha — Outlandish" },
    plaques: [
      "The clothesline knows all the laundry arguments.",
      "This cat approves of exactly one household.",
      "Warm windows are a love language.",
    ],
  },
  {
    id: "golden-fields",
    index: 4,
    title: "Golden Fields",
    years: "2018",
    places: ["Sunlit days"],
    intro: "The unhurried year. The one you'd bottle if you could.",
    gateName: "Wooden Stile",
    sky: "#ffc46b",
    ground: "#c9a44f",
    accent: "#ff9a3f",
    fog: "#ffe0a8",
    puzzle: {
      type: "song-guess",
      options: ["Someday — Flipside", "Numb — Linkin Park", "Boulevard of Broken Dreams", "In the End — Linkin Park"],
      correctIndex: 0,
      hint: "The title is a promise about the future.",
    },
    photos: [
      { src: P + "IMG_20180428_153453.webp" },
      { src: P + "IMG_20180428_204334.webp" },
      { src: P + "IMG_20180506_150128.webp" },
    ],
    song: { src: A + "ch05.mp3", title: "Someday — Flipside" },
    plaques: [
      "The radio on this fence only plays your songs.",
      "A kite is just a promise with string attached.",
      "Fireflies: tiny stars practicing.",
    ],
  },
  {
    id: "quiet-valley",
    index: 5,
    title: "The Quiet Valley",
    years: "2019 – 2022",
    places: ["Home", "11 · 11 · 2021"],
    intro: "The world went quiet. Then, one November, it got beautifully loud.",
    gateName: "Nursery Door",
    sky: "#7a8ecc",
    ground: "#5c6f8a",
    accent: "#b8c8ff",
    fog: "#9aa8d8",
    puzzle: {
      type: "riddle",
      badge: "mom",
      prompt:
        "I am the only alarm clock\nthat works before sunrise,\nhas no snooze button,\nand is somehow adorable.\nWhat am I?",
      answers: ["baby", "the baby", "rudra", "my baby", "kid", "daughter", "my daughter"],
      hints: ["Arrived 11/11.", "You named this alarm clock Rudra."],
    },
    photos: [{ src: P + "IMG_20221016_100520.webp", caption: "And then there were three" }],
    song: { src: A + "ch06.mp3", title: "Knockin' on Heaven's Door" },
    plaques: [
      "A calendar frozen on the best date: 11 · 11.",
      "Tiny shoes. Enormous change.",
      "Moonflowers only bloom for night-feeds.",
    ],
  },
  {
    id: "bloom-gardens",
    index: 6,
    title: "Bloom Gardens",
    years: "2023",
    places: ["Everywhere, together"],
    intro: "This gate is guarded by an actual puzzle. Sorry. (Not sorry.)",
    gateName: "The Puzzle Vault",
    sky: "#5c6fb8",
    ground: "#4f7a5c",
    accent: "#e8788a",
    fog: "#7a8ecc",
    puzzle: { type: "block-puzzle" },
    photos: [
      { src: P + "IMG_20230807_201839956.webp" },
      { src: P + "IMG_20230810_174442615.webp" },
      { src: P + "IMG_20230813_200601883.webp" },
      { src: P + "IMG_20230923_191635958.webp" },
      { src: P + "IMG_20230924_133810635.webp" },
      { src: P + "IMG_20231021_124355292-EFFECTS.webp" },
      { src: P + "IMG_20231028_173854744.webp" },
      { src: P + "IMG_20231111_182545843.webp" },
      { src: P + "IMG_20231227_133620616.webp" },
      { src: P + "IMG_20231229_143212145.webp" },
    ],
    song: { src: A + "ch07.mp3", title: "Numb — Linkin Park" },
    plaques: [
      "Every flower here opened the moment you did.",
      "The swing remembers being the best seat in the garden.",
      "Fountains: rivers that decided to dance instead.",
    ],
  },
  {
    id: "airport-of-us",
    index: 7,
    title: "The Airport of Us",
    years: "2024",
    places: ["The travel year"],
    intro: "Sixteen photos. One very full year.",
    gateName: "Departure Gate",
    sky: "#3f4a8a",
    ground: "#4a4f6b",
    accent: "#66c8f0",
    fog: "#5c6fb8",
    puzzle: {
      type: "zoom-place",
      photo: P + "IMG_20240823_163822911.webp",
      answers: [],
      prompt: "The departure board shows a vision… where is this?",
    },
    photos: [
      { src: P + "IMG_20240108_180545047.webp" },
      { src: P + "IMG_20240108_182933496.webp" },
      { src: P + "IMG_20240330_163530041.webp" },
      { src: P + "IMG_20240413_154000513.webp" },
      { src: P + "IMG_20240420_123049103.webp" },
      { src: P + "IMG_20240428_164315330.webp" },
      { src: P + "IMG_20240509_131125757.webp" },
      { src: P + "IMG_20240510_124659302.webp" },
      { src: P + "IMG_20240627_120242546.webp" },
      { src: P + "IMG_20240702_191731749.webp" },
      { src: P + "IMG_20240724_191840023.webp" },
      { src: P + "IMG_20240823_163822911.webp" },
      { src: P + "IMG_20240825_140957443.webp" },
      { src: P + "IMG_20240915_120515302.webp" },
      { src: P + "IMG_20240916_093118390.webp" },
      { src: P + "IMG_20241214_200911609.webp" },
    ],
    song: { src: A + "ch08.mp3", title: "Love the Way You Lie" },
    plaques: [
      "Every plane here has flown exactly one route: together.",
      "The luggage carousel returns everything except time.",
      "Postcards: photos that learned to travel alone.",
    ],
  },
  {
    id: "yesterday-lane",
    index: 8,
    title: "Yesterday Lane",
    years: "2025",
    places: ["So close you can still hear it"],
    intro: "Three memories. One of them never happened.",
    gateName: "Photo-Booth Curtain",
    sky: "#2a3163",
    ground: "#3f4463",
    accent: "#f0b866",
    fog: "#3f4a8a",
    puzzle: {
      type: "two-truths",
      statements: [
        "We watched a sunset and stayed until the streetlights came on.",
        "We adopted a llama and named him Kevin.",
        "We ate far too much at a celebration and regretted nothing.",
      ],
      fakeIndex: 1,
    },
    photos: [
      { src: P + "IMG_20250105_210640278.webp" },
      { src: P + "IMG_20250223_164030878.webp" },
      { src: P + "IMG_20250328_195640998.webp" },
      { src: P + "IMG_20250710_183321586.webp" },
      { src: P + "IMG_20250725_215537525.webp", caption: "Birthday girl, 2025 edition" },
      { src: P + "IMG_20250817_210758245.webp" },
      { src: P + "IMG20251011221158.webp" },
      { src: P + "IMG20251020172456.webp" },
      { src: P + "IMG20251020191730_BURST009.webp" },
      { src: P + "IMG20251206200800.webp" },
      { src: P + "IMG20251206204057.webp" },
      { src: P + "IMG20251228093808.webp" },
    ],
    song: { src: A + "ch09.mp3", title: "Boulevard of Broken Dreams (Strings)" },
    plaques: [
      "This café keeps two cups warm, always.",
      "The clock here runs backwards. Nobody minds.",
      "Frames hold light long after the moment leaves.",
    ],
  },
  {
    id: "birthday-city",
    index: 9,
    title: "Birthday City",
    years: "2026",
    places: ["Right here", "Right now"],
    intro: "The last gate. One more answer and the city is yours.",
    gateName: "The Golden Doors",
    sky: "#12142e",
    ground: "#2a2f4f",
    accent: "#f0b866",
    fog: "#1a1e3f",
    puzzle: {
      type: "riddle",
      badge: "both",
      prompt:
        "Once a year I arrive with fire on my head,\nI make everyone sing off-key,\nand this year I brought you 36 reasons to smile.\nWhat am I?",
      answers: ["birthday", "happy birthday", "birthday cake", "cake", "36", "thirty six", "thirtysix", "your birthday"],
      hints: ["Fire on my head = candles.", "It's today. Well… it's the whole point of all this."],
    },
    photos: [
      { src: P + "IMG20260124183005.webp" },
      { src: P + "IMG20260125192018.webp" },
      { src: P + "IMG20260217190135.webp" },
      { src: P + "IMG20260328124744.webp" },
      { src: P + "IMG20260427085549_03.webp" },
      { src: P + "IMG20260427132044.webp" },
      { src: P + "IMG20260427181303.webp" },
      { src: P + "IMG20260428141117.webp" },
      { src: P + "IMG20260429193009.webp" },
      { src: P + "IMG20260430160022.webp" },
      { src: P + "IMG20260430160132.webp" },
    ],
    song: { src: A + "ch10.mp3", title: "Smack That — Akon" },
    plaques: [
      "36 lanterns, waiting for one specific person.",
      "The gift boxes are empty. The city is the gift.",
      "This stage has a mic. The city wants a speech.",
    ],
  },
];

// ---------- block puzzle (gate 7) — BFS-verified, 27 moves minimum ----------
export const blockPuzzleConfig: { r: number; c: number; l: number; o: "H" | "V" }[] = [
  { r: 2, c: 0, l: 2, o: "H" }, // hero
  { r: 1, c: 5, l: 3, o: "V" },
  { r: 5, c: 3, l: 2, o: "H" },
  { r: 2, c: 2, l: 3, o: "V" },
  { r: 0, c: 3, l: 2, o: "H" },
  { r: 0, c: 0, l: 2, o: "H" },
  { r: 1, c: 3, l: 3, o: "V" },
  { r: 4, c: 4, l: 2, o: "H" },
  { r: 4, c: 0, l: 2, o: "V" },
];

// ---------- finale ----------
export const finale = {
  name: "MITHILA",
  age: 36,
  birthday: "25 · 07 · 2026",
  song: { src: A + "finale.mp3", title: "Good Riddance (Time of Your Life) — Green Day" },
  // SANJAY: replace with your real letter. One string per line; "" = blank line.
  letter: [
    "Dear Mithila,",
    "",
    "(Sanjay — your letter goes here.)",
    "(Edit lib/mithila/data.ts → finale.letter)",
    "",
    "Happy 36th birthday.",
    "— S",
  ],
  // shown in Birthday City if she collects all 36 sparks
  sparkSecret: "(Sanjay: secret message for collecting all 36 sparks — edit me!)",
};

export const medleySrc = A + "medley.mp3";
export const TOTAL_SPARKS = 36;
