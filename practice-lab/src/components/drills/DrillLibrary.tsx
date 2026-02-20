'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Drill, DrillFilters, SPORTS, AGE_GROUPS, SKILL_LEVELS } from '@/types'
import DrillCard from './DrillCard'
import { Search, X } from 'lucide-react'
import { useState, useTransition } from 'react'

interface Props {
  drills: Drill[]
  filters: DrillFilters
}

export default function DrillLibrary({ drills, filters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(filters.search ?? '')

  function updateFilter(key: string, value: string | undefined) {
    const params = new URLSearchParams()
    const current: Record<string, string | undefined> = {
      sport: filters.sport,
      age_group: filters.age_group,
      skill_level: filters.skill_level,
      search: filters.search,
      [key]: value,
    }
    Object.entries(current).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function clearAll() {
    setSearch('')
    startTransition(() => router.push(pathname))
  }

  const hasFilters = filters.sport || filters.age_group || filters.skill_level || filters.search

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Drill Library</h1>
        <p className="text-gray-500">
          {drills.length} drill{drills.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search drills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') updateFilter('search', search || undefined)
          }}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">

        {/* Sport */}
        <div className="flex flex-wrap gap-2">
          {SPORTS.map(sport => (
            <button
              key={sport.id}
              onClick={() => updateFilter('sport', filters.sport === sport.id ? undefined : sport.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filters.sport === sport.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              <span>{sport.icon}</span>
              {sport.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 self-stretch hidden sm:block" />

        {/* Age group */}
        <div className="flex flex-wrap gap-2">
          {AGE_GROUPS.map(age => (
            <button
              key={age.id}
              onClick={() => updateFilter('age_group', filters.age_group === age.id ? undefined : age.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filters.age_group === age.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {age.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 self-stretch hidden sm:block" />

        {/* Skill level */}
        <div className="flex flex-wrap gap-2">
          {SKILL_LEVELS.map(level => (
            <button
              key={level.id}
              onClick={() => updateFilter('skill_level', filters.skill_level === level.id ? undefined : level.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filters.skill_level === level.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Grid */}
      {isPending ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : drills.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No drills found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {drills.map((drill, index) => (
            <DrillCard key={drill.id} drill={drill} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
