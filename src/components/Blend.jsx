import { useEffect, useState } from 'react'
import Bottle from './Bottle'
import { INGREDIENTS } from '../data'
import { shuffle } from '../lib/shuffle'

const TIME = 20, BONUS_AT = 10, NEED = INGREDIENTS.filter((i) => i.ok).length
const STATUS = ['Drag or tap ingredients into the bottle', '1 of 3 blended · add the next', '2 of 3 blended · one more to go', 'Master’s blend achieved']

export default function Blend({ onDone }) {
  const [order] = useState(() => shuffle(INGREDIENTS))
  const [got, setGot] = useState([])
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(TIME)
  const [msg, setMsg] = useState(null)
  const [shake, setShake] = useState(null)
  const [over, setOver] = useState(false)
  const [ended, setEnded] = useState(false)
  const won = got.length === NEED

  useEffect(() => {
    if (won || ended) return
    const t = setInterval(() => setLeft((l) => l - 1), 1000)
    return () => clearInterval(t)
  }, [won, ended])
  useEffect(() => {
    if (left <= 0 && !won && !ended) { setEnded(true); onDone({ score: Math.max(0, score), title: 'TIME EXPIRED', desc: 'Mastery requires patience and precision.' }) }
  }, [left])

  const flash = (text, ok) => { setMsg({ text, ok }); setTimeout(() => setMsg(null), 1500) }
  const attempt = (it) => {
    if (won || ended || got.includes(it.id)) return
    if (it.ok) {
      const next = [...got, it.id], s = score + 100
      setGot(next); setScore(s); flash(`${it.name} added! +100`, true)
      if (next.length === NEED) {
        const bonus = left >= BONUS_AT ? 50 : 0
        setTimeout(() => onDone({ score: s + bonus, title: 'BLEND COMPLETE', desc: bonus ? 'Speed bonus +50. A true master blender!' : 'Beautifully blended.' }), 900)
      }
    } else {
      setScore((s) => s - 25); flash(`${it.name} is not in this blend. −25`, false)
      setShake(it.id); setTimeout(() => setShake(null), 400)
    }
  }
  const drop = (e) => { e.preventDefault(); setOver(false); const it = INGREDIENTS.find((i) => i.id === e.dataTransfer.getData('text/plain')); if (it) attempt(it) }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm">Find the {NEED} genuine ingredients. Drag or tap them into the bottle.</p>
      <div className="flex items-end gap-6">
        <div><p className="text-xs opacity-70">Score</p><b className={`font-display text-3xl ${score < 0 ? 'text-red-400' : 'text-gold'}`}>{score}</b></div>
        <div><p className="text-xs opacity-70">Time</p><b className={`font-display text-3xl ${left <= 5 ? 'text-red-400' : 'text-gold'}`}>{Math.max(left, 0)}s</b></div>
      </div>
      <p className={`h-5 text-sm ${msg?.ok === false ? 'text-red-300' : 'text-gold'}`}>{msg?.text}</p>
      <div className="grid w-full grid-cols-[1fr_7rem] items-center gap-3">
        <div className="grid gap-2 text-left">
          {order.map((it) => {
            const done = got.includes(it.id)
            return (
              <div key={it.id} draggable={!done} onDragStart={(e) => e.dataTransfer.setData('text/plain', it.id)} onClick={() => attempt(it)}
                className={`flex cursor-grab items-center justify-between rounded-lg border-2 px-3 py-2 transition ${done ? 'pointer-events-none border-green-400/50 opacity-40' : shake === it.id ? 'animate-pulse border-red-400 bg-red-600/40' : 'border-gold/60 bg-black/25 active:bg-gold/20'}`}>
                <span><b className="block text-base">{it.name}</b><span className="text-xs opacity-70">{it.note}</span></span>
                <span className={`grid h-5 w-5 place-items-center rounded-full border text-xs ${done ? 'border-green-400 bg-green-500 text-maroon' : 'border-gold/40'}`}>{done ? '✓' : ''}</span>
              </div>)
          })}
        </div>
        <div className="flex flex-col items-center gap-2" onDragEnter={() => setOver(true)} onDragLeave={() => setOver(false)}>
          <Bottle grey fill={got.length / NEED} glow={over} onDrop={drop} className="w-full" />
          <p className="text-[11px] leading-tight opacity-70">{STATUS[got.length]}</p>
        </div>
      </div>
    </div>)
}
