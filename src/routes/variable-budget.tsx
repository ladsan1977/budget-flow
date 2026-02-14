import { createFileRoute } from '@tanstack/react-router'
import VariableCostsPage from '../pages/variable-costs'

export const Route = createFileRoute('/variable-budget')({
  component: VariableCostsPage,
})
