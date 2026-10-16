import { Link } from 'react-router-dom'
import { Check, ArrowRight, Users, ChefHat, Wine, Zap, TrendingUp, MessageCircle } from 'lucide-react'

const dinerPerks = [
  'Browse & book set course experiences',
  'Join or host an open table',
  'TableTalk AI conversation starters',
  'Exclusive brand drink promotions',
  'Diner profile with interest matching',
  'Booking history & upcoming events',
  'Free — always',
]

const restaurantTiers = [
  {
    name: 'Free',
    price: 'R0',
    period: '/month',
    tag: 'Get started',
    color: 'border-gray-200',
    cta: 'Start for free',
    ctaStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    features: [
      '1 active experience at a time',
      'Basic booking management',
      'Listed on ODE',
      'Up to 20 bookings/month',
      'ODE booking fee: R35/booking',
      'Access to brand promotions',
    ],
    missing: ['Analytics & revenue reports', 'Unlimited experiences', 'Priority placement', 'Export guest data'],
  },
  {
    name: 'Growth',
    price: 'R499',
    period: '/month',
    tag: 'Most popular',
    color: 'border-forest-500 shadow-lg shadow-forest-500/10',
    highlight: true,
    cta: 'Start Growth',
    ctaStyle: 'bg-forest-500 text-white hover:bg-forest-600',
    features: [
      'Unlimited active experiences',
      'Full booking management',
      'Analytics & revenue dashboard',
      'Unlimited bookings',
      'ODE booking fee: R25/booking',
      'All brand promotions',
      'Guest interest profiles',
      'TableTalk for your experiences',
    ],
    missing: ['Priority search placement', 'Export guest data', 'Dedicated support'],
  },
  {
    name: 'Pro',
    price: 'R1,299',
    period: '/month',
    tag: 'Full power',
    color: 'border-charcoal',
    cta: 'Go Pro',
    ctaStyle: 'bg-charcoal text-white hover:bg-gray-800',
    features: [
      'Everything in Growth',
      'Priority search placement',
      'Export guest data (CSV)',
      'Custom promotion negotiations',
      'ODE booking fee: R15/booking',
      'Dedicated account manager',
      'Brand partnership introductions',
      'Monthly performance report',
    ],
    missing: [],
  },
]

const brandPackages = [
  {
    name: 'Launch',
    price: 'R5,000',
    period: '/month',
    tag: 'Entry level',
    color: 'border-gray-200',
    features: [
      '1 active promotion',
      'Listed across all ODE experiences',
      'Up to 150 guaranteed redemptions',
      'Basic redemption report',
      'Expires unused redemptions monthly',
    ],
    highlight: false,
  },
  {
    name: 'Campaign',
    price: 'R15,000',
    period: '/month',
    tag: 'Best value',
    color: 'border-amber-400 shadow-lg shadow-amber-500/10',
    features: [
      '3 simultaneous promotions',
      'Restaurant targeting (cuisine, city)',
      'Up to 500 guaranteed redemptions',
      'Weekly analytics dashboard',
      'Diner interest data report',
      'Rollover unused redemptions',
    ],
    highlight: true,
  },
  {
    name: 'Partner',
    price: 'Custom',
    period: '',
    tag: 'Enterprise',
    color: 'border-charcoal',
    features: [
      'Unlimited promotions',
      'Dedicated restaurant relationships',
      'Full diner demographic data',
      'Custom redemption mechanics',
      'Co-branded experience packages',
      'Quarterly business review',
      'API access',
    ],
    highlight: false,
  },
]

