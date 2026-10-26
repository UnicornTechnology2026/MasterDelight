import { useEffect, useLayoutEffect, useRef, useState } from "react";
import scene from "../assets/scene.jpg";
import mini from "../assets/mini-bottle.png";
import { HIDDEN } from "../data";

const TIME = 40,
  N = HIDDEN.length;
const RATIO = 1376 / 768; // width / height of scene.jpg
const ZOOM = 1.8; // extra magnification when the zoom button is on
const BOTTLE_W = 1.0; // hidden bottle width as % of scene width (same size as the real bottles)

export default function Hunt({ onDone, jump }) {
  const [found, setFound] = useState([]);
  const [miss, setMiss] = useState(0);
  const [left, setLeft] = useState(TIME);
  const [rings, setRings] = useState([]);
  const [fin, setFin] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const box = useRef(null);

  useEffect(() => {
    if (fin) return;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [fin]);
  useEffect(() => {
    if (left <= 0 && !fin) finish(found.length, miss, 0);
  }, [left]);

  // Measure the viewport so the scene always COVERS the whole screen (full size, no empty bars).
  useLayoutEffect(() => {
    const el = box.current;
    const read = () => setVp({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const ready = vp.w > 0;
  const base = Math.max(vp.w, vp.h * RATIO);
  const W = base * (zoomed ? ZOOM : 1),
    H = W / RATIO;

  // centre the view on first measure and whenever zoom changes
  useLayoutEffect(() => {
    const el = box.current;
    if (el && ready) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
    }
  }, [zoomed, ready]);

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
  const tapBottle = (e, i) => {
    e.stopPropagation();
    if (fin || found.includes(i)) return;
    const nf = [...found, i];
    setFound(nf);
    if (nf.length === N) finish(N, miss, left);
  };
  const tapScene = (e) => {
    if (fin) return;
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

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-maroon"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* HUD */}
      <div className="relative z-20 flex items-center justify-between gap-2 border-b border-gold/40 bg-black/60 px-3 py-2">
        {jump}
        <div
          className="flex items-center gap-1"
          aria-label={`Found ${found.length} of ${N}`}
        >
          {HIDDEN.map((_, i) => (
            <img
              key={i}
              src={mini}
              alt=""
              draggable={false}
              className={`h-8 transition duration-300 ${found.includes(i) || fin ? "scale-110 drop-shadow-[0_0_6px_#f5b82e]" : "opacity-30 grayscale"}`}
            />
          ))}
        </div>
        <div className="text-center leading-none">
          <p className="text-[10px] uppercase tracking-[.2em] opacity-70">
            Time
          </p>
          <b
            className={`font-display text-2xl ${left <= 8 ? "animate-tick text-red-400" : "text-gold"}`}
          >
            {Math.max(left, 0)}s
          </b>
        </div>
        <div className="text-right leading-none">
          <p className="text-[10px] uppercase tracking-[.2em] opacity-70">
            Score
          </p>
          <b className="font-display text-2xl text-gold">{score}</b>
        </div>
      </div>

      {/* Full-screen scene: drag / swipe to look around */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={box}
          className="absolute inset-0 overflow-auto overscroll-contain [scrollbar-width:thin]"
        >
          {ready && (
            <div
              className="relative cursor-crosshair"
              style={{ width: W, height: H }}
              onClick={tapScene}
            >
              <img
                src={scene}
                alt="A heritage whisky bar"
                draggable={false}
                className="block h-full w-full"
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

        {/* floating hint + zoom (outside the scroller so they stay put) */}
        {left > TIME - 5 && !fin && (
          <p className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 animate-rise whitespace-nowrap rounded-full bg-black/70 px-4 py-1.5 text-xs tracking-wide text-cream">
            Drag to look around · tap the hidden bottles
          </p>
        )}
        <button
          onClick={() => setZoomed((z) => !z)}
          aria-label={zoomed ? "Zoom out" : "Zoom in"}
          className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full border-2 border-gold bg-maroon/85 font-display text-2xl text-gold shadow-lg active:scale-90"
        >
          {zoomed ? "−" : "+"}
        </button>
      </div>
    </div>
  );
}
