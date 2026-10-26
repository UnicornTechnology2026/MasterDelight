import { useEffect, useMemo, useState } from "react";
import horse from "../assets/horse.png";

const RANKS = [
  { name: "RISING MASTER", min: 0 },
  { name: "MASTER BLENDER", min: 500 },
  { name: "GRAND MASTER", min: 750 },
];
const COLORS = ["#f5b82e", "#fff1b8", "#d8ab45", "#c1121f", "#ffffff"];

// number that counts up from 0 every time `replay` changes
function useCountUp(target, replay, ms = 1500) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, t0;
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / ms, 1);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, replay, ms]);
  return v;
}

export default function Final({ scores, onRestart }) {
  const total = scores.quiz + scores.blend + scores.hunt;
  const [play, setPlay] = useState(0); // bump to replay the celebration
  const shown = useCountUp(total, play);

  const rankIdx = RANKS.reduce((r, x, i) => (total >= x.min ? i : r), 0);
  const rank = RANKS[rankIdx],
    nextRank = RANKS[rankIdx + 1];
  const toNext = nextRank
    ? Math.min(100, ((total - rank.min) / (nextRank.min - rank.min)) * 100)
    : 100;

  // confetti pieces, regenerated on every celebration
  const pieces = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 2.4 + Math.random() * 1.8,
        size: 6 + Math.random() * 7,
        color: COLORS[i % COLORS.length],
        spin: 360 + Math.random() * 540,
        round: i % 3 === 0,
      })),
    [play],
  );

  return (
    <div className="flex min-h-0 flex-1 overflow-y-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <style>{`
        @keyframes md-fall{0%{transform:translateY(-12vh) rotate(0);opacity:1}85%{opacity:1}100%{transform:translateY(112vh) rotate(var(--spin));opacity:0}}
        @keyframes md-bar{from{width:0}to{width:var(--w)}}
      `}</style>

      {/* Confetti (click Celebrate to fire it again) */}
      <div
        key={`c${play}`}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      >
        {pieces.map((p, i) => (
          <span
            key={i}
            className="absolute top-0 block"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.round ? p.size : p.size * 1.6,
              borderRadius: p.round ? "50%" : 2,
              background: p.color,
              "--spin": `${p.spin}deg`,
              animation: `md-fall ${p.dur}s ${p.delay}s ease-in both`,
            }}
          />
        ))}
      </div>

      {/* Gold frame */}
      <section className="m-auto w-full max-w-2xl animate-rise rounded-3xl bg-gradient-to-b from-[#fde9a6] via-gold to-[#a8680f] p-[2px] shadow-[0_18px_40px_rgba(0,0,0,.55),0_0_40px_rgba(245,184,46,.25)]">
        <div className="flex flex-col items-center gap-3 rounded-[1.4rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(122,12,18,.95),rgba(30,3,6,.96)_75%)] px-4 py-5 text-center backdrop-blur sm:px-8 sm:py-6 lg:gap-4">
          {/* HERO: horse + rank + total */}
          <p className="rounded-2xl border border-gold/50 bg-black/45 px-3 py-1.5 font-display text-sm tracking-wider text-gold">
            ✦ JOURNEY COMPLETE
          </p>

          <div className="flex flex-col items-center gap-1">
            {/* tap the horse for another celebration */}

            <h1
              key={rank.name}
              className="animate-pop bg-gradient-to-r from-[#fff1b8] via-[#f0cf7a] to-[#d8a63a] bg-clip-text font-display text-4xl uppercase tracking-wide text-transparent sm:text-5xl"
            >
              {rank.name}
            </h1>
            <p className="font-body text-sm text-white/85">
              Har Master Ke Liye!
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[.3em] text-gold/80">
              Your total score
            </p>
            <div className="font-display text-7xl leading-none text-gold drop-shadow-[0_0_24px_rgba(245,184,46,.45)] sm:text-8xl">
              {shown}
              <span className="ml-2 text-2xl text-gold/70">pts</span>
            </div>
          </div>

          {/* rank progress */}
          <div className="w-full max-w-xl">
            <div className="flex items-center justify-between gap-1.5">
              {RANKS.map((r, i) => (
                <span
                  key={r.name}
                  className={`flex-1 rounded-lg border px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider transition sm:text-[10px] ${i === rankIdx ? "border-gold bg-gold text-maroon shadow-[0_0_12px_rgba(245,184,46,.6)]" : i < rankIdx ? "border-gold/60 bg-gold/15 text-gold" : "border-gold/20 text-white/40"}`}
                >
                  {r.name}
                </span>
              ))}
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                key={`r${play}`}
                className="h-full rounded-full bg-gradient-to-r from-[#fff1b8] to-[#d8ab45] shadow-[0_0_8px_rgba(245,184,46,.7)]"
                style={{
                  "--w": `${toNext}%`,
                  animation: "md-bar 1.4s ease-out both",
                }}
              />
            </div>
            <p className="mt-1 text-xs text-white/75">
              {nextRank
                ? `${nextRank.min - total} pts to ${nextRank.name}`
                : "Top rank achieved!"}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button className="btn-gold" onClick={onRestart}>
              PLAY AGAIN
            </button>
            <button
              className="btn-ghost bg-black/30"
              onClick={() => setPlay((n) => n + 1)}
            >
              ✦ Celebrate
            </button>
          </div>
          <p className="text-[10px] opacity-60">
            Please drink responsibly. For adults of legal drinking age only.
          </p>
        </div>
      </section>
    </div>
  );
}
