import { useState } from "react";

const field =
  "w-full rounded-md border border-[#f3d28a]/60 bg-black/20 px-4 py-3 font-body text-[15px] text-white placeholder-white/50 outline-none transition focus:border-[#f3d28a] focus:ring-2 focus:ring-[#f3d28a]/40";

export default function Login({ onSubmit, initial }) {
  const [name, setName] = useState(initial?.name || "");
  const [city, setCity] = useState(initial?.city || "");
  const [mobile, setMobile] = useState(initial?.mobile || "");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (name.trim().length < 2) e.name = "Please enter your name";
    if (city.trim().length < 2) e.city = "Please enter your city";
    if (!/^[6-9]\d{9}$/.test(mobile))
      e.mobile = "Enter a valid 10-digit mobile number";
    if (!agree) e.agree = "Please accept the privacy policy to continue";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({ name: name.trim(), city: city.trim(), mobile });
  };

  const Err = ({ k }) =>
    errors[k] ? (
      <p className="mt-1 text-xs text-[#ffd9d9]">{errors[k]}</p>
    ) : null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <section className="w-full animate-rise rounded-2xl bg-[#d9141a] p-[3px] drop-shadow-[0_18px_40px_rgba(0,0,0,.6)]">
        <div className="rounded-[0.9rem] bg-white p-[4px]">
          <form
            onSubmit={submit}
            noValidate
            className="rounded-[0.7rem] bg-[radial-gradient(ellipse_at_30%_20%,#c0141a_0%,#a31017_55%,#8e0d13_100%)] px-5 pb-7 pt-7 shadow-[inset_0_0_40px_rgba(0,0,0,.25)]"
          >
            <h1 className="bg-gradient-to-b from-[#fde9a6] via-[#f2bf4a] to-[#c98a1c] bg-clip-text text-center font-head text-[clamp(24px,7.5vw,34px)] font-semibold uppercase leading-[1.1] text-transparent">
              Welcome, Master
            </h1>
            <p className="mt-2 text-center font-body text-sm text-white/90">
              Tell us a little about you to begin
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <input
                  className={field}
                  placeholder="Name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Err k="name" />
              </div>
              <div>
                <input
                  className={field}
                  placeholder="City"
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Err k="city" />
              </div>
              <div>
                <div className="flex gap-2">
                  <span className="grid place-items-center rounded-md border border-[#f3d28a]/60 bg-black/20 px-3 font-body text-[15px] text-white">
                    +91
                  </span>
                  <input
                    className={field}
                    placeholder="Mobile number"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
                <Err k="mobile" />
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-3 font-body text-[13px] leading-snug text-white/95">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#f2bf4a]"
                  />
                  <span>
                    I agree to the{" "}
                    <a
                      href="#privacy"
                      onClick={(e) => e.preventDefault()}
                      className="font-semibold text-[#f3d28a] underline underline-offset-2"
                    >
                      Privacy Policy
                    </a>{" "}
                    and terms &amp; conditions.
                  </span>
                </label>
                <Err k="agree" />
              </div>
            </div>

            <button
              type="submit"
              className="mx-auto mt-6 grid h-12 w-full place-items-center rounded-md border-2 border-[#f3d28a] bg-gradient-to-b from-[#fde9a6] via-[#f2bf4a] to-[#c98a1c] font-head text-xl font-semibold uppercase tracking-wider text-[#5a0a0e] shadow-[0_6px_16px_rgba(0,0,0,.45)] transition hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white"
            >
              Get OTP
            </button>
          </form>
        </div>
      </section>
      <p className="text-[10px] opacity-60">
        Please drink responsibly. For adults of legal drinking age only.
      </p>
    </div>
  );
}
