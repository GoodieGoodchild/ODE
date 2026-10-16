import { useState, useEffect } from 'react'
import { MessageCircle, RefreshCw, ChevronLeft, ChevronRight, Sparkles, Users } from 'lucide-react'
import { getPromptsForTable, getInterestsByIds } from '../data/interests'

export default function TableTalk({ diners = [], compact = false }) {
  const [prompts, setPrompts] = useState([])
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [flipped, setFlipped] = useState(false)

  const allInterests = diners.flatMap(d => d.interests || [])
  const uniqueSharedInterests = [...new Set(
    allInterests.filter(i => allInterests.filter(x => x === i).length > 1)
  )]
  const sharedInterestDetails = getInterestsByIds(uniqueSharedInterests).slice(0, 4)

  useEffect(() => {
    setPrompts(getPromptsForTable(diners.map(d => d.interests || []), 10))
    setCurrent(0)
    setRevealed(false)
  }, [diners.length])

  const next = () => {
    setFlipped(true)
    setTimeout(() => {
      setCurrent(c => (c + 1) % prompts.length)
      setFlipped(false)
    }, 200)
  }

  const prev = () => {
    setFlipped(true)
    setTimeout(() => {
      setCurrent(c => (c - 1 + prompts.length) % prompts.length)
      setFlipped(false)
    }, 200)
  }

  const reshuffle = () => {
    setPrompts(getPromptsForTable(diners.map(d => d.interests || []), 10))
    setCurrent(0)
    setRevealed(false)
  }

  if (prompts.length === 0) return null

  const prompt = prompts[current]

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-forest-500 to-forest-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle size={16} className="text-sage" />
          <span className="text-sm font-semibold text-sage">TableTalk</span>
          <span className="ml-auto text-xs text-white/50">{current + 1} / {prompts.length}</span>
        </div>
        <p className="text-white font-medium text-sm leading-relaxed mb-3">"{prompt.question}"</p>
        <div className="flex items-center justify-between">
          <button onClick={prev} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"><ChevronLeft size={14} /></button>
          <button onClick={next} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-semibold transition-colors">Next question</button>
          <button onClick={next} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"><ChevronRight size={14} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-500 to-forest-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-display font-bold text-base">TableTalk</h3>
              <p className="text-white/70 text-xs">Conversation starters for tonight</p>
            </div>
          </div>
          <button onClick={reshuffle} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors">
            <RefreshCw size={12} /> Reshuffle
          </button>
        </div>

        {/* Shared interests */}
        {sharedInterestDetails.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-white/60 text-xs flex items-center gap-1 mr-1"><Sparkles size={11} /> Matched to:</span>
            {sharedInterestDetails.map(i => (
              <span key={i.id} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {i.emoji} {i.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card */}
      <div className="px-6 py-6">
        {!revealed ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={28} className="text-forest-500" />
            </div>
            <h4 className="font-display font-bold text-charcoal text-lg mb-2">Ready to connect?</h4>
            <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto">
              We've matched conversation starters to this table's shared interests. Tap to reveal your first question.
            </p>
            <button onClick={() => setRevealed(true)}
              className="px-6 py-3 bg-forest-500 text-white font-semibold rounded-full hover:bg-forest-600 transition-colors">
              Reveal First Question ✨
            </button>
          </div>
        ) : (
          <div>
            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mb-5">
              {prompts.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-forest-500 w-4' : 'bg-gray-200 hover:bg-gray-300'}`} />
              ))}
            </div>

            {/* Question card */}
            <div className={`transition-opacity duration-200 ${flipped ? 'opacity-0' : 'opacity-100'}`}>
              <div className="bg-gradient-to-br from-forest-50 to-sage/20 rounded-2xl p-6 border border-forest-100 mb-4 min-h-[120px] flex items-center justify-center">
                <p className="text-charcoal font-display font-medium text-xl text-center leading-relaxed">
                  "{prompt.question}"
                </p>
              </div>
              {prompt.tags.length > 0 && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-xs text-gray-400">Based on:</span>
                  {getInterestsByIds(prompt.tags).map(i => (
                    <span key={i.id} className="text-xs text-forest-600 bg-forest-50 px-2 py-0.5 rounded-full font-medium">{i.emoji} {i.label}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button onClick={prev} className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-100 transition-colors">
                <ChevronLeft size={15} /> Prev
              </button>
              <span className="text-xs text-gray-400 font-medium">{current + 1} of {prompts.length}</span>
              <button onClick={next} className="flex items-center gap-1.5 px-4 py-2 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors">
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Diner interest chips */}
      {diners.length > 0 && (
        <div className="px-6 pb-5 border-t border-gray-50 pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Users size={11} /> At this table
          </p>
          <div className="space-y-2">
            {diners.map((d, i) => {
              const interests = getInterestsByIds(d.interests || []).slice(0, 4)
              return (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  <div className="w-7 h-7 rounded-full bg-forest-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {d.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-20 truncate">{d.name?.split(' ')[0]}</span>
                  {interests.map(interest => (
                    <span key={interest.id} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
                      {interest.emoji} {interest.label}
                    </span>
                  ))}
                  {(d.interests || []).length > 4 && (
                    <span className="text-xs text-gray-400">+{d.interests.length - 4} more</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
