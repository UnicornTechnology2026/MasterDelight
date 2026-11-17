import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import labelImg from "../assets/coupon-label.png";

const REWARDS = [30, 45, 60, 90]; // ml free

// Local fallback only (used if the database can't be reached)
export const makeCoupon = () => {
  const ml = REWARDS[Math.floor(Math.random() * REWARDS.length)];
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return { ml, code: `MD${ml}-${code}` };
};

// Silver scratch foil drawn on a canvas; reveals once ~45% is scratched off
function ScratchCard({ onReveal, children }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const c = canvas.current;
    const { width: w, height: h } = wrap.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr;
    c.height = h * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#d9dde2");
    g.addColorStop(0.35, "#f6f7f9");
    g.addColorStop(0.6, "#b4bac2");
    g.addColorStop(1, "#e4e7ea");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(90,98,108,.35)";
    for (let i = 0; i < 260; i++)
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    ctx.fillStyle = "#6b7480";
    ctx.textAlign = "center";
    ctx.font = "bold 20px Anton, Impact, sans-serif";
    ctx.fillText("SCRATCH HERE", w / 2, h / 2 - 2);
    ctx.font = "12px Poppins, sans-serif";
    ctx.fillText("to win free whisky", w / 2, h / 2 + 18);
  }, []);

  const scratch = (e) => {
    if (done || !(e.buttons || e.pointerType === "touch")) return;
    const c = canvas.current;
    const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(
      (e.clientX - r.left) * dpr,
      (e.clientY - r.top) * dpr,
      20 * dpr,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  };

  const check = () => {
    if (done) return;
    const c = canvas.current;
    const data = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let clear = 0,
      n = 0;
    for (let i = 3; i < data.length; i += 64) {
      n++;
      if (data[i] === 0) clear++;
    }
    if (clear / n > 0.45) {
      setDone(true);
      onReveal();
    }
  };

  return (
    <div
      ref={wrap}
      className="relative h-full w-full overflow-hidden rounded-xl"
    >
      {children}
      <canvas
        ref={canvas}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          scratch(e);
        }}
        onPointerMove={scratch}
        onPointerUp={check}
        className={`absolute inset-0 h-full w-full touch-none cursor-pointer transition-opacity duration-700 ${done ? "pointer-events-none opacity-0" : ""}`}
      />
    </div>
  );
}

const CONFETTI_COLORS = ["#f5c24a", "#fde9a6", "#e11d2e", "#ffffff", "#19b5c1"];

// Confetti celebration: falls over the whole screen once, then removes itself
function Confetti({ onDone }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        dur: 2.2 + Math.random() * 2,
        w: 6 + Math.random() * 7,
        h: 8 + Math.random() * 10,
        dx: (Math.random() - 0.5) * 220,
        rot: 360 + Math.random() * 720,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    [],
  );

  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    const t = setTimeout(() => done.current(), 5200);
    return () => clearTimeout(t);
  }, []);

  return createPortal(
    <div
      aria-hidden="true"
      className="md-confetti pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      <style>{`
        @keyframes md-fall{0%{transform:translate3d(0,-12vh,0) rotate(0);opacity:1}100%{transform:translate3d(var(--dx),112vh,0) rotate(var(--rot));opacity:.9}}
        @media (prefers-reduced-motion:reduce){.md-confetti{display:none}}
      `}</style>
      {pieces.map((c, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={{
            left: `${c.left}%`,
            width: c.w,
            height: c.h,
            background: c.color,
            borderRadius: 2,
            "--dx": `${c.dx}px`,
            "--rot": `${c.rot}deg`,
            animation: `md-fall ${c.dur}s linear ${c.delay}s both`,
          }}
        />
      ))}
    </div>,
    document.body,
  );
}

// The bottle label is a single image (924 x 1702 source). The scratch card sits on
// top of it, positioned in % of the label and sized in cqw (% of the label's width),
// so it scales together with the label.
export default function Coupon({ coupon }) {
  const [shown, setShown] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  // celebrate (confetti) as soon as the foil clears
  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setCelebrate(true), 200);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden py-2">
      <div
        className="animate-rise relative"
        style={{
          aspectRatio: "924 / 1702",
          height: "min(calc(100dvh - 9.5rem), 640px)",
          maxWidth: "100%",
          containerType: "inline-size",
          filter: "drop-shadow(0 0 22px rgba(245,184,46,.28))",
        }}
      >
        <img
          src={labelImg}
          alt="Masters Delight Premium Whisky label"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none"
        />

        {/* Scratch card in the empty red space (between WHISKY and the crest) */}
        <div
          className="absolute rounded-xl border-2 border-[#f5c24a] bg-black/25 p-[1.2cqw]"
          style={{ left: "12%", right: "12%", top: "38.5%", height: "24.5%" }}
        >
          <ScratchCard onReveal={() => setShown(true)}>
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-[#fff1b8] to-[#f5b82e] text-maroon">
              <p
                className="font-bold uppercase"
                style={{ fontSize: "3.4cqw", letterSpacing: ".3em" }}
              >
                You won
              </p>
              <p
                className="font-display leading-none"
                style={{ fontSize: "22cqw" }}
              >
                {coupon.ml}
                <span style={{ fontSize: "9cqw" }}> ML</span>
              </p>
              <p
                className="font-display"
                style={{ fontSize: "7cqw", letterSpacing: ".2em" }}
              >
                FREE!
              </p>
            </div>
          </ScratchCard>
        </div>
      </div>

      {celebrate && <Confetti onDone={() => setCelebrate(false)} />}

      <p className="text-center text-[10px] opacity-60">
        Please drink responsibly. For adults of legal drinking age only.
      </p>
    </div>
  );
}
