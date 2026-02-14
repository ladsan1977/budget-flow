import { createFileRoute } from '@tanstack/react-router'
import FixedExpensesPage from '../pages/fixed-costs'

export const Route = createFileRoute('/fixed-expenses')({
  component: FixedExpensesPage,
})
