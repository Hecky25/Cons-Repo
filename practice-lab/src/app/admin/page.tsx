import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'
import { SPORTS } from '@/types'

export const metadata = { title: 'Admin — Practice Lab' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/')
  }

  const { data: drills } = await supabase
    .from('drills')
    .select('id, title, sport, skill_level, is_published, created_at')
    .order('created_at', { ascending: false })

  const published = drills?.filter(d => d.is_published).length ?? 0
  const unpublished = drills?.filter(d => !d.is_published).length ?? 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">{published} published · {unpublished} drafts</p>
        </div>
        <Link
          href="/admin/drills/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add drill
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {SPORTS.map(sport => {
          const count = drills?.filter(d => d.sport === sport.id).length ?? 0
          return (
            <div key={sport.id} className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{sport.icon}</div>
              <div className="text-lg font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-500">{sport.label}</div>
            </div>
          )
        })}
      </div>

      {/* Drills table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Sport</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Level</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {drills?.map(drill => {
              const sport = SPORTS.find(s => s.id === drill.sport)
              return (
                <tr key={drill.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{drill.title}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {sport?.icon} {sport?.label}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell capitalize">{drill.skill_level}</td>
                  <td className="px-4 py-3">
                    {drill.is_published ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <Eye className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/drills/${drill.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
