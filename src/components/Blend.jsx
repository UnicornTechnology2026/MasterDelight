import { useEffect, useState } from "react";
import Bottle from "./Bottle";
import { INGREDIENTS } from "../data";
import { shuffle } from "../lib/shuffle";

const TIME = 20, // seconds
  BONUS_AT = 10,
  NEED = INGREDIENTS.filter((i) => i.ok).length;
const STATUS = [
  "Drag or tap ingredients into the bottle",
  "1 of 3 blended · add the next",
  "2 of 3 blended · one more to go",
  "Master’s blend achieved",
];

export default function Blend({ onDone }) {
  const [order] = useState(() => shuffle(INGREDIENTS));
  const [got, setGot] = useState([]);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(TIME);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [over, setOver] = useState(false);
  const [ended, setEnded] = useState(false);
  const won = got.length === NEED;
  const danger = left <= 5;

  useEffect(() => {
    if (won || ended) return;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [won, ended]);
  useEffect(() => {
    if (left <= 0 && !won && !ended) {
      setEnded(true);
      onDone({
        score: Math.max(0, score),
        title: "TIME EXPIRED",
        desc: "Mastery requires patience and precision.",
      });
    }
  }, [left]);

  const flash = (text, ok) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 1500);
  };
  const attempt = (it) => {
    if (won || ended || got.includes(it.id)) return;
    if (it.ok) {
      const next = [...got, it.id],
        s = score + 100;
      setGot(next);
      setScore(s);
      flash(`${it.name} added! +100`, true);
      if (next.length === NEED) {
        const bonus = left >= BONUS_AT ? 50 : 0;
        setTimeout(
          () =>
            onDone({
              score: s + bonus,
              title: "BLEND COMPLETE",
              desc: bonus
                ? "Speed bonus +50. A true master blender!"
                : "Beautifully blended.",
            }),
          900,
        );
      }
    } else {
      setScore((s) => s - 25);
      flash(`${it.name} is not in this blend. −25`, false);
      setShake(it.id);
      setTimeout(() => setShake(null), 400);
    }
  };
  const drop = (e) => {
    e.preventDefault();
    setOver(false);
    const it = INGREDIENTS.find(
      (i) => i.id === e.dataTransfer.getData("text/plain"),
    );
    if (it) attempt(it);
  };

  const mm = String(Math.floor(Math.max(left, 0) / 60)).padStart(2, "0"),
    ss = String(Math.max(left, 0) % 60).padStart(2, "0");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 pb-2 lg:gap-3">
      {/* HUD: title · blended count · timer · score (same as Quiz and Hunt) */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[.15em] text-cream/90 sm:text-xs">
          Blend the Master’s Delight
        </p>

        <div
          className="flex items-center gap-2 rounded-2xl border border-gold/50 bg-black/45 px-3 py-1.5 backdrop-blur"
          aria-label={`Blended ${got.length} of ${NEED}`}
        >
          <span className="font-display text-sm tracking-wider text-gold">
            ✦ BLENDED {got.length} / {NEED}
          </span>
          <span className="flex items-center gap-1">
            {Array.from({ length: NEED }, (_, k) => (
              <span
                key={k}
                className={`h-7 w-4 rounded-md border transition-all duration-500 sm:h-9 sm:w-5 ${k < got.length ? "border-gold bg-gradient-to-b from-[#fff1b8] to-[#d8ab45] shadow-[0_0_8px_rgba(245,184,46,.7)]" : "border-gold/30 bg-black/40"}`}
              />
            ))}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-xl border bg-black/45 px-3 py-1.5 font-mono text-base font-bold tracking-wider sm:text-lg ${danger ? "animate-tick border-red-400/70 text-red-400" : "border-gold/50 text-gold"}`}
          >
            ⏱ {mm}:{ss}
          </span>
          <span className="rounded-xl border border-gold/50 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[.15em] sm:text-xs">
            Score{" "}
            <b
              key={score}
              className={`inline-block animate-pop font-display text-base ${score < 0 ? "text-red-400" : "text-gold"}`}
            >
              {score}
            </b>
          </span>
        </div>
      </div>

      {/* Blend frame, sits in the page layout (same gold frame as Quiz and Hunt) */}
      <div className="relative flex flex-col gap-2 rounded-2xl border border-gold/70 bg-black/30 p-3 text-center shadow-[0_18px_40px_rgba(0,0,0,.55),0_0_30px_rgba(245,184,46,.18)] backdrop-blur-sm lg:min-h-0 lg:flex-1 lg:gap-3 lg:overflow-y-auto lg:p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Heading */}
        <div className="animate-rise">
          <h1 className="font-head text-[clamp(20px,5.5vw,28px)] font-bold uppercase leading-tight tracking-[.08em] text-[#fff8e6] [text-shadow:0_4px_24px_rgba(0,0,0,.6)] lg:text-[clamp(20px,3.4vh,30px)]">
            Blend the{" "}
            <span className="bg-gradient-to-r from-[#fff1b8] via-[#f0cf7a] to-[#b08420] bg-clip-text text-transparent [text-shadow:none]">
              Master’s Delight
            </span>
          </h1>
          <p className="mt-1 font-body text-sm text-white/90 lg:text-[clamp(12px,1.9vh,14px)]">
            Find the {NEED} genuine ingredients. Drag or tap them into the
            bottle.
          </p>
        </div>

        {/* Feedback message (fixed height so layout never jumps) */}
        <div className="grid h-8 place-items-center lg:h-9" aria-live="polite">
          {msg && (
            <p
              key={msg.text}
              className={`animate-pop rounded-full border px-5 py-1 font-head text-sm font-semibold text-white lg:text-base ${msg.ok ? "border-green-300/60 bg-green-600/90" : "border-red-300/60 bg-red-700/85"}`}
            >
              {msg.text}
            </p>
          )}
        </div>

        {/* Ingredients (2 columns on desktop) + bottle */}
        <div className="grid min-h-0 w-full grid-cols-[1fr_7rem] items-center gap-3 lg:flex-1 lg:grid-cols-[1fr_17rem] lg:gap-10">
          <div className="grid gap-2.5 text-left lg:grid-cols-2 lg:gap-3">
            {order.map((it, n) => {
              const done = got.includes(it.id);
              return (
                <div
                  key={it.id}
                  draggable={!done}
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", it.id)
                  }
                  onClick={() => attempt(it)}
                  style={{ animationDelay: `${120 + n * 60}ms` }}
                  className={`flex animate-rise cursor-grab items-center gap-3 rounded-2xl border-2 px-3 py-2.5 backdrop-blur transition duration-200 lg:gap-3 lg:px-4 lg:py-3 ${done ? "pointer-events-none border-green-400/50 bg-green-900/30 opacity-50" : shake === it.id ? "animate-shake border-red-400 bg-red-600/40" : "border-[#f3d28a]/40 bg-black/35 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10 hover:shadow-[0_8px_22px_rgba(245,184,46,.22)] active:scale-[.98]"}`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border font-display text-lg lg:h-10 lg:w-10 lg:text-xl ${done ? "border-white/70 bg-green-500 text-white" : "border-[#fff1b8]/70 bg-gradient-to-br from-[#f7dd97] to-[#c99a2e] text-maroon shadow-[0_0_12px_rgba(245,184,46,.35)]"}`}
                  >
                    {done ? "✓" : it.name.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block font-head text-base font-bold leading-tight text-[#fff8e6] lg:text-lg">
                      {it.name}
                    </b>
                    <span className="block font-body text-xs leading-tight text-white/70 lg:text-sm">
                      {it.note}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottle stage */}
          <div
            className="relative flex flex-col items-center gap-2 lg:gap-3 lg:self-center"
            onDragEnter={() => setOver(true)}
            onDragLeave={() => setOver(false)}
          >
            <div className="pointer-events-none absolute -inset-6 hidden bg-[radial-gradient(ellipse_at_50%_50%,rgba(245,184,46,.3),transparent_70%)] lg:block" />
            <Bottle
              grey
              fill={got.length / NEED}
              glow={over}
              onDrop={drop}
              className="relative w-full lg:h-[clamp(240px,calc(100dvh-24rem),600px)] lg:w-auto"
            />
            <p className="relative text-[11px] leading-tight text-white/75 lg:rounded-full lg:border lg:border-[#f3d28a]/45 lg:bg-black/35 lg:px-3 lg:py-1 lg:font-body lg:text-[11px] lg:uppercase lg:tracking-[.1em] lg:text-[#f3d28a]">
              {STATUS[got.length]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
