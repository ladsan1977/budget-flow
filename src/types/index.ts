// src/types/index.ts

/**
 * TransactionType defines HOW the amount affects the cash flow.
 * 'income': Adds to balance.
 * 'fixed': Regular monthly costs (Rent, Credit Cards, etc).
 * 'variable': Goals-based expenses (Groceries, Dining out).
 */
export type TransactionType = 'income' | 'fixed' | 'variable';

export interface Category {
    id: string;
    name: string;        // e.g., "DaviBank", "Rent", "Groceries"
    type: TransactionType;
    icon?: string;       // Lucide icon name
    color?: string;      // Tailwind color class or Hex
    userId?: string;     // Supabase user_id
    createdAt?: string;  // Supabase timestamp
    updatedAt?: string;  // Supabase timestamp
}

export interface Transaction {
    id: string;
    amount: number;
    date: string;
    description: string;
    categoryId: string;  // Reference to Category.id
    type: TransactionType;
    isPaid: boolean;     // Crucial for the 'Fixed Expenses' checklist
    userId?: string;     // Supabase user_id
    createdAt?: string;  // Supabase timestamp
    updatedAt?: string;  // Supabase timestamp
}

/**
 * BudgetGoal defines the "Meta" for a specific category.
 * Used primarily for Variable Expenses.
 */
export interface BudgetGoal {
    id?: string;         // Supabase UUID
    categoryId: string;
    amount: number;      // limit_amount
    month: string;       // month_year (YYYY-MM-DD or YYYY-MM)
    userId?: string;     // Supabase user_id
    createdAt?: string;  // Supabase timestamp
    updatedAt?: string;  // Supabase timestamp
}

/**
 * Aggregated stats for the Dashboard, computed client-side from cached data.
 * Calculated by the useDashboardStats hook via TanStack Query select transforms.
 */
export interface DashboardStats {
    totalIncome: number;
    totalFixedExpenses: number;
    totalVariableExpenses: number;
    netFlow: number;
    variableBudgetLimit: number;
    variableBudgetPercent: number;
}

/**
 * Represents a single category's aggregated variable spending.
 * Used by the "Variable Breakdown" section of the Dashboard.
 */
export interface CategoryBreakdown {
    /** The category ID (or a fallback key for uncategorized transactions). */
    categoryId: string;
    /** Display name: category name, or fallback to description, or 'Uncategorized'. */
    name: string;
    /** Tailwind color class from the Category, e.g. 'text-emerald-500'. */
    color?: string;
    /** Sum of all variable transaction amounts for this category in the period. */
    totalAmount: number;
    /** Percentage of totalAmount relative to the global variable budget limit (0–100+). */
    percentOfBudget: number;
}
