import { rest } from "./supabase";

export const LEVELS = ["quiz", "blend", "hunt"];

const toPlayer = (r) => ({
  id: r.id,
  name: r.name,
  city: r.city,
  mobile: r.mobile,
  scores: r.scores,
  done: r.done,
  plays: r.plays,
  registeredAt: Date.parse(r.registered_at),
  updatedAt: Date.parse(r.updated_at),
});

const inList = (ids) => `players?id=in.(${ids.join(",")})`;

// ADMIN ONLY: list all players
export async function getPlayers() {
  try {
    const rows = await rest("players?select=*&order=registered_at.desc", {
      admin: true,
    });
    return rows.map(toPlayer);
  } catch (e) {
    console.error("getPlayers:", e.message);
    return [];
  }
}

// Called when OTP is verified. Returns the player's id (or null if it failed).
export async function registerPlayer({ name, city, mobile }) {
  try {
    return await rest("rpc/register_player", {
      method: "POST",
      body: { p_name: name, p_city: city, p_mobile: mobile },
    });
  } catch (e) {
    console.error("registerPlayer:", e.message);
    return null;
  }
}

export async function saveLevel(id, key, score) {
  if (!id) return;
  try {
    await rest("rpc/save_level", {
      method: "POST",
      body: { p_id: id, p_key: key, p_score: score },
    });
  } catch (e) {
    console.error("saveLevel:", e.message);
  }
}

// "Play again": keep the registration, start a fresh run
export async function resetRun(id) {
  if (!id) return;
  try {
    await rest("rpc/reset_run", { method: "POST", body: { p_id: id } });
  } catch (e) {
    console.error("resetRun:", e.message);
  }
}

// ADMIN ONLY: delete everyone
export async function clearPlayers() {
  try {
    await rest("players?id=neq.00000000-0000-0000-0000-000000000000", {
      method: "DELETE",
      admin: true,
    });
  } catch (e) {
    console.error("clearPlayers:", e.message);
  }
}

// ADMIN ONLY: remove several players (registration + scores)
export async function deletePlayers(ids) {
  if (!ids.length) return true;
  try {
    await rest(inList(ids), { method: "DELETE", admin: true });
    return true;
  } catch (e) {
    console.error("deletePlayers:", e.message);
    return false;
  }
}

// ADMIN ONLY: wipe scores for several players but keep their registrations
export async function clearScoresFor(ids) {
  if (!ids.length) return true;
  try {
    await rest(inList(ids), {
      method: "PATCH",
      admin: true,
      body: {
        scores: { quiz: 0, blend: 0, hunt: 0 },
        done: { quiz: false, blend: false, hunt: false },
        updated_at: new Date().toISOString(),
      },
    });
    return true;
  } catch (e) {
    console.error("clearScoresFor:", e.message);
    return false;
  }
}

// ---- derived helpers used by the admin page ----
export const totalOf = (p) =>
  LEVELS.reduce((s, k) => s + (p.done[k] ? p.scores[k] : 0), 0);
export const doneCount = (p) => LEVELS.filter((k) => p.done[k]).length;
