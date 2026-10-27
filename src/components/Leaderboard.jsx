import { useCallback, useEffect, useState } from "react";
import { getLeaderboard } from "../lib/store";

const MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };
const ROW_TONE = {
  1: "border-gold bg-gold/20",
  2: "border-slate-300/70 bg-slate-200/10",
  3: "border-amber-600/80 bg-amber-700/20",
};

export default function Leaderboard({ playerId, onClose }) {
  const [rows, setRows] = useState(null); // null = loading
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setRows(null);
    setError(false);
    try {
      setRows(await getLeaderboard(50));
    } catch (e) {
      console.error("getLeaderboard:", e.message);
      setError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Close on Esc + lock page scroll while the popup is open
  useEffect(() => {
    const key = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const me = rows?.find((r) => r.id === playerId);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Leaderboard"
        className="glass-card flex max-h-[85dvh] w-full max-w-md animate-rise flex-col rounded-2xl border border-gold/60 bg-maroon/95 shadow-[0_20px_60px_rgba(0,0,0,.7)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-gold/25 px-5 pb-3 pt-4">
          <div>
            <h2 className="font-display text-3xl leading-none tracking-wide text-gold">
              🏆 LEADERBOARD
            </h2>
            <p className="mt-1 text-xs text-white/60">
              Top Masters ranked by total score
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close leaderboard"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/60 text-lg leading-none text-gold transition hover:bg-gold/15 active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Your position */}
        {me && (
          <p className="border-b border-gold/15 bg-gold/10 px-5 py-2 text-center text-sm text-cream">
            You are ranked{" "}
            <b className="font-display text-lg text-gold">#{me.rank}</b> with{" "}
            <b className="text-gold">{me.total}</b> pts
          </p>
        )}

        {/* List */}
        <div className="min-h-[160px] flex-1 overflow-y-auto px-4 py-3">
          {rows === null && !error && (
            <ul className="space-y-2" aria-busy="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <li
                  key={i}
                  className="h-14 animate-pulse rounded-xl border border-gold/10 bg-white/5"
                />
              ))}
            </ul>
          )}

          {error && (
            <div className="py-10 text-center">
              <p className="text-sm text-white/80">
                Couldn’t load the leaderboard.
              </p>
              <button
                type="button"
                onClick={load}
                className="btn-ghost mt-3 !px-4 !py-1.5 text-sm"
              >
                TRY AGAIN
              </button>
            </div>
          )}

          {rows && rows.length === 0 && (
            <p className="py-10 text-center text-sm text-white/70">
              No scores yet. Finish a level to claim the #1 spot! 🥇
            </p>
          )}

          {rows && rows.length > 0 && (
            <ol className="space-y-2">
              {rows.map((r) => {
                const mine = r.id === playerId;
                return (
                  <li
                    key={r.id}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${ROW_TONE[r.rank] || "border-gold/15 bg-black/25"} ${mine ? "ring-2 ring-gold" : ""}`}
                  >
                    <span className="grid w-9 shrink-0 place-items-center font-display text-xl text-gold">
                      {MEDAL[r.rank] || r.rank}
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-[15px] text-cream">
                        {r.name}
                        {mine && (
                          <span className="ml-2 rounded bg-gold px-1.5 py-0.5 align-middle text-[10px] font-bold text-maroon">
                            YOU
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-[11px] text-white/55">
                        {r.city || "—"} · {r.levels}/3 levels
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <b className="font-display text-2xl leading-none text-gold">
                        {r.total}
                      </b>
                      <span className="block text-[10px] uppercase tracking-widest text-white/50">
                        pts
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center border-t border-gold/25 px-5 py-3">
          <button
            type="button"
            onClick={load}
            disabled={rows === null && !error}
            className="btn-ghost !px-4 !py-1.5 text-sm disabled:opacity-40"
          >
            ⟳ REFRESH
          </button>
        </div>
      </div>
    </div>
  );
}
