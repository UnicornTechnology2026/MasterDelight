// Tiny player store. Everything lives in this browser's localStorage so the admin page
// works with no backend. To go live, replace the bodies of these functions with API calls.
const KEY = "md_players_v1";
export const LEVELS = ["quiz", "blend", "hunt"];

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};
const write = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage blocked / full: the game still works */
  }
};
const blank = () => ({
  scores: { quiz: 0, blend: 0, hunt: 0 },
  done: { quiz: false, blend: false, hunt: false },
});

export const getPlayers = () => read();

// Called when OTP is verified. Same mobile number = same player (new run, scores reset).
export function registerPlayer({ name, city, mobile }) {
  const list = read();
  const now = Date.now();
  let p = list.find((x) => x.mobile === mobile);
  if (p) {
    Object.assign(p, {
      name,
      city,
      ...blank(),
      plays: (p.plays || 1) + 1,
      updatedAt: now,
    });
  } else {
    p = {
      id: `p${now}${Math.floor(Math.random() * 1e4)}`,
      name,
      city,
      mobile,
      ...blank(),
      plays: 1,
      registeredAt: now,
      updatedAt: now,
    };
    list.push(p);
  }
  write(list);
  return p.id;
}

export function saveLevel(id, key, score) {
  const list = read();
  const p = list.find((x) => x.id === id);
  if (!p) return;
  p.scores[key] = score;
  p.done[key] = true;
  p.updatedAt = Date.now();
  write(list);
}

// "Play again": keep the registration, start a fresh run
export function resetRun(id) {
  const list = read();
  const p = list.find((x) => x.id === id);
  if (!p) return;
  Object.assign(p, blank(), {
    plays: (p.plays || 1) + 1,
    updatedAt: Date.now(),
  });
  write(list);
}

export const clearPlayers = () => write([]);

// ---- derived helpers used by the admin page ----
export const totalOf = (p) =>
  LEVELS.reduce((s, k) => s + (p.done[k] ? p.scores[k] : 0), 0);
export const doneCount = (p) => LEVELS.filter((k) => p.done[k]).length;
