import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { INTEREST_CATEGORIES, getInterestsByIds } from '../data/interests'
import { Check, Loader2, Save, User, AlertCircle, Sparkles, MessageCircle } from 'lucide-react'

function LinkedinIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function FacebookIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}
import TableTalk from '../components/TableTalk'

export default function Profile() {
  const { user, profile } = useAuth()
  const [form, setForm] = useState({ name: '', bio: '', interests: [] })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState('profile')

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        bio: profile.bio || '',
        interests: profile.interests || [],
      })
    }
  }, [profile])

  const toggleInterest = (id) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter(i => i !== id)
        : f.interests.length >= 12
          ? f.interests // cap at 12
          : [...f.interests, id],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const { error: err } = await supabase
      .from('profiles')
      .update({ name: form.name, bio: form.bio, interests: form.interests })
      .eq('id', user.id)
    setSaving(false)
    if (err) return setError(err.message)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const selectedInterests = getInterestsByIds(form.interests)
  const previewDiner = { name: form.name || user?.name, interests: form.interests }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-forest-500 text-white text-xl font-bold flex items-center justify-center">
              {(form.name || user?.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-charcoal">{form.name || 'Your Profile'}</h1>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-1 mt-6">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'interests', label: 'Interests' },
              { id: 'social', label: 'Social Connections' },
              { id: 'preview', label: '✨ TableTalk Preview' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveSection(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeSection === tab.id ? 'border-forest-500 text-forest-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ── Profile ── */}
        {activeSection === 'profile' && (
          <div className="max-w-lg space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="font-display font-bold text-charcoal">Your Details</h2>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Display Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="How you'll appear to other diners" className="input-base" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">About You</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="A short line about yourself — what you do, what you love, what makes you interesting at a dinner table…"
                  rows={3} className="input-base resize-none" />
                <p className="text-xs text-gray-400 mt-1">Visible to other diners at an open table. Keep it warm and genuine.</p>
              </div>

              {error && <div className="flex items-center gap-2 text-coral text-sm bg-red-50 px-3 py-2 rounded-lg"><AlertCircle size={14} />{error}</div>}

              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-forest-500 text-white font-semibold rounded-xl hover:bg-forest-600 transition-colors text-sm disabled:opacity-60">
                {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Profile</>}
              </button>
            </div>

            {selectedInterests.length > 0 && (
              <div className="bg-forest-50 rounded-2xl p-5 border border-forest-100">
                <p className="text-xs font-semibold text-forest-600 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Sparkles size={11} /> Your Interests</p>
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.map(i => (
                    <span key={i.id} className="bg-white text-forest-700 text-xs px-3 py-1.5 rounded-full font-medium border border-forest-200 shadow-sm">
                      {i.emoji} {i.label}
                    </span>
                  ))}
                </div>
                <button onClick={() => setActiveSection('interests')} className="text-xs text-forest-500 font-semibold hover:underline mt-3 block">Edit interests →</button>
              </div>
            )}
          </div>
        )}

        {/* ── Interests ── */}
        {activeSection === 'interests' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal">Your Interests</h2>
                <p className="text-gray-500 text-sm mt-0.5">Pick up to 12 — we use these to generate your TableTalk conversation starters</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">{form.interests.length}/12 selected</span>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors disabled:opacity-60">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
                  {saved ? 'Saved!' : 'Save'}
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {INTEREST_CATEGORIES.map(cat => (
                <div key={cat.label}>
                  <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                    <span>{cat.emoji}</span> {cat.label}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(item => {
                      const selected = form.interests.includes(item.id)
                      const maxed = form.interests.length >= 12 && !selected
                      return (
                        <button key={item.id} onClick={() => !maxed && toggleInterest(item.id)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                            selected
                              ? 'border-forest-500 bg-forest-50 text-forest-700 shadow-sm'
                              : maxed
                                ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                                : 'border-gray-200 text-gray-600 hover:border-forest-300 hover:bg-forest-50/50'
                          }`}>
                          {selected && <Check size={12} className="text-forest-500" />}
                          <span>{item.emoji}</span>
                          <span>{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {form.interests.length === 12 && (
              <div className="mt-6 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
                You've picked 12 interests — that's the max! Deselect one to swap it out.
              </div>
            )}
          </div>
        )}

        {/* ── Social Connections ── */}
        {activeSection === 'social' && (
          <div className="max-w-lg space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-display font-bold text-charcoal mb-1">Social Connections</h2>
              <p className="text-gray-500 text-sm mb-6">
                Connect your social profiles to let other diners know a bit more about you before the meal.
                We never post on your behalf.
              </p>

              {/* Google */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg shadow-sm">G</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-charcoal">Google</p>
                    <p className="text-xs text-gray-500">Sync your profile photo and name</p>
                  </div>
                  <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-semibold">Available</span>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center">
                    <LinkedinIcon size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-charcoal">LinkedIn</p>
                    <p className="text-xs text-gray-500">Import your headline, industry, and profile photo</p>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-semibold">Coming Soon</span>
                </div>

                {/* Facebook */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                    <FacebookIcon size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-charcoal">Facebook</p>
                    <p className="text-xs text-gray-500">Import your profile photo and name</p>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-semibold">Coming Soon</span>
                </div>
              </div>

              <div className="mt-6 bg-forest-50 rounded-xl p-4 border border-forest-100">
                <p className="text-xs font-semibold text-forest-700 mb-1 flex items-center gap-1.5"><Sparkles size={12} /> Why connect?</p>
                <p className="text-xs text-forest-700/80 leading-relaxed">
                  Connected profiles help other diners know who they're sitting with before the meal. Your TableTalk conversation starters are also tailored using your interests — the richer your profile, the better the questions.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2"><AlertCircle size={15} className="text-amber-500" /> A note on data</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Facebook's API no longer allows apps to pull your "Likes" or interest categories due to privacy changes introduced after 2018. LinkedIn similarly restricts what third-party apps can access.
                <br /><br />
                This is why <strong>ODE uses your own hand-picked interests</strong> rather than scraping your social data — you stay in control of what other diners see about you, and the conversation starters are based on what you actually want to talk about.
              </p>
            </div>
          </div>
        )}

        {/* ── TableTalk Preview ── */}
        {activeSection === 'preview' && (
          <div className="max-w-2xl">
            <div className="mb-6">
              <h2 className="font-display text-xl font-bold text-charcoal mb-1">TableTalk Preview</h2>
              <p className="text-gray-500 text-sm">This is what conversation starters will look like for a table that includes you. Add more interests to get better-matched questions.</p>
            </div>

            {form.interests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <MessageCircle size={36} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-500 mb-1">No interests selected yet</p>
                <p className="text-sm text-gray-400 mb-4">Add some interests first so we can generate personalised conversation starters for you.</p>
                <button onClick={() => setActiveSection('interests')}
                  className="px-6 py-2.5 bg-forest-500 text-white text-sm font-semibold rounded-full hover:bg-forest-600 transition-colors">
                  Pick Your Interests
                </button>
              </div>
            ) : (
              <TableTalk
                diners={[
                  previewDiner,
                  { name: 'Sipho M.', interests: ['entrepreneurship', 'braai', 'rugby', 'travel'] },
                  { name: 'Lerato D.', interests: ['yoga', 'plant_based', 'sustainability', 'reading'] },
                ]}
              />
            )}

            {form.interests.length > 0 && (
              <p className="text-xs text-gray-400 mt-3 text-center">
                Preview shows you with two sample diners. Real TableTalk will match all confirmed guests at your open table.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
