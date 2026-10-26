import { useState } from "react";

// Hard-coded for now. Replace with a real API call later.
export const ADMIN_EMAIL = "admin@mastersdelight.com";
export const ADMIN_PASSWORD = "Admin@123";

const field =
  "w-full rounded-md border border-[#f3d28a]/60 bg-black/20 px-4 py-3 font-body text-[15px] text-white placeholder-white/50 outline-none transition focus:border-[#f3d28a] focus:ring-2 focus:ring-[#f3d28a]/40";

export default function AdminLogin({ onSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);

  const submit = (ev) => {
    ev.preventDefault();
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      onSuccess();
    } else {
      setError("Incorrect email or password");
      setShake((n) => n + 1);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <section className="w-full animate-rise rounded-2xl bg-[#d9141a] p-[3px] drop-shadow-[0_18px_40px_rgba(0,0,0,.6)]">
        <div className="rounded-[0.9rem] bg-white p-[4px]">
          <form
            onSubmit={submit}
            noValidate
            key={shake}
            className={`rounded-[0.7rem] bg-[radial-gradient(ellipse_at_30%_20%,#c0141a_0%,#a31017_55%,#8e0d13_100%)] px-5 pb-7 pt-7 shadow-[inset_0_0_40px_rgba(0,0,0,.25)] ${shake ? "animate-shake" : ""}`}
          >
            <h1 className="bg-gradient-to-b from-[#fde9a6] via-[#f2bf4a] to-[#c98a1c] bg-clip-text text-center font-head text-[clamp(24px,7.5vw,34px)] font-semibold uppercase leading-[1.1] text-transparent">
              Admin Login
            </h1>
            <p className="mt-2 text-center font-body text-sm text-white/90">
              Sign in to view player progress
            </p>

            <div className="mt-5 space-y-4">
              <input
                className={field}
                type="email"
                placeholder="Admin email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
              <div className="relative">
                <input
                  className={`${field} pr-16`}
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs font-semibold uppercase tracking-wider text-[#f3d28a]"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              {error && <p className="text-xs text-[#ffd9d9]">{error}</p>}
            </div>

            <button
              type="submit"
              className="mx-auto mt-6 grid h-12 w-full place-items-center rounded-md border-2 border-[#f3d28a] bg-gradient-to-b from-[#fde9a6] via-[#f2bf4a] to-[#c98a1c] font-head text-xl font-semibold uppercase tracking-wider text-[#5a0a0e] shadow-[0_6px_16px_rgba(0,0,0,.45)] transition hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onBack}
              className="mx-auto mt-4 block font-body text-xs text-white/80 underline underline-offset-2"
            >
              ← Back to game
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
