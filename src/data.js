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
  {
    q: "Who is the brand ambassador of Master's Delight Whisky?",
    a: ["Hrithik Roshan", "Shah Rukh Khan", "Ranbir Kapoor", "Ajay Devgan"],
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
  [29, 28.5, 0], // first bottle on the top of the cupboard [left right, top bottom, angle]
  [28, 70, 0], // second bottle on the left side of cupboard
  [54, 61.5, 0], // third bottle in the center of the table
  [69, 86, 0], // fourth bottle on the floor
  [85, 29.5, 0], // fifth bottle on the book shelf
];
