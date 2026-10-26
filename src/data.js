// ---- Level 1: quiz pool. First answer in `a` is the correct one (options are shuffled at play time).
// `img` may be 'horse' or 'tagline' to show a picture above the question.
export const QUESTIONS = [
  {
    q: "Which animal is the Masters Delight emblem?",
    a: ["Horse", "Lion", "Tiger", "Eagle"],
  },
  {
    q: "Complete the tagline: “Har Master Ke ___”",
    a: ["Liye", "Saath", "Pyaar", "Naam"],
  },
  {
    q: "What colour is the label on the Masters Delight bottle?",
    a: ["Red", "Blue", "Green", "Purple"],
  },
  {
    q: "What is Masters Delight a smooth blend of?",
    a: [
      "Imported Scotch malts and select Indian malts with grain spirit",
      "Only grain spirit and botanicals",
      "Indian rice spirit and oak",
      "Imported rum and select grain",
    ],
  },
  { q: "Masters Delight is a premium…", a: ["Whisky", "Rum", "Vodka", "Gin"] },
  {
    q: "What colour is the strip at the bottom of the label?",
    a: ["Teal", "Black", "Pink", "Orange"],
  },
  {
    q: "Which small pack appears beside the bottle on the poster?",
    a: ["Pocketo", "Mini Master", "Quarter Cask", "Pocket Pro"],
  },
  { q: "How many words are in “Har Master Ke Liye”?", a: ["4", "3", "5", "6"] },
  {
    q: "What colour is the horse on the poster?",
    a: ["Gold", "Silver", "Black", "White"],
  },
];
// ---- Level 2: ingredients. ok:true = genuine (from the bottle label).
export const INGREDIENTS = [
  {
    id: "scotch",
    name: "Scotch Malt",
    note: "Imported Scotch malts",
    ok: true,
  },
  { id: "indian", name: "Indian Malt", note: "Select Indian malts", ok: true },
  { id: "grain", name: "Grain Spirit", note: "Smooth finish", ok: true },
  { id: "oak", name: "American Oak", note: "Oak craft note", ok: false },
  {
    id: "barrel",
    name: "European Barrel",
    note: "Continental note",
    ok: false,
  },
  {
    id: "botanical",
    name: "Botanical Note",
    note: "Aromatic profile",
    ok: false,
  },
  { id: "caramel", name: "Caramel Note", note: "Sweet profile", ok: false },
  { id: "cask", name: "Cask Influence", note: "Wood resonance", ok: false },
];
// ---- Level 3: hidden mini bottles on the bar scene: [x %, y %, rotation deg]
// 1 shelf (left arch) · 2 shelf (right alcove) · 3 table (right) · 4 lying on the bar · 5 on the stool
export const HIDDEN = [
  [31, 45, 0],
  [56, 38, 0],
  [91, 60, -8],
  [45, 70, -70],
  [69, 82, 0],
];
