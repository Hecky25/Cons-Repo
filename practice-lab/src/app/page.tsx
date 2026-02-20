import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { SPORTS, SUBSCRIPTION_TIERS } from '@/types'

const features = [
  'Drills for every age group — from 5-year-olds to adults',
  'Beginner, intermediate, and advanced levels',
  'Step-by-step instructions + coaching cues',
  'Equipment list, space needed, and player count',
  'Easier / harder variations for every drill',
  'New drills added regularly',
]

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-20 sm:py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
            Built for coaches, parents & players
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            The drill library every coach needs
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Instantly find structured, ready-to-run drills for baseball, basketball, hockey, lacrosse, and golf — organized by age, skill level, and focus area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/drills"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-base"
            >
              Browse drills
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-base"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Sports */}
      <section className="px-4 py-16 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          5 sports. Every age. Every level.
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SPORTS.map(sport => (
            <Link
              key={sport.id}
              href={`/drills?sport=${sport.id}`}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all group"
            >
              <span className="text-4xl">{sport.icon}</span>
              <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {sport.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Everything you need at practice
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Every drill is fully structured so you can run it straight from your phone, no prep needed.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="px-4 py-16 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Simple, flexible pricing
        </h2>
        <p className="text-gray-600 text-center mb-10">
          Pick the plan that fits your coaching. Upgrade or cancel anytime.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier], i) => (
            <div
              key={key}
              className={`rounded-2xl border p-6 flex flex-col ${
                i === 2
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="mb-4">
                <p className={`text-sm font-medium mb-1 ${i === 2 ? 'text-blue-100' : 'text-blue-600'}`}>
                  {tier.name}
                </p>
                <p className={`text-3xl font-bold ${i === 2 ? 'text-white' : 'text-gray-900'}`}>
                  ${tier.monthlyPrice}
                  <span className={`text-base font-normal ${i === 2 ? 'text-blue-100' : 'text-gray-500'}`}>/mo</span>
                </p>
              </div>
              <p className={`text-sm mb-5 ${i === 2 ? 'text-blue-100' : 'text-gray-600'}`}>
                {tier.description}
              </p>
              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {tier.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${i === 2 ? 'text-blue-200' : 'text-blue-600'}`} />
                    <span className={i === 2 ? 'text-blue-50' : 'text-gray-700'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className={`text-center text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                  i === 2
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 px-4 py-16 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to level up your practices?</h2>
          <p className="text-blue-100 mb-8">
            Browse 2 drills free — no account needed. Subscribe for full access.
          </p>
          <Link
            href="/drills"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Start browsing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}
