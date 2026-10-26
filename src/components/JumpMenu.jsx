import { useEffect, useRef, useState } from "react";

// [screen key, small label, title]
const PAGES = [
  ["welcome", "Start", "Welcome"],
  ["quiz", "Level 01", "Master’s Quick Quiz"],
  ["blend", "Level 02", "Blend the Master’s Delight"],
  ["hunt", "Level 03", "Hunt the Master"],
  ["final", "Result", "Final score"],
];

const Lock = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

// Dropdown to jump straight to any page. Levels stay locked until the age gate on the Welcome screen is passed.
export default function JumpMenu({ current, aged, onJump, align = "left" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const down = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const key = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const go = (key) => {
    setOpen(false);
    onJump(key);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="btn-ghost flex items-center gap-1.5 bg-black/30 !px-3 !py-1.5 text-sm"
      >
        JUMP
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          className={`absolute top-full z-[60] mt-2 w-64 animate-rise overflow-hidden rounded-xl border border-gold/60 bg-maroon/95 text-left shadow-[0_14px_40px_rgba(0,0,0,.6)] backdrop-blur ${align === "right" ? "right-0" : "left-0"}`}
        >
          {PAGES.map(([key, label, title]) => {
            const locked = key !== "welcome" && !aged;
            const here = key === current;
            return (
              <li
                key={key}
                role="none"
                className="border-b border-gold/15 last:border-0"
              >
                <button
                  role="menuitem"
                  type="button"
                  disabled={locked}
                  onClick={() => go(key)}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${here ? "bg-gold/15" : "hover:bg-gold/10"} ${locked ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border font-display text-xs ${here ? "border-gold bg-gold text-maroon" : "border-gold/50 text-gold"}`}
                  >
                    {locked ? (
                      <Lock />
                    ) : here ? (
                      "●"
                    ) : label.startsWith("Level") ? (
                      label.slice(-2)
                    ) : key === "final" ? (
                      "★"
                    ) : (
                      "⌂"
                    )}
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block text-[10px] uppercase tracking-[.2em] text-gold/80">
                      {label}
                    </span>
                    <span className="block truncate text-[15px] text-cream">
                      {title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          {!aged && (
            <li className="bg-black/30 px-3 py-2 text-[11px] leading-snug opacity-80">
              Confirm your legal drinking age on the Welcome screen to unlock
              the levels.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
