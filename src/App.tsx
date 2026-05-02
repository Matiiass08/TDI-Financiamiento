import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { ProgressCard } from '@/components/ProgressCard'
import { ChartCard } from '@/components/ChartCard'
import { CategoryView } from '@/components/CategoryView'
import { useApp } from '@/store/appStore'
import { ToastViewport } from '@/components/Toast'
import { AuthGate } from '@/components/AuthGate'
import { MobileCategoryNav } from '@/components/MobileCategoryNav'

export default function App() {
  const selected = useApp(s => s.selectedCategory)
  return (
    <AuthGate>
      <div className="min-h-screen bg-tdi-gray-50 text-neutral-900 dark:bg-transparent dark:text-slate-100">
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <Topbar />
            <MobileCategoryNav />
            <div className="p-3 sm:p-4 lg:p-6 grid gap-4 lg:gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ProgressCard />
                <ChartCard />
              </div>
              <CategoryView key={selected ?? 'all'} />
            </div>
          </main>
        </div>
        <ToastViewport />
      </div>
    </AuthGate>
  )
}
