import logo from "../assets/logo.png";
import horse from "../assets/horse.png";
import tagline from "../assets/tagline.png";

const CARDS = [
  ["01", "Master’s Quick Quiz"],
  ["02", "Blend the Master’s Delight"],
  ["03", "Hunt the Master"],
];
export default function Welcome({ onStart }) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <img
        src={horse}
        alt=""
        className="pointer-events-none absolute -right-16 bottom-0 w-72 opacity-90"
      />
      <img
        src={logo}
        alt="Masters Delight"
        className="relative w-52 drop-shadow-xl"
      />
      <img src={tagline} alt="Har Master Ke Liye" className="relative w-48" />
      <h1 className="relative font-display text-4xl tracking-wide text-gold">
        THE MASTER’S JOURNEY
      </h1>
      <p className="relative">
        Three levels. One true master. Show how well you know Masters Delight.
      </p>
      <div className="relative flex w-full gap-2">
        {CARDS.map(([n, t]) => (
          <div
            key={n}
            className="flex-1 rounded-xl border border-gold/40 bg-black/25 p-2 text-xs"
          >
            <b className="block font-display text-2xl text-gold">{n}</b>
            {t}
          </div>
        ))}
      </div>
      <button className="btn-gold relative" onClick={onStart}>
        START THE JOURNEY
      </button>
      <p className="relative text-[10px] opacity-60">
        Please drink responsibly.
      </p>
    </div>
  );
}
