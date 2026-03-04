import { createFileRoute } from '@tanstack/react-router'
import TransactionsPage from '../pages/transactions/TransactionsPage'
import type { TransactionType } from '../types'

export const Route = createFileRoute('/transactions')({
  component: TransactionsPage,
  validateSearch: (search: Record<string, unknown>): { type?: TransactionType } => ({
    type: (search.type as TransactionType | undefined) ?? undefined,
  }),
})


