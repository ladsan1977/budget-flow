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
 * Dashboard Summary logic
 */
export interface MonthlySummary {
    month: string;
    totalIncome: number;
    totalFixed: number;
    totalVariable: number;
    variableBudgetLimit: number; // Sum of all Variable BudgetGoals
    netCashFlow: number;         // Income - (Fixed + Variable)
}
