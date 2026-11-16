import { useEffect, useRef, useState } from "react";

const REWARDS = [10, 20, 30, 40, 50, 60, 70, 80, 90]; // ml free

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

const Crest = () => (
  <svg
    viewBox="0 0 60 60"
    style={{ width: "100%", height: "100%" }}
    aria-hidden="true"
  >
    <g fill="none" stroke="#f5c24a" strokeWidth="1.6">
      <circle cx="30" cy="36" r="18" />
      <circle cx="30" cy="36" r="13" strokeWidth="1" />
      <path d="M22 10l4 5 4-6 4 6 4-5-2 8H24z" fill="#f5c24a" />
      <path d="M10 18l12 12M50 18L38 30M22 54l-6 5M38 54l6 5" />
    </g>
    <path d="M30 26l7 10-7 10-7-10z" fill="#f5c24a" />
  </svg>
);

// Label proportions copied from the bottle label image (290 x 572 px).
// Every size inside uses cqw (% of the coupon's width), so it scales as one piece.
export default function Coupon({ coupon, onBack }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const abs = (top, h, extra = {}) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: `${top}%`,
    height: h ? `${h}%` : undefined,
    ...extra,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden py-2">
      <div
        className="animate-rise relative overflow-hidden rounded-md border-[3px] border-[#f5c24a] shadow-[0_18px_40px_rgba(0,0,0,.55),0_0_40px_rgba(245,184,46,.25)]"
        style={{
          aspectRatio: "290 / 572",
          height: "min(calc(100dvh - 9.5rem), 640px)",
          maxWidth: "100%",
          containerType: "inline-size",
          background:
            "repeating-linear-gradient(172deg,#c00805 0 2.4cqw,#a80402 2.4cqw 4.8cqw)",
        }}
      >
        {/* MASTERS DELIGHT (label y 3%-27%) */}
        <h1
          className="text-center font-display uppercase text-[#fde9a6] drop-shadow"
          style={{
            ...abs(3.5),
            fontSize: "21cqw",
            lineHeight: 0.98,
            letterSpacing: ".02em",
          }}
        >
          Masters
          <br />
          Delight
        </h1>
        {/* PREMIUM WHISKY (y 28%-35%) */}
        <p
          className="text-center font-semibold text-[#f5c24a]"
          style={{ ...abs(28.8), fontSize: "4.4cqw", letterSpacing: ".35em" }}
        >
          PREMIUM
        </p>
        <p
          className="text-center font-display text-white"
          style={{ ...abs(31.2), fontSize: "9.5cqw", letterSpacing: ".18em" }}
        >
          WHISKY
        </p>

        {/* Scratch card where the horse was (y 37%-62%) */}
        <div
          className="absolute rounded-xl border-2 border-[#f5c24a] bg-black/25 p-[1.2cqw]"
          style={{ left: "13%", right: "13%", top: "38%", height: "25%" }}
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

        {/* SMOOTH [crest] BLEND (y 64%-82%) */}
        <p
          className="absolute text-white/95"
          style={{
            left: "5%",
            top: "71%",
            fontSize: "3.6cqw",
            letterSpacing: ".3em",
          }}
        >
          SMOOTH
        </p>
        <p
          className="absolute text-white/95"
          style={{
            right: "5%",
            top: "71%",
            fontSize: "3.6cqw",
            letterSpacing: ".3em",
          }}
        >
          BLEND
        </p>
        <div
          className="absolute z-10"
          style={{
            left: "50%",
            top: "64.5%",
            width: "24cqw",
            height: "17cqw",
            transform: "translateX(-50%)",
          }}
        >
          <Crest />
        </div>

        {/* Teal band (y 74% - 100%) */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-[#02666f] text-center"
          style={{ top: "74%", padding: "0 5cqw", paddingTop: "6cqw" }}
        >
          {shown ? (
            <div className="animate-pop">
              <p
                className="uppercase text-[#fde9a6]"
                style={{ fontSize: "3.6cqw", letterSpacing: ".25em" }}
              >
                Delight Coupon Code
              </p>
              <button
                onClick={copy}
                className="rounded-lg border-2 border-dashed border-[#fde9a6] bg-black/25 font-display text-white"
                style={{
                  marginTop: "1.5cqw",
                  padding: "1.5cqw 4cqw",
                  fontSize: "8cqw",
                  letterSpacing: ".12em",
                }}
              >
                {coupon.code}
              </button>
              <p
                className="text-white/80"
                style={{ marginTop: "1.5cqw", fontSize: "3.2cqw" }}
              >
                {copied ? "Copied!" : "Tap code to copy · show it at the bar"}
              </p>
            </div>
          ) : (
            <p
              className="font-semibold uppercase text-white"
              style={{
                fontSize: "3.9cqw",
                lineHeight: 1.7,
                letterSpacing: ".16em",
              }}
            >
              A delightfully smooth blend of imported Scotch malts and select
              Indian malts with grain spirit
            </p>
          )}
        </div>
      </div>

      <button className="btn-ghost bg-black/30 !py-1" onClick={onBack}>
        ← Back to score
      </button>
      <p className="text-center text-[10px] opacity-60">
        Please drink responsibly. For adults of legal drinking age only.
      </p>
    </div>
  );
}
