import { createFileRoute } from '@tanstack/react-router'
import DashboardPage from '../pages/dashboard/index'

export const Route = createFileRoute('/')({
    component: DashboardPage,
})

