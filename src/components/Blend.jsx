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

const pill =
  "relative inline-flex items-center gap-2 rounded-full border border-[#f3d28a]/45 bg-black/35 px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[.22em] text-[#f3d28a] backdrop-blur lg:!px-4 lg:!py-1 lg:!text-xs";

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

  return (
    <div className="mx-auto flex min-h-0 w-full flex-1 flex-col justify-center gap-3 pb-2 text-center lg:grid lg:max-w-5xl lg:grid-cols-[1fr_17rem] lg:content-center lg:gap-x-10 lg:gap-y-[clamp(6px,1.2vh,12px)] lg:pb-0">
      {/* Score + time pills */}
      <div className="flex items-center justify-between gap-3 lg:col-start-1">
        <span className={pill}>
          Score
          <b
            key={score}
            className={`inline-block animate-pop font-display text-base tracking-normal lg:text-lg ${score < 0 ? "text-red-400" : "text-white"}`}
          >
            {score}
          </b>
        </span>
        <span
          className={`${pill} ${danger ? "animate-tick !border-red-400/70" : ""}`}
        >
          Time
          <b
            className={`font-display text-base tracking-normal lg:text-lg ${danger ? "text-red-400" : "text-white"}`}
          >
            {Math.max(left, 0)}s
          </b>
        </span>
      </div>

      {/* Time bar */}
      <div className="h-2 overflow-hidden rounded-full bg-white/15 lg:col-start-1 lg:h-1.5">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${danger ? "bg-red-400" : "bg-gradient-to-r from-[#fff1b8] to-[#d8ab45] shadow-[0_0_8px_rgba(245,184,46,.7)]"}`}
          style={{ width: `${(Math.max(left, 0) / TIME) * 100}%` }}
        />
      </div>

      {/* Heading */}
      <div className="animate-rise lg:col-start-1">
        <h1 className="font-head text-[clamp(22px,6vw,30px)] font-bold uppercase leading-tight tracking-[.08em] text-[#fff8e6] [text-shadow:0_4px_24px_rgba(0,0,0,.6)] lg:text-[clamp(20px,3.6vh,30px)]">
          Blend the{" "}
          <span className="bg-gradient-to-r from-[#fff1b8] via-[#f0cf7a] to-[#b08420] bg-clip-text text-transparent [text-shadow:none]">
            Master’s Delight
          </span>
        </h1>
        <p className="mt-2 font-body text-sm text-white/90 lg:mt-0.5 lg:text-[clamp(11px,1.9vh,14px)]">
          Find the {NEED} genuine ingredients. Drag or tap them into the bottle.
        </p>
      </div>

      {/* Feedback message (fixed height so layout never jumps) */}
      <div
        className="grid h-8 place-items-center lg:col-start-1 lg:h-[clamp(22px,3.6vh,30px)]"
        aria-live="polite"
      >
        {msg && (
          <p
            key={msg.text}
            className={`animate-pop rounded-full border px-5 py-1 font-head text-sm font-semibold text-white lg:py-0.5 lg:text-[clamp(11px,1.9vh,14px)] ${msg.ok ? "border-green-300/60 bg-green-600/90" : "border-red-300/60 bg-red-700/85"}`}
          >
            {msg.text}
          </p>
        )}
      </div>

      {/* Ingredients (2 columns on desktop) + bottle */}
      <div className="grid min-h-0 w-full grid-cols-[1fr_7rem] items-center gap-3 lg:contents">
        <div className="grid gap-2.5 text-left lg:col-start-1 lg:grid-cols-2 lg:gap-[clamp(6px,1.3vh,10px)]">
          {order.map((it, n) => {
            const done = got.includes(it.id);
            return (
              <div
                key={it.id}
                draggable={!done}
                onDragStart={(e) => e.dataTransfer.setData("text/plain", it.id)}
                onClick={() => attempt(it)}
                style={{ animationDelay: `${120 + n * 60}ms` }}
                className={`flex animate-rise cursor-grab items-center gap-3 rounded-2xl border-2 px-3 py-2.5 backdrop-blur transition duration-200 lg:gap-2.5 lg:px-3 lg:py-[clamp(4px,1vh,9px)] ${done ? "pointer-events-none border-green-400/50 bg-green-900/30 opacity-50" : shake === it.id ? "animate-shake border-red-400 bg-red-600/40" : "border-[#f3d28a]/40 bg-black/35 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10 hover:shadow-[0_8px_22px_rgba(245,184,46,.22)] active:scale-[.98]"}`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border font-display text-lg lg:h-[clamp(26px,4.2vh,36px)] lg:w-[clamp(26px,4.2vh,36px)] lg:text-[clamp(13px,2.2vh,17px)] ${done ? "border-white/70 bg-green-500 text-white" : "border-[#fff1b8]/70 bg-gradient-to-br from-[#f7dd97] to-[#c99a2e] text-maroon shadow-[0_0_12px_rgba(245,184,46,.35)]"}`}
                >
                  {done ? "✓" : it.name.charAt(0)}
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block font-head text-base font-bold leading-tight text-[#fff8e6] lg:text-[clamp(13px,2.2vh,16px)]">
                    {it.name}
                  </b>
                  <span className="block font-body text-xs leading-tight text-white/70 lg:text-[clamp(10px,1.5vh,12px)]">
                    {it.note}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottle stage */}
        <div
          className="relative flex flex-col items-center gap-2 lg:col-start-2 lg:row-span-5 lg:row-start-1 lg:gap-3 lg:self-center"
          onDragEnter={() => setOver(true)}
          onDragLeave={() => setOver(false)}
        >
          <div className="pointer-events-none absolute -inset-6 hidden bg-[radial-gradient(ellipse_at_50%_50%,rgba(245,184,46,.3),transparent_70%)] lg:block" />
          <Bottle
            grey
            fill={got.length / NEED}
            glow={over}
            onDrop={drop}
            className="relative w-full lg:h-[min(62vh,640px)] lg:w-auto"
          />
          <p className="relative text-[11px] leading-tight text-white/75 lg:rounded-full lg:border lg:border-[#f3d28a]/45 lg:bg-black/35 lg:px-3 lg:py-1 lg:font-body lg:text-[clamp(9px,1.5vh,11px)] lg:uppercase lg:tracking-[.1em] lg:text-[#f3d28a]">
            {STATUS[got.length]}
          </p>
        </div>
      </div>
    </div>
  );
}
