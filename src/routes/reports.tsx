import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '../components/common/ComingSoon'

export const Route = createFileRoute('/reports')(({
  component: Reports,
}))

function Reports() {
  return (
    <div className="flex-1 py-12">
      <ComingSoon
        title="Reports Coming Soon"
        description="We are currently building comprehensive financial reports and analytics to help you manage your budget better. Stay tuned!"
        icon="sparkles"
      />
    </div>
  )
}
