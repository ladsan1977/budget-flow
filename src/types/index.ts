// src/types/index.ts

/**
 * TransactionType defines HOW the amount affects the cash flow.
 * 'income': Adds to balance.
 * 'fixed': Regular monthly costs (Rent, Credit Cards, etc).
 * 'variable': Goals-based expenses (Groceries, Dining out).
 */
export type TransactionType = 'income' | 'expense' | 'transfer';
export type ExpenseNature = 'fixed' | 'variable';
export type AccountType = 'bank' | 'cash';

export interface Account {
    id: string;
    name: string;
    type: AccountType;
    isDefault: boolean;
    userId: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    type: 'income' | 'expense'; // Refactorizado
    icon?: string;
    color?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    amount: number;
    date: string;
    description: string | null;
    categoryId?: string;
    accountId: string;      // Cuenta origen (obligatoria)
    toAccountId?: string;   // Cuenta destino (solo transfers)
    account?: Account;
    toAccount?: Account;
    type: TransactionType;
    expenseNature?: ExpenseNature; // Solo si type === 'expense'
    isPaid: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * BudgetGoal represents the monthly spending goal for variable expenses.
 * One record per user per month.
 */
export interface BudgetGoal {
    id?: string;         // Supabase UUID
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
    totalTransactions: number;
    totalIncome: number;
    totalIncomeBank: number;
    totalIncomeCash: number;
    totalFixedExpenses: number;
    totalFixedExpensesBank: number;
    totalFixedExpensesCash: number;
    totalVariableExpenses: number;
    totalVariableExpensesBank: number;
    totalVariableExpensesCash: number;
    netFlow: number;
    actualNetFlow: number;
    actualNetFlowBank: number;
    actualNetFlowCash: number;
    projectedNetFlow: number;
    projectedNetFlowBank: number;
    projectedNetFlowCash: number;
    paidFixedExpenses: number;
    pendingFixedExpenses: number;
    paidVariableExpenses: number;
    pendingVariableExpenses: number;
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

/**
 * Aggregated financial data for a single month, used by the Trend Report chart.
 */
export interface MonthStat {
    /** Short display label e.g. "Jan", "Feb" */
    month: string;
    /** Full "YYYY-MM" key for uniqueness and sorting */
    monthKey: string;
    income: number;
    fixedExpenses: number;
    variableExpenses: number;
    netFlow: number;
}
