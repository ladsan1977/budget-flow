import { createFileRoute } from '@tanstack/react-router'
import FixedExpensePage from '../pages/FixedExpenses/FixedExpensesPage'

export const Route = createFileRoute('/fixed-expenses')({
  component: FixedExpensePage,
})
