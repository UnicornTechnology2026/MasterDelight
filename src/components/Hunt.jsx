import { useEffect, useLayoutEffect, useRef, useState } from "react";
import scene from "../assets/scene.jpg";
import mini from "../assets/mini-bottle.png";
import { HIDDEN } from "../data";

const TIME = 15,
  N = HIDDEN.length;
const RATIO = 1376 / 768; // width / height of scene.jpg
const BOTTLE_W = 2.5; // hidden bottle width as % of scene width (raise to make the bottles bigger)

export default function Hunt({ onDone }) {
  const [found, setFound] = useState([]);
  const [miss, setMiss] = useState(0);
  const [left, setLeft] = useState(TIME);
  const [rings, setRings] = useState([]);
  const [fin, setFin] = useState(false);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const box = useRef(null);
  const area = useRef(null);
  const drag = useRef(null);

  useEffect(() => {
    if (fin) return;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [fin]);
  useEffect(() => {
    if (left <= 0 && !fin) finish(found.length, miss, 0);
  }, [left]);

  // Measure the free area under the HUD. On wide screens the frame is sized to the scene's own shape,
  // so the WHOLE image shows at full size (no stretching, no scrolling). On portrait phones the frame fills
  // the area and the scene covers it, panned by swiping (scrollbars hidden).
  useLayoutEffect(() => {
    const el = area.current;
    const read = () => setVp({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const ready = vp.w > 0 && vp.h > 0;
  const portrait = vp.w < vp.h;
  const fw = portrait ? vp.w : Math.min(vp.w, vp.h * RATIO);
  const fh = portrait ? vp.h : fw / RATIO;
  const W = portrait ? Math.max(fw, fh * RATIO) : fw,
    H = W / RATIO;

  // centre the view when the scene is larger than the frame (portrait)
  useLayoutEffect(() => {
    const el = box.current;
    if (el && ready) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
    }
  }, [ready, portrait]);

  const finish = (f, m, l) => {
    setFin(true);
    const all = f === N,
      pts = Math.max(0, f * 10 - m * 5 + (all ? l : 0));
    setTimeout(
      () =>
        onDone({
          score: pts,
          title: all ? "ALL BOTTLES FOUND" : "TIME EXPIRED",
          desc: all
            ? `Time bonus +${l}. Sharp eyes, Master!`
            : `${f} of ${N} bottles found.`,
        }),
      all ? 900 : 400,
    );
  };
  // mouse drag-to-pan (touch already pans natively); scrollbars stay hidden
  const down = (e) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const move = (e) => {
    const d = drag.current,
      el = box.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x,
      dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    d.moved = true;
    el.scrollLeft -= dx;
    el.scrollTop -= dy;
    d.x = e.clientX;
    d.y = e.clientY;
  };
  const up = () => {
    setTimeout(() => (drag.current = null), 0);
  };
  const tapBottle = (e, i) => {
    e.stopPropagation();
    if (fin || found.includes(i) || drag.current?.moved) return;
    const nf = [...found, i];
    setFound(nf);
    if (nf.length === N) finish(N, miss, left);
  };
  const tapScene = (e) => {
    if (fin || drag.current?.moved) return;
    const r = e.currentTarget.getBoundingClientRect(),
      id = Date.now();
    setRings((rs) => [
      ...rs,
      { id, x: e.clientX - r.left, y: e.clientY - r.top },
    ]);
    setTimeout(() => setRings((rs) => rs.filter((x) => x.id !== id)), 600);
    setMiss((m) => m + 1);
  };
  const score = found.length * 10 - miss * 5;

  const mm = String(Math.floor(Math.max(left, 0) / 60)).padStart(2, "0"),
    ss = String(Math.max(left, 0) % 60).padStart(2, "0");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 lg:gap-3">
      {/* HUD: title · found · timer · score */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[.15em] text-cream/90 sm:text-xs">
          Hunt the Master
        </p>

        <div
          className="flex items-center gap-2 rounded-2xl border border-gold/50 bg-black/45 px-3 py-1.5 backdrop-blur"
          aria-label={`Found ${found.length} of ${N}`}
        >
          <span className="font-display text-sm tracking-wider text-gold">
            ✦ FOUND {found.length} / {N}
          </span>
          <span className="flex items-center gap-1">
            {HIDDEN.map((_, i) => (
              <span
                key={i}
                className="grid h-7 w-4 place-items-center rounded-md border border-gold/30 bg-black/40 sm:h-9 sm:w-5"
              >
                <img
                  src={mini}
                  alt=""
                  draggable={false}
                  className={`h-6 transition duration-300 sm:h-8 ${found.includes(i) || fin ? "scale-110 drop-shadow-[0_0_6px_#f5b82e]" : "opacity-0"}`}
                />
              </span>
            ))}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-xl border bg-black/45 px-3 py-1.5 font-mono text-base font-bold tracking-wider sm:text-lg ${left <= 8 ? "animate-tick border-red-400/70 text-red-400" : "border-gold/50 text-gold"}`}
          >
            ⏱ {mm}:{ss}
          </span>
          <span className="rounded-xl border border-gold/50 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[.15em] sm:text-xs">
            Score <b className="font-display text-base text-gold">{score}</b>
          </span>
        </div>
      </div>

      {/* Scene frame, sits in the page layout */}
      <div
        ref={area}
        className="relative flex min-h-0 flex-1 items-center justify-center"
      >
        <div
          className="relative overflow-hidden rounded-2xl border border-gold/70 shadow-[0_18px_40px_rgba(0,0,0,.55),0_0_30px_rgba(245,184,46,.18)]"
          style={{ width: ready ? fw : 0, height: ready ? fh : 0 }}
        >
          <div
            ref={box}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerLeave={up}
            className="absolute inset-0 flex overflow-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {ready && (
              <div
                className="relative m-auto shrink-0 cursor-crosshair"
                style={{ width: W, height: H }}
                onClick={tapScene}
              >
                <img
                  src={scene}
                  alt="A heritage whisky bar"
                  draggable={false}
                  className="block h-full w-full select-none"
                />
                {HIDDEN.map(([x, y, r], i) => {
                  const f = fin || found.includes(i);
                  const pos = { left: `${x}%`, top: `${y}%` };
                  return (
                    <div key={i}>
                      <img
                        src={mini}
                        alt=""
                        draggable={false}
                        className={`pointer-events-none absolute transition ${f ? "drop-shadow-[0_0_6px_#fff]" : "opacity-80"}`}
                        style={{
                          ...pos,
                          width: `${BOTTLE_W}%`,
                          transform: `translate(-50%,-50%) rotate(${r}deg)`,
                        }}
                      />
                      {/* generous invisible tap target, because the real bottle is tiny */}
                      <button
                        type="button"
                        aria-label={`Hidden bottle ${i + 1}`}
                        onClick={(e) => tapBottle(e, i)}
                        className="absolute aspect-square w-[5%] min-w-[34px] rounded-full"
                        style={{ ...pos, transform: "translate(-50%,-50%)" }}
                      >
                        {f && (
                          <span className="absolute inset-0 animate-pop rounded-full border-2 border-green-400 bg-green-400/10 shadow-[0_0_14px_#4ade80]" />
                        )}
                      </button>
                    </div>
                  );
                })}
                {rings.map((r) => (
                  <span
                    key={r.id}
                    className="pointer-events-none absolute -ml-4 -mt-4 h-8 w-8 animate-ping rounded-full border-4 border-red-400"
                    style={{ left: r.x, top: r.y }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* floating hint (outside the scroller so it stays put) */}
          {left > TIME - 5 && !fin && (
            <p className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 animate-rise whitespace-nowrap rounded-full bg-black/70 px-4 py-1.5 text-xs tracking-wide text-cream">
              {portrait ? "Swipe to look around · " : ""}Tap the hidden bottles
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
