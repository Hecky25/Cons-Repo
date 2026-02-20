'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SPORTS, AGE_GROUPS, SKILL_LEVELS, type Drill } from '@/types'
import { Plus, X, Save } from 'lucide-react'

interface Props {
  drill?: Partial<Drill>
  mode: 'new' | 'edit'
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function ArrayField({
  label, values, onChange, placeholder
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-col gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v}
              onChange={e => {
                const next = [...values]
                next[i] = e.target.value
                onChange(next)
              }}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ''])}
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium mt-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add {label.toLowerCase()}
        </button>
      </div>
    </div>
  )
}

export default function DrillForm({ drill, mode }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState(drill?.title ?? '')
  const [slug, setSlug] = useState(drill?.slug ?? '')
  const [sport, setSport] = useState(drill?.sport ?? 'baseball')
  const [ageGroups, setAgeGroups] = useState<string[]>(drill?.age_groups ?? [])
  const [skillLevel, setSkillLevel] = useState(drill?.skill_level ?? 'beginner')
  const [goal, setGoal] = useState(drill?.goal ?? '')
  const [instructions, setInstructions] = useState<string[]>(drill?.instructions ?? [''])
  const [coachingCues, setCoachingCues] = useState<string[]>(drill?.coaching_cues ?? [])
  const [commonMistakes, setCommonMistakes] = useState<string[]>(drill?.common_mistakes ?? [])
  const [equipment, setEquipment] = useState<string[]>(drill?.equipment ?? [])
  const [duration, setDuration] = useState(drill?.duration_minutes ?? 15)
  const [minPlayers, setMinPlayers] = useState(drill?.min_players ?? 1)
  const [maxPlayers, setMaxPlayers] = useState(drill?.max_players ?? 20)
  const [spaceNeeded, setSpaceNeeded] = useState(drill?.space_needed ?? '')
  const [easier, setEasier] = useState(drill?.variations?.easier ?? '')
  const [harder, setHarder] = useState(drill?.variations?.harder ?? '')
  const [safetyNotes, setSafetyNotes] = useState(drill?.safety_notes ?? '')
  const [focusTags, setFocusTags] = useState<string[]>(drill?.focus_tags ?? [])
  const [isPublished, setIsPublished] = useState(drill?.is_published ?? false)

  function handleTitleChange(val: string) {
    setTitle(val)
    if (mode === 'new') setSlug(slugify(val))
  }

  function toggleAgeGroup(id: string) {
    setAgeGroups(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title,
      slug: slug || slugify(title),
      sport,
      age_groups: ageGroups,
      skill_level: skillLevel,
      goal,
      instructions: instructions.filter(Boolean),
      coaching_cues: coachingCues.filter(Boolean),
      common_mistakes: commonMistakes.filter(Boolean),
      equipment: equipment.filter(Boolean),
      duration_minutes: duration,
      min_players: minPlayers,
      max_players: maxPlayers,
      space_needed: spaceNeeded,
      variations: { easier, harder },
      safety_notes: safetyNotes,
      focus_tags: focusTags.filter(Boolean),
      is_published: isPublished,
    }

    const url = mode === 'new' ? '/api/admin/drills' : `/api/admin/drills/${drill?.id}`
    const method = mode === 'new' ? 'POST' : 'PATCH'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const { error } = await res.json()
      setError(error ?? 'Something went wrong')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'new' ? 'Add new drill' : 'Edit drill'}
        </h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={e => setIsPublished(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Published
          </label>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save drill'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      <div className="flex flex-col gap-8">

        {/* Basic info */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-gray-900">Basic info</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              required
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Soft Toss Hitting"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              required
              value={slug}
              onChange={e => setSlug(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="e.g. baseball-soft-toss-hitting"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSport(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    sport === s.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age groups</label>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleAgeGroup(a.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    ageGroups.includes(a.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill level</label>
            <div className="flex gap-2">
              {SKILL_LEVELS.map(l => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSkillLevel(l.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    skillLevel === l.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
            <input
              required
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What does this drill teach?"
            />
          </div>
        </section>

        {/* Details */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-gray-900">Details</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
              <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={1} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min players</label>
              <input type="number" value={minPlayers} onChange={e => setMinPlayers(Number(e.target.value))} min={1} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max players</label>
              <input type="number" value={maxPlayers} onChange={e => setMaxPlayers(Number(e.target.value))} min={1} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Space needed</label>
            <input value={spaceNeeded} onChange={e => setSpaceNeeded(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Full court, Half field" />
          </div>

          <ArrayField label="Equipment" values={equipment} onChange={setEquipment} placeholder="e.g. Basketball" />
          <ArrayField label="Focus tags" values={focusTags} onChange={setFocusTags} placeholder="e.g. passing, footwork" />
        </section>

        {/* Content */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-gray-900">Content</h2>
          <ArrayField label="Instructions" values={instructions} onChange={setInstructions} placeholder="Step..." />
          <ArrayField label="Coaching cues" values={coachingCues} onChange={setCoachingCues} placeholder="Cue..." />
          <ArrayField label="Common mistakes" values={commonMistakes} onChange={setCommonMistakes} placeholder="Mistake..." />
        </section>

        {/* Variations & Safety */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-gray-900">Variations & Safety</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Make it easier</label>
            <textarea value={easier} onChange={e => setEasier(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Make it harder</label>
            <textarea value={harder} onChange={e => setHarder(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Safety notes</label>
            <textarea value={safetyNotes} onChange={e => setSafetyNotes(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </section>

      </div>
    </form>
  )
}
