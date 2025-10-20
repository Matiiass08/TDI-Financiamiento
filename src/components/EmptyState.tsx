export function EmptyState({ title, cta }: { title: string, cta?: string }) {
  return (
    <div className="text-center py-10 text-neutral-600 dark:text-neutral-400">
      <div className="text-lg font-medium mb-1">{title}</div>
      {cta && <div className="text-sm">{cta}</div>}
    </div>
  )
}