import { Link } from 'react-router-dom'
import { ArrowRight, Users, Utensils, Wine, Star, MapPin, ChevronRight, ChefHat } from 'lucide-react'
import { restaurants, experiences } from '../data/mockData'
import ExperienceCard from '../components/ExperienceCard'

const features = [
  {
    icon: Utensils,
    title: 'Set Course Menus',
    desc: 'Pre-book curated dining experiences at the city\'s best restaurants. Know exactly what you\'re getting — and look forward to every bite.',
    color: 'bg-forest-50 text-forest-500',
  },
  {
    icon: Users,
    title: 'Open Tables',
    desc: 'Host or join a shared table with like-minded food lovers. Make new connections over a great meal — the original social dining.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Wine,
    title: 'Exclusive Drink Deals',
    desc: 'Unlock special promotions from premium alcohol brands — complimentary cocktails, wine pairings, and beer flights, just for ODE diners.',
    color: 'bg-sage/20 text-forest-600',
  },
]

const howItWorks = [
  { step: '01', title: 'Pick an Experience', desc: 'Browse set menus at partner restaurants and choose the one that excites you.' },
  { step: '02', title: 'Book Your Seats', desc: 'Reserve your spot — keep it private or open it up for fellow food lovers to join.' },
  { step: '03', title: 'Unlock Promotions', desc: 'Add exclusive drinks deals from brand partners — wine pairings, cocktail packages & more.' },
  { step: '04', title: 'Show Up & Savour', desc: 'Arrive, sit down, and enjoy. Everything\'s sorted — just bring your appetite.' },
]

export default function Landing() {
  const featuredExperiences = experiences.slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-40">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-sage mb-6 backdrop-blur-sm">
              <Star size={12} className="fill-current" />
              South Africa's social dining platform
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              An ode to<br />
              <span className="text-sage">eating out.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              Pre-book curated set menus, meet fellow food lovers at open tables, and unlock exclusive drink promotions — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-forest-500 text-white font-semibold rounded-full hover:bg-forest-600 transition-colors text-base"
              >
                Start dining <ArrowRight size={18} />
              </Link>
              <Link
                to="/register?role=restaurant"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm text-base"
              >
                List your restaurant
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
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

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold text-charcoal mb-3">Why ODE?</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Three great reasons to make it your dining companion</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.color}`}>
                <f.icon size={22} />
              </div>
              <h3 className="font-display font-bold text-xl text-charcoal mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Experiences */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExperiences.map(exp => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold text-charcoal mb-3">How It Works</h2>
          <p className="text-gray-500 text-lg">From curious to seated in four easy steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((item, i) => (
            <div key={item.step} className="relative">
              {i < howItWorks.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-full w-full h-0.5 bg-gradient-to-r from-forest-200 to-transparent z-0" style={{ width: 'calc(100% - 2rem)' }} />
              )}
              <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-4xl font-display font-bold text-forest-100 mb-3">{item.step}</div>
                <h3 className="font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant & Brand CTA */}
      <section className="bg-forest-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-sm">
              <ChefHat size={32} className="text-sage mb-4" />
              <h3 className="font-display text-2xl font-bold mb-3">Own a Restaurant?</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Fill your tables with food-lovers who've already committed to your set menu. Build drink promotions with brand partners and drive incremental revenue on every seat.
              </p>
              <Link
                to="/register?role=restaurant"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-forest-500 font-semibold rounded-full hover:bg-gray-50 transition-colors text-sm"
              >
                Partner with ODE <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-sm">
              <Wine size={32} className="text-amber mb-4" />
              <h3 className="font-display text-2xl font-bold mb-3">Alcohol Brand?</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Get your product in front of engaged, food-passionate diners at the moment they're choosing what to drink. Run targeted promotions across our restaurant network.
              </p>
              <Link
                to="/register?role=brand"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-forest-500 font-semibold rounded-full hover:bg-gray-50 transition-colors text-sm"
              >
                Explore brand deals <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
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
              <img src={r.image} alt={r.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-semibold font-display">{r.name}</h4>
                <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                  <MapPin size={10} /> {r.location}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-white/60 text-xs">{r.cuisine}</span>
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{r.openTables} open tables</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
