import { categoriaLabel } from '@/lib/format'
import { categoriaIds, countByCategory } from '@/lib/metrics'
import { useApp } from '@/store/appStore'

export function MobileCategoryNav() {
  const { items, selectedCategory, setSelectedCategory } = useApp()

  return (
    <nav className="md:hidden border-b border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        <button
          className={`shrink-0 rounded-full border px-3 py-2 text-sm font-medium ${
            selectedCategory === null
              ? 'border-tdi-yellow bg-tdi-yellow text-neutral-950'
              : 'border-gray-300 bg-white dark:border-neutral-700 dark:bg-neutral-900'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          Todo
        </button>

        {categoriaIds.map((category) => {
          const active = selectedCategory === category
          return (
            <button
              key={category}
              className={`shrink-0 rounded-full border px-3 py-2 text-sm font-medium ${
                active
                  ? 'border-tdi-yellow bg-tdi-yellow text-neutral-950'
                  : 'border-gray-300 bg-white dark:border-neutral-700 dark:bg-neutral-900'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {categoriaLabel[category]} ({countByCategory(items, category)})
            </button>
          )
        })}
      </div>
    </nav>
  )
}
