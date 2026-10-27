import { useEffect, useRef, useState } from "react";
import Bottle from "./Bottle";
import bottleImg from "../assets/bottle.jpg";
import logo from "../assets/logo.png";
import horse from "../assets/horse.png";
import tagline from "../assets/tagline.png";
import scene from "../assets/scene.jpg";
import mini from "../assets/mini-bottle.png";
import ageBadge from "../assets/age-badge.png";
import desktopBg from "../assets/desktop.png";
import mobileBg from "../assets/mobile.png";

const ASSETS = [
  bottleImg,
  logo,
  horse,
  tagline,
  scene,
  mini,
  desktopBg,
  mobileBg,
];
const MIN_MS = 2800; // the bottle never fills faster than this, so the animation is always seen
const HOLD_MS = 800; // pause on the full bottle before moving on
const MSGS = [
  "Selecting imported Scotch malts…",
  "Adding select Indian malts…",
  "Smoothing with grain spirit…",
  "Maturing to perfection…",
  "Ready, Master!",
];

// Loading screen: the grey Masters Delight bottle fills with colour from the bottom as the game's images load.
export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0); // 0 -> 1
  const done = useRef(onDone);
  done.current = onDone; // always call the latest callback without restarting the loader

  useEffect(() => {
    let alive = true,
      loaded = 0,
      raf,
      hold;
    const t0 = performance.now();
    ASSETS.forEach((src) => {
      const im = new Image();
      im.onload = im.onerror = () => {
        loaded++;
      };
      im.src = src;
    });
    const tick = (now) => {
      if (!alive) return;
      const real = loaded / ASSETS.length;
      const t = Math.min((now - t0) / MIN_MS, 1);
      const p = Math.min(real, 1 - Math.pow(1 - t, 2)); // real progress, but never faster than the eased timer
      setPct(p);
      if (p >= 1) {
        hold = setTimeout(() => alive && done.current(), HOLD_MS);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(hold);
    };
  }, []);

  const msg =
    MSGS[pct >= 1 ? MSGS.length - 1 : Math.floor(pct * (MSGS.length - 1))];
  const shown = Math.round(pct * 100);

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-3 text-center"
      role="progressbar"
      aria-label="Loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={shown}
    >
      <div
        className="transition-[filter] duration-300"
        style={{
          filter: `drop-shadow(0 0 ${6 + pct * 26}px rgba(245,184,46,${0.25 + pct * 0.55}))`,
        }}
      >
        <Bottle grey fill={pct} className="h-[70vh] max-h-[420px] w-auto" />
      </div>
      <p key={msg} className="h-5 animate-rise text-sm">
        {msg}
      </p>

      <p className="text-[10px] opacity-60">
        Please drink responsibly. For adults of legal drinking age only.
      </p>
    </div>
  );
}
