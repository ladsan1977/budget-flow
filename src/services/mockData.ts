
import type { Transaction, Category } from '../types';

// Categories
export const CATEGORIES: Category[] = [
    { id: 'cat_income', name: 'Salary', type: 'income', icon: 'Wallet', color: 'text-brand-success' },
    { id: 'cat_davibank', name: 'DaviBank', type: 'fixed', icon: 'CreditCard', color: 'text-brand-primary' },
    { id: 'cat_nu', name: 'Nu', type: 'fixed', icon: 'CreditCard', color: 'text-purple-600' },
    { id: 'cat_utilities', name: 'Utilities', type: 'fixed', icon: 'Zap', color: 'text-yellow-500' },
    { id: 'cat_mercado', name: 'Mercado', type: 'variable', icon: 'ShoppingCart', color: 'text-blue-500' }, // Groceries
    { id: 'cat_gasoline', name: 'Gasoline', type: 'variable', icon: 'Fuel', color: 'text-red-500' },
];

// Fixed Expenses Transactions
export const FIXED_TRANSACTIONS: Transaction[] = [
    { id: 'tx_davibank', amount: 1647884, date: '2026-02-05', description: 'DaviBank Card Bill', categoryId: 'cat_davibank', type: 'fixed', isPaid: true },
    { id: 'tx_nu', amount: 73600, date: '2026-02-10', description: 'Nu Card Bill', categoryId: 'cat_nu', type: 'fixed', isPaid: false },
    { id: 'tx_util', amount: 300000, date: '2026-02-15', description: 'Electricity & Water', categoryId: 'cat_utilities', type: 'fixed', isPaid: false },
];

// Variable Expenses Transactions
export const VARIABLE_TRANSACTIONS: Transaction[] = [
    { id: 'tx_mercado_1', amount: 600000, date: '2026-02-02', description: 'Weekly Groceries', categoryId: 'cat_mercado', type: 'variable', isPaid: true },
    { id: 'tx_gas_1', amount: 150000, date: '2026-02-08', description: 'Full Tank', categoryId: 'cat_gasoline', type: 'variable', isPaid: true },
];

// Income Transactions
export const INCOME_TRANSACTIONS: Transaction[] = [
    { id: 'tx_salary_jan', amount: 8862400, date: '2026-01-01', description: 'Monthly Salary', categoryId: 'cat_income', type: 'income', isPaid: true },
    { id: 'tx_salary_1', amount: 8862400, date: '2026-02-01', description: 'Monthly Salary', categoryId: 'cat_income', type: 'income', isPaid: true },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
    ...INCOME_TRANSACTIONS,
    ...FIXED_TRANSACTIONS,
    ...VARIABLE_TRANSACTIONS,
    // Add January transactions for replication demo
    { id: 'tx_davibank_jan', amount: 1647884, date: '2026-01-05', description: 'DaviBank Card Bill', categoryId: 'cat_davibank', type: 'fixed', isPaid: true },
    { id: 'tx_nu_jan', amount: 73600, date: '2026-01-10', description: 'Nu Card Bill', categoryId: 'cat_nu', type: 'fixed', isPaid: true },
    { id: 'tx_util_jan', amount: 300000, date: '2026-01-15', description: 'Electricity & Water', categoryId: 'cat_utilities', type: 'fixed', isPaid: true },
];

// Global Variable Goal
export const VARIABLE_BUDGET_LIMIT = 1900000;

// Income
export const TOTAL_INCOME = 8862400;

// Helper to filter transactions by month and year
export const getTransactionsByMonth = (date: Date, type?: Transaction['type']) => {
    const month = date.getMonth();
    const year = date.getFullYear();

    return INITIAL_TRANSACTIONS.filter(tx => {
        // Parse date "YYYY-MM-DD"
        // Note: we treat the string as local date.
        const [txYear, txMonth] = tx.date.split('-').map(Number);
        const matchesDate = txYear === year && txMonth === (month + 1);

        if (!matchesDate) return false;
        if (type && tx.type !== type) return false;

        return true;
    });
};

// Helper to calculate totals
export const calculateDashboardStats = (currentDate: Date) => {
    const currentMonthTransactions = getTransactionsByMonth(currentDate);

    const fixedTransactions = currentMonthTransactions.filter(tx => tx.type === 'fixed');
    const variableTransactions = currentMonthTransactions.filter(tx => tx.type === 'variable');

    const totalFixed = fixedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalVariable = variableTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const netCashFlow = TOTAL_INCOME - (totalFixed + totalVariable);
    const variablePercentage = (totalVariable / VARIABLE_BUDGET_LIMIT) * 100;

    return {
        totalIncome: TOTAL_INCOME,
        totalFixed,
        totalVariable,
        variableBudgetLimit: VARIABLE_BUDGET_LIMIT,
        netCashFlow,
        variablePercentage,
        fixedTransactions,
        variableTransactions
    };
};
