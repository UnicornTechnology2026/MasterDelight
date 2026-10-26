import horse from '../assets/horse.png'
export default function LevelComplete({ result, onNext, last }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <img src={horse} alt="" className="w-32 drop-shadow-[0_0_18px_rgba(245,184,46,0.6)]" />
      <h2 className="font-display text-3xl text-gold">{result.title}</h2>
      <div className="font-display text-5xl text-gold">{result.score} pts</div>
      <p>{result.desc}</p>
      <button className="btn-gold" onClick={onNext}>{last ? 'SEE MY RESULT' : 'CONTINUE TO NEXT LEVEL'}</button>
    </div>)
}
