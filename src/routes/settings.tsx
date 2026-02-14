import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')(({
  component: Settings,
}))

function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Settings
      </h1>
      <p className="text-slate-600 dark:text-slate-400">
        Manage your account settings and preferences.
      </p>
    </div>
  )
}
