import { createFileRoute } from '@tanstack/react-router'
import TransactionsPage from '../pages/transactions/TransactionsPage'
import type { TransactionType } from '../types'
import type { FilterExpenseNature } from '../pages/transactions/hooks/useTransactionFilters'

export const Route = createFileRoute('/transactions')({
  component: TransactionsPage,
  validateSearch: (search: Record<string, unknown>): { type?: TransactionType, expenseNature?: FilterExpenseNature } => ({
    type: (search.type as TransactionType | undefined) ?? undefined,
    expenseNature: (search.expenseNature as FilterExpenseNature | undefined) ?? undefined,
  }),
})


