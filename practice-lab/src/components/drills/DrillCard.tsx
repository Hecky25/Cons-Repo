'use client'

import Link from 'next/link'
import { Drill, SPORTS, SKILL_LEVELS } from '@/types'
import { Clock, Users, ChevronRight, Lock } from 'lucide-react'

interface Props {
  drill: Drill
  index: number
}

const FREE_DRILL_LIMIT = 2

const skillColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

export default function DrillCard({ drill, index }: Props) {
  const sport = SPORTS.find(s => s.id === drill.sport)
  const skillLabel = SKILL_LEVELS.find(s => s.id === drill.skill_level)?.label
  const isLocked = index >= FREE_DRILL_LIMIT

  return (
    <Link
      href={`/drills/${drill.slug}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all overflow-hidden"
    >
      {/* Sport color bar */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: sport?.color ?? '#3B82F6' }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Sport + lock */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
            <span>{sport?.icon}</span>
            {sport?.label}
          </div>
          {isLocked && (
            <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3" />
              Subscribe
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-base mb-2 group-hover:text-blue-600 transition-colors leading-snug">
          {drill.title}
        </h3>

        {/* Goal */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
          {drill.goal}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${skillColors[drill.skill_level]}`}>
            {skillLabel}
          </span>
          {drill.age_groups.slice(0, 2).map(age => (
            <span key={age} className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              Ages {age}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {drill.duration_minutes} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {drill.min_players}–{drill.max_players}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
