export default function Header({ level, total, jump }) {
  return (
    <div className="relative z-30 flex items-center justify-between gap-2 pb-2 text-sm">
      <span className="font-display tracking-wide text-gold">
        LEVEL 0{level} / 03
      </span>
      {jump}
      <span>
        Total <b className="font-display text-xl text-gold">{total}</b>
      </span>
    </div>
  );
}
