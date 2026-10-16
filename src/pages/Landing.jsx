import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Users, Utensils, Wine, Star, MapPin, ChevronRight,
  ChefHat, MessageCircle, Check, TrendingUp, Zap, Sparkles,
} from 'lucide-react'
import { getRestaurants, getExperiences } from '../lib/services'
import ExperienceCard from '../components/ExperienceCard'

function adaptExperience(e) {
  return {
    ...e,
    restaurant: e.restaurants,
    pricePerPerson: e.price_per_person,
    promoList: (e.experience_promotions || []).map(ep => ep.promotions).filter(Boolean),
  }
}

const howItWorks = [
  { step: '01', title: 'Pick an Experience', desc: 'Browse set menus at partner restaurants and choose the one that excites you.' },
  { step: '02', title: 'Book Your Seats', desc: 'Reserve your spot — keep it private or open it up for fellow food lovers to join.' },
  { step: '03', title: 'Unlock Promotions', desc: 'Add exclusive drinks deals from brand partners — wine pairings, cocktail packages & more.' },
  { step: '04', title: 'Show Up & Savour', desc: 'Arrive, sit down, and enjoy. Everything\'s sorted — just bring your appetite.' },
]

export default function Landing() {
  const [restaurants, setRestaurants] = useState([])
  const [experiences, setExperiences] = useState([])

  useEffect(() => {
    getRestaurants().then(({ data }) => setRestaurants(data || []))
    getExperiences().then(({ data }) => setExperiences((data || []).slice(0, 3).map(adaptExperience)))
  }, [])

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-charcoal text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-40">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-sage mb-6 backdrop-blur-sm">
              <Star size={12} className="fill-current" /> South Africa's social dining platform
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              An ode to<br /><span className="text-sage">eating out.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              Pre-book curated set menus, meet fellow food lovers at open tables, and unlock exclusive drink promotions — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-forest-500 text-white font-semibold rounded-full hover:bg-forest-600 transition-colors text-base">
                Start dining <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=restaurant" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm text-base">
                List your restaurant
              </Link>
            </div>
          </div>
        </div>
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-3 gap-4 text-center">
            {[['120+', 'Restaurants'], ['4,800+', 'Diners'], ['38', 'Brand Partners']].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold font-display text-sage">{num}</div>
                <div className="text-xs text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Diners ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-forest-50 text-forest-600 rounded-full px-4 py-1.5 text-xs font-semibold mb-5">
              <Users size={13} /> For Diners
            </div>
            <h2 className="font-display text-4xl font-bold text-charcoal mb-4">
              More than a reservation.<br />A whole experience.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              ODE turns a night out into a story. Browse set course menus designed to be shared, join an open table with strangers who become friends, and unlock exclusive drink deals — all for free.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                ['Pre-book curated set menus — no guessing what you\'ll eat', 'forest'],
                ['Open Tables: host or join a shared table with like-minded food lovers', 'forest'],
                ['Unlock exclusive drink promotions from premium SA brands', 'forest'],
                ['TableTalk conversation starters matched to your interests', 'forest'],
                ['Free for diners — always', 'forest'],
              ].map(([text]) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <Check size={15} className="text-forest-500 mt-0.5 flex-shrink-0" /> {text}
                </li>
              ))}
            </ul>
            <Link to="/register" className="inline-flex items-center gap-2 px-7 py-3.5 bg-forest-500 text-white font-semibold rounded-full hover:bg-forest-600 transition-colors">
              Join for free <ArrowRight size={16} />
            </Link>
          </div>

          {/* TableTalk Teaser Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-forest-500 to-forest-700 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-display font-bold text-base">TableTalk</h3>
                  <p className="text-white/70 text-xs">Conversation starters for tonight</p>
                </div>
                <span className="ml-auto bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><Sparkles size={10} /> Included Free</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="text-white/60 text-xs">Matched to:</span>
                {['🍷 Wine', '✈️ Travel', '🚀 Entrepreneurship'].map(t => (
                  <span key={t} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">{t}</span>
                ))}
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="bg-gradient-to-br from-forest-50 to-sage/20 rounded-2xl p-6 border border-forest-100 mb-4">
                <p className="text-charcoal font-display font-medium text-lg text-center leading-relaxed">
                  "If you were starting a company tomorrow, what problem in South Africa would you solve?"
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="text-xs text-gray-400">Based on:</span>
                <span className="text-xs text-forest-600 bg-forest-50 px-2 py-0.5 rounded-full font-medium">🚀 Entrepreneurship</span>
                <span className="text-xs text-forest-600 bg-forest-50 px-2 py-0.5 rounded-full font-medium">✈️ Travel</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">3 of 10 questions</div>
                <button className="px-5 py-2 bg-forest-500 text-white text-sm font-semibold rounded-full">Next →</button>
              </div>
            </div>
            <div className="px-6 pb-5 border-t border-gray-50 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Users size={11} /> At this table
              </p>
              <div className="space-y-2">
                {[
                  { name: 'You', tags: ['🍷 Wine', '✈️ Travel'] },
                  { name: 'Sipho M.', tags: ['🚀 Entrepreneurship', '🏉 Rugby'] },
                  { name: 'Lerato D.', tags: ['🌍 Sustainability', '📚 Reading'] },
                ].map(d => (
                  <div key={d.name} className="flex items-center gap-2 flex-wrap">
                    <div className="w-7 h-7 rounded-full bg-forest-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {d.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-16 truncate">{d.name}</span>
                    {d.tags.map(t => (
                      <span key={t} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">{t}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Experiences ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-4xl font-bold text-charcoal mb-1">Upcoming Experiences</h2>
              <p className="text-gray-500">Curated set menus waiting to be booked</p>
            </div>
            <Link to="/login" className="hidden md:flex items-center gap-1 text-forest-500 font-semibold text-sm hover:underline">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          {experiences.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Utensils size={40} className="mx-auto mb-3 opacity-30" />
              <p>Experiences loading — or sign in to see the full list.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map(exp => <ExperienceCard key={exp.id} experience={exp} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold text-charcoal mb-3">How It Works</h2>
          <p className="text-gray-500 text-lg">From curious to seated in four easy steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map(item => (
            <div key={item.step} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="text-4xl font-display font-bold text-forest-100 mb-3">{item.step}</div>
              <h3 className="font-semibold text-charcoal mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── For Restaurants ── */}
      <section className="bg-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-4 py-1.5 text-xs font-semibold mb-5">
                <ChefHat size={13} /> For Restaurants
              </div>
              <h2 className="font-display text-4xl font-bold text-charcoal mb-4">
                Fill your tables with<br />committed diners.
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                ODE diners pre-select your menu before they arrive. No walk-ins guessing from a long à la carte card — just guests who've already chosen to be there, committed to your experience.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Diners commit to your set menu upfront — less waste, more certainty',
                  'Brand promotions drive incremental drink revenue on every seat',
                  'Guest interest profiles fed into TableTalk for a memorable evening',
                  'Revenue analytics dashboard to track bookings and income',
                  'Start free — upgrade when you\'re ready to scale',
                ].map(t => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Check size={15} className="text-amber-500 mt-0.5 flex-shrink-0" /> {t}
                  </li>
                ))}
              </ul>

              {/* Pricing summary */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {[
                  { name: 'Free', price: 'R0/mo', sub: '1 experience · R35/booking' },
                  { name: 'Growth', price: 'R499/mo', sub: 'Unlimited · R25/booking', highlight: true },
                  { name: 'Pro', price: 'R1,299/mo', sub: 'Priority + R15/booking' },
                ].map(t => (
                  <div key={t.name} className={`flex-1 rounded-xl border-2 p-3 text-center ${t.highlight ? 'border-amber-400 bg-white' : 'border-gray-200 bg-white/60'}`}>
                    <div className="text-xs font-semibold text-gray-500 mb-0.5">{t.name}</div>
                    <div className="font-display font-bold text-charcoal text-sm">{t.price}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{t.sub}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Link to="/register?role=restaurant" className="inline-flex items-center gap-2 px-7 py-3.5 bg-charcoal text-white font-semibold rounded-full hover:bg-gray-800 transition-colors">
                  List your restaurant <ArrowRight size={16} />
                </Link>
                <Link to="/pricing" className="text-sm text-gray-500 font-medium hover:text-charcoal transition-colors">
                  See full pricing →
                </Link>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-amber-700 bg-amber-100 px-4 py-2.5 rounded-xl border border-amber-200 w-fit">
                <Zap size={12} className="text-amber-500" />
                <strong>Founding offer:</strong> First 6 months Growth free — join before 1 Aug 2026
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: TrendingUp, label: 'Avg. revenue per booking', value: 'R380', sub: 'Menu + drink promotions', color: 'bg-white border-gray-100' },
                { icon: Users, label: 'Avg. diners per experience', value: '6.2', sub: 'Committed, pre-booked seats', color: 'bg-white border-gray-100' },
                { icon: Zap, label: 'Booking conversion', value: '94%', sub: 'Diners who book, show up', color: 'bg-white border-gray-100' },
                { icon: Star, label: 'Avg. restaurant rating', value: '4.7★', sub: 'Across ODE experiences', color: 'bg-white border-gray-100' },
              ].map(s => (
                <div key={s.label} className={`rounded-2xl border p-5 ${s.color}`}>
                  <s.icon size={20} className="text-amber-500 mb-2" />
                  <div className="font-display font-bold text-2xl text-charcoal">{s.value}</div>
                  <div className="text-xs font-semibold text-gray-600 mt-0.5">{s.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── For Brands ── */}
      <section className="bg-charcoal text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
              {[
                { value: 'R15–R50', label: 'Cost per diner reached', sub: 'vs. R200+ through promo agencies' },
                { value: '100%', label: 'Redemptions tracked', sub: 'Know exactly what worked' },
                { value: '3–5×', label: 'Estimated ROI', sub: 'Based on comparable platforms' },
                { value: '0', label: 'Wasted impressions', sub: 'Only reaches diners who opt in' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 border border-white/15 rounded-2xl p-5">
                  <div className="font-display font-bold text-2xl text-sage">{s.value}</div>
                  <div className="text-xs font-semibold text-white/80 mt-0.5">{s.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-white/10 text-amber-300 rounded-full px-4 py-1.5 text-xs font-semibold mb-5">
                <Wine size={13} /> For Alcohol Brands
              </div>
              <h2 className="font-display text-4xl font-bold mb-4">
                Reach diners at the<br /><span className="text-amber-300">moment of choice.</span>
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-6">
                On-trade brand marketing in SA still runs through promotional agencies and sales reps — expensive, hard to measure, impossible to scale. ODE gives your brand a direct digital line to the dining table. Every rand spent has a tracked result.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Diners see your promotion while booking — maximum intent',
                  'Redemptions tracked per experience, per restaurant, per region',
                  'Diner interest data shows who your brand actually resonates with',
                  'Opt-in only — no wasted impressions, no ad-blindness',
                  'Month-to-month packages — no long-term commitment to start',
                ].map(t => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-white/80">
                    <Check size={15} className="text-amber-300 mt-0.5 flex-shrink-0" /> {t}
                  </li>
                ))}
              </ul>

              {/* Package summary */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {[
                  { name: 'Launch', price: 'R5k/mo', sub: '150 redemptions' },
                  { name: 'Campaign', price: 'R15k/mo', sub: '500 redemptions', highlight: true },
                  { name: 'Partner', price: 'Custom', sub: 'Enterprise' },
                ].map(t => (
                  <div key={t.name} className={`flex-1 rounded-xl border-2 p-3 text-center ${t.highlight ? 'border-amber-400 bg-amber-400/10' : 'border-white/20 bg-white/5'}`}>
                    <div className="text-xs font-semibold text-white/50 mb-0.5">{t.name}</div>
                    <div className="font-display font-bold text-white text-sm">{t.price}</div>
                    <div className="text-xs text-white/40 mt-0.5">{t.sub}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Link to="/register?role=brand" className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 text-white font-semibold rounded-full hover:bg-amber-600 transition-colors">
                  Explore brand deals <ArrowRight size={16} />
                </Link>
                <Link to="/pricing#brands" className="text-sm text-white/50 font-medium hover:text-white transition-colors">
                  Full pricing →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partner Restaurants ── */}
      {restaurants.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-4xl font-bold text-charcoal mb-1">Partner Restaurants</h2>
              <p className="text-gray-500">Hand-picked dining rooms across South Africa</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {restaurants.map(r => (
              <div key={r.id} className="group relative rounded-2xl overflow-hidden shadow-sm cursor-pointer">
                <img src={r.image_url || r.image} alt={r.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-semibold font-display">{r.name}</h4>
                  <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1"><MapPin size={10} /> {r.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white/60 text-xs">{r.cuisine}</span>
                    <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{r.open_tables} open tables</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Final CTA ── */}
      <section className="bg-forest-500 text-white py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display text-4xl font-bold mb-3">Ready to join ODE?</h2>
          <p className="text-white/70 text-lg mb-8">Sign up in under 2 minutes. No credit card required.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="px-8 py-3.5 bg-white text-forest-600 font-bold rounded-full hover:bg-gray-100 transition-colors">
              Join as a Diner — Free
            </Link>
            <Link to="/register?role=restaurant" className="px-8 py-3.5 bg-white/10 border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-colors">
              List Your Restaurant
            </Link>
            <Link to="/register?role=brand" className="px-8 py-3.5 bg-amber-500 text-white font-semibold rounded-full hover:bg-amber-600 transition-colors">
              Brand Partnership
            </Link>
          </div>
          <p className="text-white/40 text-xs mt-6">
            <Link to="/pricing" className="hover:text-white/70 underline">View full pricing →</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
