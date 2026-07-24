// ============================================================
// THE LONG WALK HOME — all editable content lives here.
// Gate trials are photo + music games only (see docs/mithila/SHIP.md).
// ============================================================

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

/** Match the right half of a photo to complete the memory (mobile-friendly). */
export type TwoHalvesPuzzle = {
  type: "two-halves";
  photo: string;
  /** wrong right-half options */
  decoys: string[];
};

export type MemoryFlipPuzzle = {
  type: "memory-flip";
  /** photo srcs — each appears twice on the board */
  photos: string[];
};

export type WhichEraPuzzle = {
  type: "which-era";
  options: { label: string; sub: string }[];
  correctIndex: number;
};

export type StripShufflePuzzle = {
  type: "strip-shuffle";
  photo: string;
  /** number of horizontal strips */
  strips: number;
};

export type OddOneOutPuzzle = {
  type: "odd-one-out";
  photos: string[];
  oddIndex: number;
  prompt: string;
};

export type MedleyScrubPuzzle = {
  type: "medley-scrub";
  /** seconds into medley.mp3 to start */
  startSec: number;
  /** snippet length */
  durationSec: number;
  options: string[];
  correctIndex: number;
  hint: string;
};

export type Puzzle =
  | SongGuessPuzzle
  | JigsawPuzzle
  | ZoomPlacePuzzle
  | TwoHalvesPuzzle
  | MemoryFlipPuzzle
  | WhichEraPuzzle
  | StripShufflePuzzle
  | OddOneOutPuzzle
  | MedleyScrubPuzzle;

export type Land = {
  id: string;
  index: number;
  title: string;
  years: string;
  places: string[];
  intro: string;
  gateName: string;
  sky: string;
  ground: string;
  accent: string;
  fog: string;
  puzzle: Puzzle | null;
  photos: { src: string; caption?: string }[];
  song: { src: string; title: string };
  plaques: string[];
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
    puzzle: null,
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
      type: "two-halves",
      photo: P + "IMG_20150329_175107.webp",
      decoys: [P + "IMG_20150124_225459.webp", P + "IMG_20150614_220813.webp"],
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
      type: "memory-flip",
      photos: [
        P + "IMG_20170414_165807.webp",
        P + "IMG_20170416_095126.webp",
        P + "IMG_20170528_192310.webp",
      ],
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
      type: "which-era",
      options: [
        { label: "The First City", sub: "2012 – 2014 · strangers & sunrise" },
        { label: "Wedding Ghat", sub: "2016 · Chennai promises" },
        { label: "The Quiet Valley", sub: "2019 – 2022 · then there were three" },
        { label: "The Airport of Us", sub: "2024 · the travel year" },
      ],
      correctIndex: 2,
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
    intro: "A garden of memories — piece one back together to open the vault.",
    gateName: "The Puzzle Vault",
    sky: "#5c6fb8",
    ground: "#4f7a5c",
    accent: "#e8788a",
    fog: "#7a8ecc",
    puzzle: {
      type: "strip-shuffle",
      photo: P + "IMG_20231111_182545843.webp",
      strips: 4,
    },
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
    intro: "Four frames. One of them wandered in from another year.",
    gateName: "Photo-Booth Curtain",
    sky: "#2a3163",
    ground: "#3f4463",
    accent: "#f0b866",
    fog: "#3f4a8a",
    puzzle: {
      type: "odd-one-out",
      prompt: "Three belong to this lane. Tap the stranger.",
      photos: [
        P + "IMG_20250105_210640278.webp",
        P + "IMG_20250725_215537525.webp",
        P + "mithila-chennai-20160530.webp", // wedding — odd one
        P + "IMG20251206204057.webp",
      ],
      oddIndex: 2,
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
    intro: "One last song from the long walk. Name the chapter.",
    gateName: "The Golden Doors",
    sky: "#12142e",
    ground: "#2a2f4f",
    accent: "#f0b866",
    fog: "#1a1e3f",
    // medley ≈ 10 × 60s chapters; ch03 (Nothing Else Matters / wedding) ~120s
    puzzle: {
      type: "medley-scrub",
      startSec: 125,
      durationSec: 6,
      options: [
        "Hey There Delilah",
        "Nothing Else Matters",
        "Someday — Flipside",
        "Smack That — Akon",
      ],
      correctIndex: 1,
      hint: "Temple doors. Marigolds. That morning.",
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

// ---------- finale ----------
export const finale = {
  name: "MITHILA",
  age: 36,
  birthday: "25 · 07 · 2026",
  song: { src: A + "finale.mp3", title: "Good Riddance (Time of Your Life) — Green Day" },
  letter: [
    "It's been 10 years of togetherness —",
    "a decade of ordinary mornings and nights,",
    "of cities we grew into,",
    "adventures we took side by side,",
    "and a love that kept finding its way home.",
    "",
    "So many memories already made.",
    "So many more still waiting for us.",
    "",
    "Have a wonderful birthday.",
    "",
    "— Mansel",
  ],
  sparkSecret:
    "36 sparks. 36 reasons. One truth: I still choose you, every morning, every city, every song.",
};

export const medleySrc = A + "medley.mp3";
export const TOTAL_SPARKS = 36;

/** Flat list of every photo in the journey, tagged by biome — for the end gallery. */
export type GalleryPhoto = {
  src: string;
  caption?: string;
  landTitle: string;
  years: string;
  landIndex: number;
};

export function allGalleryPhotos(): GalleryPhoto[] {
  const out: GalleryPhoto[] = [];
  const seen = new Set<string>();
  for (const land of lands) {
    for (const p of land.photos) {
      if (seen.has(p.src)) continue;
      seen.add(p.src);
      out.push({
        src: p.src,
        caption: p.caption,
        landTitle: land.title,
        years: land.years,
        landIndex: land.index,
      });
    }
  }
  return out;
}
