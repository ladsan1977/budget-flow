// src/services/mappers.ts

import type { Database } from '../types/database.types';
import type { Category, Transaction, BudgetGoal, Account, TransactionType, ExpenseNature, AccountType } from '../types';

type CategoryRow = Database['public']['Tables']['categories']['Row'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type BudgetRow = Database['public']['Tables']['budgets']['Row'];
type AccountRow = Database['public']['Tables']['accounts']['Row'];

/**
 * Convert database account to app Account type
 */
export const mapAccount = (row: AccountRow): Account => ({
    id: row.id,
    name: row.name,
    type: row.type as AccountType,
    userId: row.user_id,
    createdAt: row.created_at,
});

/**
 * Convert database category to app Category type
 */
export const mapCategory = (row: CategoryRow): Category => ({
    id: row.id,
    name: row.name,
    type: row.type as 'income' | 'expense',
    icon: row.icon || undefined,
    color: row.color || undefined,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

/**
 * Convert database transaction to app Transaction type
 */
export const mapTransaction = (row: any): Transaction => ({
    id: row.id,
    amount: Number(row.amount), // Aseguramos que sea número para cálculos
    date: row.date,
    description: row.description,
    categoryId: row.category_id || undefined,
    accountId: row.account_id,
    toAccountId: row.to_account_id || undefined,
    account: row.account ? mapAccount(row.account) : undefined,
    toAccount: row.toAccount ? mapAccount(row.toAccount) : undefined,
    type: row.type as TransactionType,
    expenseNature: (row.expense_nature as ExpenseNature) || undefined,
    isPaid: row.is_paid ?? false,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

/**
 * Convert database budget to app BudgetGoal type
 */
export const mapBudget = (row: BudgetRow): BudgetGoal => ({
    id: row.id,
    amount: Number(row.limit_amount),
    month: row.month_year,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});
