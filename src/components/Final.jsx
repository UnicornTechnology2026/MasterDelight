import logo from '../assets/logo.png'
import horse from '../assets/horse.png'

const ROWS = [['quiz', 'Master’s Quick Quiz'], ['blend', 'Blend the Master’s Delight'], ['hunt', 'Hunt the Master']]
export default function Final({ scores, onRestart }) {
  const total = scores.quiz + scores.blend + scores.hunt
  const title = total >= 750 ? 'GRAND MASTER' : total >= 500 ? 'MASTER BLENDER' : 'RISING MASTER'
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <img src={logo} alt="Masters Delight" className="w-36" />
      <img src={horse} alt="" className="w-32 drop-shadow-[0_0_18px_rgba(245,184,46,0.6)]" />
      <h1 className="font-display text-4xl text-gold">{title}</h1>
      <p>Journey complete. Har Master Ke Liye!</p>
      <div className="w-full rounded-xl border border-gold/40 bg-black/30 p-4">
        <div className="font-display text-5xl text-gold">{total}</div>
        {ROWS.map(([k, label]) => (
          <div key={k} className="flex justify-between border-b border-gold/20 py-1.5 text-sm"><span>{label}</span><b className="font-display text-lg text-gold">{scores[k]}</b></div>))}
      </div>
      <button className="btn-gold" onClick={onRestart}>PLAY AGAIN</button>
      <p className="text-[10px] opacity-60">Please drink responsibly. For adults of legal drinking age only.</p>
    </div>)
}
