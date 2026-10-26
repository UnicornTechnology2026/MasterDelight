import { useCallback, useEffect, useState } from "react";
import horse from "../assets/horse.png";
import tagline from "../assets/tagline.png";
import { QUESTIONS } from "../data";
import { shuffle } from "../lib/shuffle";

// ---- Tunables -------------------------------------------------------------
const IMG = { horse, tagline };
const TIME = 16000; // seconds per question
const COUNT = 5; // questions per run
const NEXT_DELAY = 1400; // ms the feedback stays on screen
const POINTS = 100;
const LETTERS = ["A", "B", "C", "D"];
const CHEERS = [
  "Wah, Master!",
  "Spot on!",
  "Sharp mind!",
  "Master class!",
  "Bilkul sahi!",
];
const R = 26,
  CIRC = 2 * Math.PI * R;

const pick = () =>
  shuffle(QUESTIONS)
    .slice(0, COUNT)
    .map((q) => ({
      ...q,
      opts: shuffle(q.a.map((t, i) => ({ t, ok: i === 0 }))),
    }));
const buzz = (p) => {
  try {
    navigator.vibrate?.(p);
  } catch {
    /* not supported */
  }
};

// ---- Small pieces ---------------------------------------------------------
const Flame = ({ className = "h-4 w-4" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2c.5 3.2-1.6 4.8-3.2 6.7C7.2 10.5 6 12.3 6 14.8A6 6 0 0 0 18 15c0-2.2-.9-3.7-2-5 .1 1.6-.4 2.6-1.3 3.2.6-3.5-.4-7.6-2.7-11.2Z" />
  </svg>
);
const Check = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
const Cross = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.2"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

// Gold sparkle burst, anchored near the right edge of the correct answer.
const Sparks = () => (
  <span
    className="pointer-events-none absolute right-6 top-1/2"
    aria-hidden="true"
  >
    {Array.from({ length: 14 }, (_, k) => {
      const a = (k / 14) * Math.PI * 2,
        d = 42 + (k % 3) * 18;
      return (
        <i
          key={k}
          className="absolute h-2 w-2 animate-spark rounded-full bg-gold shadow-[0_0_8px_#f5b82e]"
          style={{
            "--dx": `${Math.cos(a) * d}px`,
            "--dy": `${Math.sin(a) * d}px`,
            animationDelay: `${(k % 4) * 30}ms`,
          }}
        />
      );
    })}
  </span>
);

// Circular countdown. Re-mounted for every question so it always starts full.
function TimerRing({ left, frozen }) {
  const danger = left <= 5;
  return (
    <div
      className={`relative grid h-[68px] w-[68px] place-items-center rounded-full border-2 border-[#f3d28a]/70 bg-maroon shadow-[0_0_0_4px_rgba(30,3,6,1),0_8px_20px_rgba(0,0,0,.6),0_0_22px_rgba(245,184,46,.3)] ${danger && !frozen ? "animate-tick" : ""}`}
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff1b8" />
            <stop offset="1" stopColor="#d8ab45" />
          </linearGradient>
        </defs>
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke="rgba(245,184,46,.18)"
          strokeWidth="5"
        />
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          stroke={danger ? "#f87171" : "url(#tg)"}
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - Math.max(left, 0) / TIME)}
          style={{
            transition: "stroke-dashoffset 1s linear, stroke .3s",
            filter: `drop-shadow(0 0 4px ${danger ? "#f87171" : "#f5b82e"})`,
          }}
        />
      </svg>
      <b
        className={`relative font-display text-2xl leading-none ${danger ? "text-red-400" : "text-[#f3d28a]"}`}
      >
        {Math.max(left, 0)}
      </b>
    </div>
  );
}

