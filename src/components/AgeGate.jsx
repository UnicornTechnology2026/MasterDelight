import { useEffect, useRef } from "react";

// Shown right after the loader. Click "Enter" or press the Enter key to continue.
export default function AgeGate({ onEnter }) {
  const cb = useRef(onEnter);
  cb.current = onEnter;
  const used = useRef(false);
  const go = () => {
    if (used.current) return;
    used.current = true;
    cb.current();
  }; // only ever fires once

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" && !e.repeat) {
        e.preventDefault();
        go();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <div className="w-full animate-rise drop-shadow-[0_18px_40px_rgba(0,0,0,.6)]">
        <section
          aria-labelledby="age-title"
          className="age-frame age-edge p-[2px]"
        >
          <div
            className="age-frame age-panel px-5 pb-12 pt-10 text-center"
            style={{ "--c": "23px" }}
          >
            <h1
              id="age-title"
              className="font-head text-[clamp(19px,6vw,28px)] font-medium leading-[1.25] tracking-[.03em] text-[#f3d28a]"
            >
              I’M OF
              <br />
              LEGAL DRINKING AGE
            </h1>
            <p className="mx-auto mt-5 max-w-[19rem] font-body text-[15px] leading-relaxed text-white/95">
              By entering this site, you agree to our terms &amp; conditions,
              privacy policy and other directives.
            </p>
            <button
              type="button"
              autoFocus
              onClick={go}
              className="mx-auto mt-7 grid h-14 w-48 place-items-center rounded-full border border-[#f3d28a]/70 font-head text-2xl font-semibold text-[#d8ad5a] transition hover:bg-[#f3d28a]/10 hover:shadow-[0_0_22px_rgba(243,210,138,.35)] active:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white"
            >
              Enter
            </button>
            <p className="mt-3 hidden font-body text-[11px] uppercase tracking-[.2em] text-white/60 [@media(hover:hover)]:block">
              or press Enter ↵
            </p>
          </div>
        </section>
      </div>
      <p className="text-[10px] opacity-60">
        Please drink responsibly. For adults of legal drinking age only.
      </p>
    </div>
  );
}
