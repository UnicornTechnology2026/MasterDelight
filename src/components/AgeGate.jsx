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
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      {/* Rectangle badge: red outer edge > white ring > deep red panel */}
      <section
        aria-labelledby="age-title"
        className="w-full animate-rise rounded-2xl bg-[#d9141a] p-[3px] drop-shadow-[0_18px_40px_rgba(0,0,0,.6)]"
      >
        <div className="rounded-[0.9rem] bg-white p-[4px]">
          <div className="rounded-[0.7rem] bg-[radial-gradient(ellipse_at_30%_20%,#c0141a_0%,#a31017_55%,#8e0d13_100%)] px-5 pb-8 pt-8 text-center shadow-[inset_0_0_40px_rgba(0,0,0,.25)]">
            <h1
              id="age-title"
              className="bg-gradient-to-b from-[#fde9a6] via-[#f2bf4a] to-[#c98a1c] bg-clip-text font-head text-[clamp(26px,8.5vw,40px)] font-semibold uppercase leading-[1.1] text-transparent drop-shadow-[0_2px_2px_rgba(60,0,0,.55)]"
            >
              I’m of
              <br />
              Legal Drinking Age
            </h1>
            <p className="mx-auto mt-5 max-w-[21rem] font-body text-[clamp(14px,4.2vw,18px)] leading-snug text-white">
              By entering this site, you agree to our terms &amp; conditions,
              privacy policy and other directives.
            </p>

            {/* Enter button inside the box */}
            <button
              type="button"
              autoFocus
              onClick={go}
              className="mx-auto mt-6 grid h-12 w-44 place-items-center rounded-md border-2 border-[#f3d28a] bg-gradient-to-b from-[#fde9a6] via-[#f2bf4a] to-[#c98a1c] font-head text-xl font-semibold uppercase tracking-wider text-[#5a0a0e] shadow-[0_6px_16px_rgba(0,0,0,.45)] transition hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white"
            >
              Enter
            </button>
          </div>
        </div>
      </section>

      <p className="text-[10px] opacity-60">
        Please drink responsibly. For adults of legal drinking age only.
      </p>
    </div>
  );
}