// ---- Main screen ----------------------------------------------------------
export default function Quiz({ onDone }) {
  const [qs] = useState(pick);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(TIME);
  const [chosen, setChosen] = useState(null); // option index, -1 = timed out
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [cheer, setCheer] = useState("");
  const q = qs[i];
  const locked = chosen !== null;
  const right = locked && chosen >= 0 && q.opts[chosen].ok;

  useEffect(() => {
    if (locked) return;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [locked, i]);

  const answer = useCallback(
    (idx) => {
      if (chosen !== null) return;
      const ok = idx >= 0 && q.opts[idx].ok;
      const s = score + (ok ? POINTS : 0);
      setChosen(idx);
      setScore(s);
      setStreak((n) => (ok ? n + 1 : 0));
      setCheer(
        ok
          ? CHEERS[Math.floor(Math.random() * CHEERS.length)]
          : idx === -1
            ? "Time’s up!"
            : "Not this time, Master.",
      );
      buzz(ok ? 25 : [60, 40, 60]);
      setTimeout(() => {
        if (i + 1 >= COUNT)
          onDone({
            score: s,
            title: "QUIZ COMPLETE",
            desc: `${s / POINTS} of ${COUNT} correct. ${s >= 400 ? "A true master!" : "Good effort, Master."}`,
          });
        else {
          setI(i + 1);
          setChosen(null);
          setLeft(TIME);
        }
      }, NEXT_DELAY);
    },
    [chosen, q, score, i, onDone],
  );

  useEffect(() => {
    if (left <= 0 && chosen === null) answer(-1);
  }, [left, chosen, answer]);

  // Keyboard: 1-4 or A-D
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      const idx = "1234abcd".indexOf(e.key.toLowerCase());
      if (idx >= 0 && idx % 4 < q.opts.length) answer(idx % 4);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, q]);

  const optCls = (o, idx) => {
    if (!locked)
      return "border-[#f3d28a]/40 bg-black/35 backdrop-blur hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10 hover:shadow-[0_8px_22px_rgba(245,184,46,.22)] active:scale-[.98]";
    if (o.ok)
      return "border-green-300 bg-gradient-to-r from-green-700 to-green-600 text-white animate-glowPulse";
    if (idx === chosen)
      return "border-red-300 bg-gradient-to-r from-red-800 to-red-600 text-white animate-shake";
    return "border-gold/15 bg-black/30 opacity-40";
  };
  const badgeCls = (o, idx) =>
    !locked
      ? "border-[#fff1b8]/70 bg-gradient-to-br from-[#f7dd97] to-[#c99a2e] text-maroon shadow-[0_0_12px_rgba(245,184,46,.35)]"
      : o.ok
        ? "border-white/70 bg-white text-green-700"
        : idx === chosen
          ? "border-white/70 bg-white text-red-600"
          : "border-gold/20 text-gold/50";

  return (
    <div className="flex flex-1 flex-col justify-center gap-3 pb-2 lg:gap-6">
      {/* Question + score pills */}
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#f3d28a]/45 bg-black/35 px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[.22em] text-[#f3d28a] backdrop-blur lg:px-6 lg:py-2.5 lg:text-sm">
          Question
          <b className="font-display text-base tracking-normal text-white lg:text-2xl">
            {i + 1}
            <span className="opacity-50">/{COUNT}</span>
          </b>
        </span>
        <span className="relative inline-flex items-center gap-2 rounded-full border border-[#f3d28a]/45 bg-black/35 px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[.22em] text-[#f3d28a] backdrop-blur lg:px-6 lg:py-2.5 lg:text-sm">
          Score
          <b
            key={score}
            className="inline-block animate-pop font-display text-base tracking-normal text-white lg:text-2xl"
          >
            {score}
          </b>
          {right && (
            <span
              key={`p${i}`}
              className="pointer-events-none absolute -top-4 right-3 animate-floatUp font-display text-lg tracking-normal text-green-300 lg:text-2xl"
            >
              +{POINTS}
            </span>
          )}
        </span>
      </div>

      {/* Progress */}
      <div
        className="flex gap-1.5 lg:gap-3"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={COUNT}
        aria-valuenow={i + (locked ? 1 : 0)}
      >
        {qs.map((_, k) => (
          <span
            key={k}
            className={`h-2 flex-1 rounded-full transition-all duration-500 lg:h-2.5 ${k < i || (k === i && locked) ? "bg-gradient-to-r from-[#fff1b8] to-[#d8ab45] shadow-[0_0_8px_rgba(245,184,46,.7)]" : k === i ? "animate-pulse bg-gold/50" : "bg-white/15"}`}
          />
        ))}
      </div>

      {/* Desktop: question on the left, answers on the right */}
      <div className="grid gap-3 lg:grid-cols-2 lg:items-center lg:gap-12">
        {/* Question card: gold frame (re-keyed per question so it re-animates) */}
        <section
          key={i}
          className="relative mt-9 animate-rise rounded-2xl bg-gradient-to-b from-[#fde9a6] via-gold to-[#a8680f] p-[1.5px] shadow-[0_18px_40px_rgba(0,0,0,.55),0_0_34px_rgba(245,184,46,.2)] lg:mt-10 lg:rounded-3xl lg:p-[2px]"
        >
          <div className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 lg:-top-10 lg:scale-110">
            <TimerRing key={i} left={left} frozen={locked} />
          </div>
          <div className="relative flex flex-col justify-center rounded-[0.95rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(122,12,18,.92),rgba(30,3,6,.95)_75%)] px-5 pb-6 pt-12 text-center backdrop-blur lg:min-h-[26rem] lg:rounded-[1.4rem] lg:px-12 lg:pb-12 lg:pt-16">
            {streak >= 2 && (
              <span
                key={streak}
                className="absolute left-3 top-3 flex animate-pop items-center gap-1 rounded-full border border-gold/60 bg-gold/15 px-2 py-0.5 font-display text-xs tracking-wide text-gold lg:left-5 lg:top-5 lg:text-base"
              >
                <Flame /> ×{streak}
              </span>
            )}
            {q.img && (
              <div className="medallion mx-auto mb-3 grid h-28 w-full place-items-center rounded-xl lg:mb-6 lg:h-44">
                <img
                  src={IMG[q.img]}
                  alt=""
                  draggable={false}
                  className={`max-h-24 object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,.5)] lg:max-h-40 ${q.img === "horse" ? "animate-bob" : ""}`}
                />
              </div>
            )}
            <h2 className="font-head text-[clamp(20px,5.8vw,26px)] font-bold leading-snug text-[#fff8e6] [text-shadow:0_2px_12px_rgba(0,0,0,.6)] lg:text-[clamp(30px,2.9vw,46px)]">
              {q.q}
            </h2>
            <div className="mx-auto mt-4 flex w-40 items-center gap-2 lg:mt-7 lg:w-56">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/70" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/70" />
            </div>
          </div>
        </section>

        {/* Answers + feedback */}
        <div className="flex flex-col gap-3">
          <div
            key={`o${i}`}
            className="grid gap-2.5 lg:gap-4"
            role="group"
            aria-label="Answers"
          >
            {q.opts.map((o, idx) => (
              <button
                key={idx}
                disabled={locked}
                onClick={() => answer(idx)}
                style={{ animationDelay: `${120 + idx * 70}ms` }}
                className={`group relative flex w-full animate-rise items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left font-body text-[15px] leading-snug text-[#fff8e6] transition duration-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white lg:gap-5 lg:px-5 lg:py-5 lg:text-xl ${optCls(o, idx)}`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border font-display text-lg transition lg:h-12 lg:w-12 lg:text-2xl ${badgeCls(o, idx)}`}
                >
                  {locked && o.ok ? (
                    <Check />
                  ) : locked && idx === chosen ? (
                    <Cross />
                  ) : (
                    LETTERS[idx]
                  )}
                </span>
                <span className="flex-1">{o.t}</span>
                {locked && o.ok && chosen >= 0 && <Sparks />}
              </button>
            ))}
          </div>

          {/* Feedback pill (fixed height so layout never jumps) */}
          <div
            className="grid h-9 place-items-center lg:h-12"
            aria-live="polite"
          >
            {locked ? (
              <p
                key={cheer + i}
                className={`animate-pop rounded-full border px-5 py-1 font-head text-sm font-semibold tracking-wide text-white lg:px-8 lg:py-2 lg:text-lg ${right ? "border-green-300/60 bg-green-600/90" : "border-red-300/60 bg-red-700/85"}`}
              >
                {cheer}
              </p>
            ) : (
              <p className="hidden font-body text-[11px] uppercase tracking-[.25em] text-white/50 sm:block lg:text-xs">
                Tap an answer · or press 1–4
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
