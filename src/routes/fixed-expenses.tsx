import { createFileRoute } from '@tanstack/react-router'
import FixedExpensePage from '../pages/FixedExpensesPage'

export const Route = createFileRoute('/fixed-expenses')({
  component: FixedExpensePage,
})
