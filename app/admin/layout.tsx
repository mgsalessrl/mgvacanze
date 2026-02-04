import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, LogOut, Home, FileText, Settings, Percent } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userProfile = profile as { role: string } | null

  if (userProfile?.role !== 'admin') {
    // Optional: Show unauthorized page or redirect home
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
            <h1 className="text-2xl font-bold text-red-600">Accesso Negato</h1>
            <p>Non hai i permessi per accedere a questa area.</p>
            <Link href="/" className="text-primary hover:underline">Torna alla Home</Link>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
            <h2 className="font-display font-bold text-xl text-primary">MG Vacanze</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                <LayoutDashboard size={20} />
                Dashboard
            </Link>
            <Link href="/admin/quotes/create" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                <FileText size={20} />
                Nuovo Preventivo
            </Link>
            <Link href="/admin/extras" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                <Settings size={20} />
                Gestione Extra
            </Link>
            <Link href="/admin/discounts" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                <Percent size={20} />
                Gestione Sconti
            </Link>
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 font-medium mt-auto">
                <Home size={20} />
                Torna al Sito
            </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
             <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 {user.email}
             </div>
             <form action="/auth/signout" method="post">
                 <button className="w-full flex items-center gap-2 mt-4 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                    <LogOut className="w-4 h-4" /> Sign Out
                 </button>
             </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