function FeatureList({ features, missing = [] }) {
  return (
    <ul className="space-y-2.5">
      {features.map(f => (
        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
          <Check size={15} className="text-forest-500 mt-0.5 flex-shrink-0" />
          {f}
        </li>
      ))}
      {missing.map(f => (
        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
          <span className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0 mt-0.5" />
          {f}
        </li>
      ))}
    </ul>
  )
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-charcoal text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl font-bold mb-4">Simple, honest pricing</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            ODE makes money when restaurants fill tables and brands reach diners. Everyone wins.
          </p>
        </div>
      </div>

      {/* Diners */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-forest-50 flex items-center justify-center"><Users size={20} className="text-forest-500" /></div>
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal">For Diners</h2>
            <p className="text-gray-500 text-sm">ODE is free for diners. Always.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border-2 border-forest-500 shadow-lg shadow-forest-500/10 p-8 md:flex items-start gap-8">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-5xl font-bold text-charcoal">R0</span>
              <span className="text-gray-400">/month · forever</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Diners should never pay a platform fee to enjoy a meal. You pay for the experience at the restaurant — that's it.</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {dinerPerks.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check size={14} className="text-forest-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 md:mt-0 md:ml-4 flex-shrink-0">
            <div className="bg-forest-50 rounded-2xl p-6 text-center w-full md:w-52">
              <MessageCircle size={28} className="text-forest-500 mx-auto mb-2" />
              <p className="font-display font-bold text-charcoal text-sm mb-1">TableTalk Included</p>
              <p className="text-xs text-gray-500 mb-4">AI conversation starters matched to your table's interests</p>
              <Link to="/register" className="block w-full py-2.5 bg-forest-500 text-white text-sm font-semibold rounded-xl hover:bg-forest-600 transition-colors text-center">
                Join Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center"><ChefHat size={20} className="text-amber-600" /></div>
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal">For Restaurants</h2>
              <p className="text-gray-500 text-sm">Fill your tables with committed diners who've already pre-selected your menu</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {restaurantTiers.map(tier => (
              <div key={tier.name} className={`bg-white rounded-2xl border-2 p-6 relative ${tier.color}`}>
                {tier.tag && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${tier.highlight ? 'bg-forest-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {tier.tag}
                  </span>
                )}
                <h3 className="font-display font-bold text-xl text-charcoal mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-bold font-display text-charcoal">{tier.price}</span>
                  <span className="text-gray-400 text-sm">{tier.period}</span>
                </div>
                <FeatureList features={tier.features} missing={tier.missing} />
                <Link to="/register?role=restaurant"
                  className={`mt-6 block w-full py-2.5 text-sm font-semibold rounded-xl transition-colors text-center ${tier.ctaStyle}`}>
                  {tier.cta} <ArrowRight size={14} className="inline ml-1" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-5 text-sm text-gray-500 flex items-start gap-3">
            <Zap size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p><strong className="text-charcoal">First 6 months free on Growth.</strong> We're onboarding founding restaurants now. Join before 1 August 2026 and get Growth tier free for 6 months — no credit card required. <Link to="/register?role=restaurant" className="text-forest-500 font-semibold hover:underline">Apply here →</Link></p>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center"><Wine size={20} className="text-coral" /></div>
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal">For Alcohol Brands</h2>
            <p className="text-gray-500 text-sm">Reach diners at the exact moment they're choosing what to drink</p>
          </div>
        </div>

        <div className="bg-forest-50 border border-forest-200 rounded-2xl p-5 mb-8 text-sm text-forest-800">
          <strong>The problem with how brands currently spend:</strong> On-trade marketing in SA still runs through promotional agencies and direct sales reps — expensive, hard to measure, and impossible to scale.
          ODE gives brands a direct digital line to the dining table. Every redemption is tracked. Every rand spent has a measurable result.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {brandPackages.map(pkg => (
            <div key={pkg.name} className={`bg-white rounded-2xl border-2 p-6 relative ${pkg.color}`}>
              {pkg.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white whitespace-nowrap">
                  {pkg.tag}
                </span>
              )}
              {!pkg.highlight && (
                <span className="text-xs font-medium text-gray-400 block mb-2">{pkg.tag}</span>
              )}
              <h3 className="font-display font-bold text-xl text-charcoal mb-1">{pkg.name}</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl font-bold font-display text-charcoal">{pkg.price}</span>
                {pkg.period && <span className="text-gray-400 text-sm">{pkg.period}</span>}
              </div>
              <FeatureList features={pkg.features} />
              <Link to="/register?role=brand"
                className={`mt-6 block w-full py-2.5 text-sm font-semibold rounded-xl transition-colors text-center ${pkg.highlight ? 'bg-amber-500 text-white hover:bg-amber-600' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                {pkg.price === 'Custom' ? 'Talk to us' : 'Get started'} <ArrowRight size={14} className="inline ml-1" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { value: 'R15–R50', label: 'Cost per diner reached', sub: 'vs. R200+ through promo agencies' },
            { value: '100%', label: 'Redemptions tracked', sub: 'Know exactly what worked' },
            { value: '3–5×', label: 'Estimated ROI', sub: 'Based on comparable platforms' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="text-2xl font-display font-bold text-charcoal">{s.value}</div>
              <div className="text-xs font-semibold text-gray-700 mt-1">{s.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-2xl font-bold text-charcoal text-center mb-8">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What is the booking fee and who pays it?", a: "Restaurants pay a small fee per confirmed booking (R15–R35 depending on plan). Diners never pay a platform fee — they only pay for the experience itself." },
              { q: "Can I switch restaurant plans mid-month?", a: "Yes. Upgrades take effect immediately. Downgrades take effect at the start of your next billing month." },
              { q: "How does the brand promotion redemption work?", a: "When a diner adds your promotion at checkout, it's counted as a redemption. You're billed monthly for actual redemptions, up to your package cap. Unused redemptions in Campaign tier roll over." },
              { q: "Do I need to commit to a brand contract?", a: "Launch and Campaign packages are month-to-month. Cancel any time. Partner packages have a minimum 3-month term." },
              { q: "What happens to restaurant data / diner interests?", a: "Diner interests are anonymised before sharing with brand partners — brands see aggregate interest data, not individual profiles. Restaurants see their own guest data only." },
            ].map(faq => (
              <div key={faq.q} className="bg-white rounded-xl border border-gray-100 p-5">
                <h4 className="font-semibold text-charcoal mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal text-white py-16 text-center">
        <h2 className="font-display text-3xl font-bold mb-3">Ready to join ODE?</h2>
        <p className="text-gray-400 mb-8">Sign up in under 2 minutes. No credit card required to start.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register" className="px-8 py-3.5 bg-forest-500 text-white font-semibold rounded-full hover:bg-forest-600 transition-colors">
            Join as a Diner — Free
          </Link>
          <Link to="/register?role=restaurant" className="px-8 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-colors">
            List Your Restaurant
          </Link>
          <Link to="/register?role=brand" className="px-8 py-3.5 bg-amber-500 text-white font-semibold rounded-full hover:bg-amber-600 transition-colors">
            Brand Partnership
          </Link>
        </div>
      </section>
    </div>
  )
}
