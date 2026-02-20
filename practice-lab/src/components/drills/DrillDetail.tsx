'use client'

import Link from 'next/link'
import { Drill, SPORTS, SKILL_LEVELS, AGE_GROUPS } from '@/types'
import {
  Clock, Users, ArrowLeft, CheckCircle, AlertTriangle,
  Lightbulb, Zap, Shield, ChevronRight, Lock
} from 'lucide-react'
import PaywallModal from './PaywallModal'

interface Props {
  drill: Drill
  isLocked: boolean
}

const skillColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

export default function DrillDetail({ drill, isLocked }: Props) {
  const sport = SPORTS.find(s => s.id === drill.sport)
  const skillLabel = SKILL_LEVELS.find(s => s.id === drill.skill_level)?.label

  if (isLocked) {
    return <PaywallModal drill={drill} />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* Back */}
      <Link
        href="/drills"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to library
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{sport?.icon}</span>
          <span className="text-sm font-medium text-gray-500">{sport?.label}</span>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${skillColors[drill.skill_level]}`}>
            {skillLabel}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{drill.title}</h1>
        <p className="text-lg text-gray-600">{drill.goal}</p>
      </div>

      {/* Meta strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Duration</p>
          <p className="text-sm font-semibold text-gray-900">{drill.duration_minutes} min</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Players</p>
          <p className="text-sm font-semibold text-gray-900">{drill.min_players}–{drill.max_players}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-lg mb-1">📍</p>
          <p className="text-xs text-gray-500">Space</p>
          <p className="text-sm font-semibold text-gray-900 leading-tight">{drill.space_needed || '—'}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-lg mb-1">🎯</p>
          <p className="text-xs text-gray-500">Ages</p>
          <p className="text-sm font-semibold text-gray-900">
            {drill.age_groups.map(a => AGE_GROUPS.find(ag => ag.id === a)?.label?.replace('Ages ', '')).join(', ')}
          </p>
        </div>
      </div>

      {/* Equipment */}
      {drill.equipment.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Equipment needed</h2>
          <div className="flex flex-wrap gap-2">
            {drill.equipment.map((item, i) => (
              <span key={i} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Instructions */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h2>
        <ol className="flex flex-col gap-3">
          {drill.instructions.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-gray-700 pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Coaching cues */}
      {drill.coaching_cues.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Coaching cues
          </h2>
          <ul className="flex flex-col gap-2">
            {drill.coaching_cues.map((cue, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                {cue}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Common mistakes */}
      {drill.common_mistakes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Common mistakes
          </h2>
          <ul className="flex flex-col gap-2">
            {drill.common_mistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">!</span>
                {mistake}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Variations */}
      {(drill.variations?.easier || drill.variations?.harder) && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Variations
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {drill.variations.easier && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Make it easier</p>
                <p className="text-sm text-gray-700">{drill.variations.easier}</p>
              </div>
            )}
            {drill.variations.harder && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">Make it harder</p>
                <p className="text-sm text-gray-700">{drill.variations.harder}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Safety notes */}
      {drill.safety_notes && (
        <section className="mb-8">
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-100 rounded-xl p-4">
            <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-800 mb-1">Safety notes</p>
              <p className="text-sm text-yellow-700">{drill.safety_notes}</p>
            </div>
          </div>
        </section>
      )}

      {/* Focus tags */}
      {drill.focus_tags.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Focus areas</h2>
          <div className="flex flex-wrap gap-2">
            {drill.focus_tags.map((tag, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
