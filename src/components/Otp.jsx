import { useEffect, useRef, useState } from "react";

const DEMO_OTP = "123456"; // demo only: replace with real OTP verification later
const LEN = 6;

export default function Otp({ mobile, onVerified, onBack }) {
  const [digits, setDigits] = useState(Array(LEN).fill(""));
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [secs, setSecs] = useState(30);
  const refs = useRef([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const onChange = (i, e) => {
    const v = e.target.value.replace(/\D/g, "");
    const next = [...digits];
    if (!v) {
      next[i] = "";
      setDigits(next);
      return;
    }
    const chars = v.split("").slice(0, LEN - i); // also handles paste / autofill
    chars.forEach((c, k) => (next[i + k] = c));
    setDigits(next);
    setError("");
    refs.current[Math.min(i + chars.length, LEN - 1)]?.focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      const next = [...digits];
      next[i - 1] = "";
      setDigits(next);
      refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LEN - 1) refs.current[i + 1]?.focus();
  };

  const submit = (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < LEN) {
      setError("Please enter the 6-digit OTP");
      setShake((n) => n + 1);
      return;
    }
    if (code !== DEMO_OTP) {
      setError("Incorrect OTP. Please try again.");
      setShake((n) => n + 1);
      setDigits(Array(LEN).fill(""));
      refs.current[0]?.focus();
      return;
    }
    onVerified();
  };

  const resend = () => {
    setSecs(30);
    setDigits(Array(LEN).fill(""));
    setError("");
    refs.current[0]?.focus();
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <section className="w-full animate-rise rounded-2xl bg-[#d9141a] p-[3px] drop-shadow-[0_18px_40px_rgba(0,0,0,.6)]">
        <div className="rounded-[0.9rem] bg-white p-[4px]">
          <form
            onSubmit={submit}
            className="rounded-[0.7rem] bg-[radial-gradient(ellipse_at_30%_20%,#c0141a_0%,#a31017_55%,#8e0d13_100%)] px-5 pb-7 pt-7 text-center shadow-[inset_0_0_40px_rgba(0,0,0,.25)]"
          >
            <h1 className="bg-gradient-to-b from-[#fde9a6] via-[#f2bf4a] to-[#c98a1c] bg-clip-text font-head text-[clamp(24px,7.5vw,34px)] font-semibold uppercase leading-[1.1] text-transparent">
              Verify OTP
            </h1>
            <p className="mt-2 font-body text-sm text-white/90">
              Enter the 6-digit code sent to
              <br />
              <span className="font-semibold text-[#f3d28a]">
                +91 {mobile}
              </span>{" "}
              <button
                type="button"
                onClick={onBack}
                className="ml-1 text-xs underline underline-offset-2 text-white/80"
              >
                Change
              </button>
            </p>

            <div
              key={shake}
              className={`mt-5 flex justify-center gap-2 ${shake ? "animate-shake" : ""}`}
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (refs.current[i] = el)}
                  value={d}
                  onChange={(e) => onChange(i, e)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={LEN}
                  aria-label={`OTP digit ${i + 1}`}
                  className="h-12 w-10 rounded-md border border-[#f3d28a]/60 bg-black/25 text-center font-body text-xl font-semibold text-white outline-none transition focus:border-[#f3d28a] focus:ring-2 focus:ring-[#f3d28a]/40"
                />
              ))}
            </div>

            {error && <p className="mt-3 text-xs text-[#ffd9d9]">{error}</p>}

            <p className="mt-4 font-body text-[11px] uppercase tracking-[.15em] text-white/60">
              Demo OTP: 123456
            </p>

            <button
              type="submit"
              className="mx-auto mt-5 grid h-12 w-full place-items-center rounded-md border-2 border-[#f3d28a] bg-gradient-to-b from-[#fde9a6] via-[#f2bf4a] to-[#c98a1c] font-head text-xl font-semibold uppercase tracking-wider text-[#5a0a0e] shadow-[0_6px_16px_rgba(0,0,0,.45)] transition hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white"
            >
              Verify &amp; Continue
            </button>

            <p className="mt-4 font-body text-xs text-white/80">
              {secs > 0 ? (
                <>Resend OTP in {secs}s</>
              ) : (
                <button
                  type="button"
                  onClick={resend}
                  className="font-semibold text-[#f3d28a] underline underline-offset-2"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </form>
        </div>
      </section>
      <p className="text-[10px] opacity-60">
        Please drink responsibly. For adults of legal drinking age only.
      </p>
    </div>
  );
}
