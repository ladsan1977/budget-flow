import { createFileRoute } from '@tanstack/react-router'
import { ReportsPage } from '../pages/reports/ReportsPage'

export const Route = createFileRoute('/reports')({
  component: Reports,
})

function Reports() {
  return (
    <div className="flex-1 p-6 lg:p-8">
      <ReportsPage />
    </div>
  )
}
