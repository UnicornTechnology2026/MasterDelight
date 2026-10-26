import logo from "../assets/logo.png";

// Small helper so each block rises in one after the other
const delay = (ms) => ({ animationDelay: `${ms}ms` });

export default function Welcome({ onStart, user }) {
  const first = user?.name?.trim().split(" ")[0];
  return (
    <div className="-mt-24 flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(10px,2.6vh,24px)] overflow-hidden py-2 text-center">
      <img
        src={logo}
        alt="Masters Delight"
        className="w-auto animate-rise drop-shadow-[0_6px_18px_rgba(0,0,0,.7)] h-[clamp(52px,10vh,100px)]"
      />

      {/* Top pill */}
      <div
        className="inline-flex animate-rise items-center gap-2.5 rounded-full border border-[#f3d28a]/45 bg-black/35 px-5 py-[clamp(6px,1.2vh,10px)] font-body text-[clamp(9px,1.5vh,11px)] font-semibold uppercase tracking-[.25em] text-[#f3d28a] backdrop-blur"
        style={delay(100)}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5l-2 5-5 2 2-5z" />
        </svg>
        <span className="max-w-[14rem] truncate">
          {first ? `Welcome, ${first}` : "Welcome to the Experience"}
        </span>
      </div>

      {/* Headline */}
      <h1
        className="max-w-[15ch] animate-rise font-head text-[clamp(26px,min(9.4vw,8vh),76px)] font-bold uppercase leading-[1.15] tracking-[.09em] text-[#fff8e6] [text-shadow:0_4px_24px_rgba(0,0,0,.6)]"
        style={delay(200)}
      >
        The Master’s Journey
      </h1>

      {/* Info + button */}
      <div
        className="flex w-full animate-rise flex-wrap items-center justify-center gap-x-10 gap-y-[clamp(10px,2vh,24px)]"
        style={delay(350)}
      >
        <div className="flex max-w-[23rem] items-center gap-4 text-left">
          <div className="grid h-[clamp(46px,8vh,70px)] w-[clamp(46px,8vh,70px)] shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#f7dd97] to-[#c99a2e] shadow-[0_0_24px_rgba(245,184,46,.35)]">
            <svg
              viewBox="0 0 24 24"
              className="h-1/2 w-1/2"
              fill="none"
              stroke="#2a0a0a"
              strokeWidth="1.9"
              strokeLinejoin="round"
            >
              <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
            </svg>
          </div>
          <div className="text-white">
            <b className="mb-0.5 block font-head text-[clamp(14px,2.4vh,18px)] font-bold">
              Three Levels, One True Master
            </b>
            <small className="block font-body text-[clamp(11px,1.8vh,13px)] leading-snug text-white/90">
              Quiz, Blend and Hunt: show how well you know Masters Delight
            </small>
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="btn-shine relative h-[clamp(46px,8vh,64px)] min-w-[240px] overflow-hidden rounded-full bg-gradient-to-br from-[#f4dd9a] via-[#d8ab45] to-[#b98a22] px-8 font-body text-[clamp(13px,2vh,16px)] font-semibold uppercase tracking-[.14em] text-[#1f0a0a] shadow-[0_10px_30px_rgba(245,184,46,.35)] transition hover:shadow-[0_12px_38px_rgba(245,184,46,.55)] active:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-white"
        >
          Begin the Journey
        </button>
      </div>
    </div>
  );
}
