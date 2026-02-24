import type { Database } from '../types/database.types';
import type { Category, Transaction, BudgetGoal } from '../types';

type CategoryRow = Database['public']['Tables']['categories']['Row'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type BudgetRow = Database['public']['Tables']['budgets']['Row'];

/**
 * Convert database category to app Category type
 */
export const mapCategory = (row: CategoryRow): Category => ({
    id: row.id,
    name: row.name,
    type: row.type,
    icon: row.icon || undefined,
    color: row.color || undefined,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

/**
 * Convert database transaction to app Transaction type
 */
export const mapTransaction = (row: TransactionRow): Transaction => ({
    id: row.id,
    amount: row.amount,
    date: row.date,
    description: row.description,
    categoryId: row.category_id,
    type: row.type,
    isPaid: row.is_paid,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

/**
 * Convert database budget to app BudgetGoal type
 */
export const mapBudget = (row: BudgetRow): BudgetGoal => ({
    id: row.id,
    categoryId: row.category_id,
    amount: row.limit_amount,
    month: row.month_year,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});
