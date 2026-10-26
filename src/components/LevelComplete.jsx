import horse from "../assets/horse.png";

const LEVELS = 3;

export default function LevelComplete({ result, onNext, last, level, total }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* Gold frame (same family as the Quiz / Blend / Hunt frames) */}
      <section className="w-full max-w-xl animate-rise rounded-3xl bg-gradient-to-b from-[#fde9a6] via-gold to-[#a8680f] p-[2px] shadow-[0_18px_40px_rgba(0,0,0,.55),0_0_40px_rgba(245,184,46,.25)]">
        <div className="relative overflow-hidden rounded-[1.4rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(122,12,18,.95),rgba(30,3,6,.96)_75%)] px-5 pb-6 pt-6 text-center backdrop-blur sm:px-10 sm:pb-8 sm:pt-8">
          <h2 className="mt-1 bg-gradient-to-r from-[#fff1b8] via-[#f0cf7a] to-[#d8a63a] bg-clip-text font-display text-3xl uppercase tracking-wide text-transparent sm:text-4xl">
            {result.title}
          </h2>

          <div className="mx-auto mt-3 flex w-40 items-center gap-2 sm:w-56">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/70" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/70" />
          </div>

          <p className="mx-auto mt-3 max-w-sm font-body text-sm text-white/90 sm:text-base">
            {result.desc}
          </p>

          {/* Score tiles */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-gold/50 bg-black/40 px-3 py-3">
              <p className="text-[10px] uppercase tracking-[.2em] text-gold/80">
                This level
              </p>
              <p className="font-display text-4xl leading-none text-gold sm:text-5xl">
                {result.score}
                <span className="ml-1 text-base text-gold/70">pts</span>
              </p>
            </div>
            <div className="rounded-2xl border border-gold/30 bg-black/30 px-3 py-3">
              <p className="text-[10px] uppercase tracking-[.2em] text-white/60">
                Total score
              </p>
              <p className="font-display text-4xl leading-none text-white sm:text-5xl">
                {total}
                <span className="ml-1 text-base text-white/60">pts</span>
              </p>
            </div>
          </div>

          <button className="btn-gold mt-6 w-full" onClick={onNext}>
            {last ? "SEE MY RESULT" : "CONTINUE TO NEXT LEVEL"}
          </button>
        </div>
      </section>
    </div>
  );
}
