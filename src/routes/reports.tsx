import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reports')(({
  component: Reports,
}))

function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Reports
      </h1>
      <p className="text-slate-600 dark:text-slate-400">
        View financial reports and analytics.
      </p>
    </div>
  )
}
