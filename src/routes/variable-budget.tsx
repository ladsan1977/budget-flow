import { createFileRoute } from '@tanstack/react-router'
import VariableExpensesPage from '../pages/variableExpenses/VariableExpensesPage'

export const Route = createFileRoute('/variable-budget')({
  component: VariableExpensesPage,
})
