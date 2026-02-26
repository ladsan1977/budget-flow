/**
 * @fileoverview Static financial mock data for use in Vitest tests.
 *
 * ⚠️ This file MUST only be imported by *.test.ts / *.test.tsx files.
 *    Production code must never import from src/__tests__/fixtures/.
 *
 * Kept for:
 *  - Unit tests that run without a real database connection
 *  - Deterministic test scenarios with predictable values
 */

import type { Transaction, Category } from '../../types';

// ─── Categories ───────────────────────────────────────────────────────────────
export const MOCK_CATEGORIES: Category[] = [
    { id: 'cat_income', name: 'Salary', type: 'income', icon: 'Wallet', color: 'text-brand-success' },
    { id: 'cat_davibank', name: 'DaviBank', type: 'fixed', icon: 'CreditCard', color: 'text-brand-primary' },
    { id: 'cat_nu', name: 'Nu', type: 'fixed', icon: 'CreditCard', color: 'text-purple-600' },
    { id: 'cat_utilities', name: 'Utilities', type: 'fixed', icon: 'Zap', color: 'text-yellow-500' },
    { id: 'cat_mercado', name: 'Mercado', type: 'variable', icon: 'ShoppingCart', color: 'text-blue-500' },
    { id: 'cat_gasoline', name: 'Gasoline', type: 'variable', icon: 'Fuel', color: 'text-red-500' },
];

// ─── Transactions by type ─────────────────────────────────────────────────────
export const MOCK_INCOME_TRANSACTIONS: Transaction[] = [
    { id: 'tx_salary_jan', amount: 8862400, date: '2026-01-01', description: 'Monthly Salary', categoryId: 'cat_income', type: 'income', isPaid: true },
    { id: 'tx_salary_1', amount: 8862400, date: '2026-02-01', description: 'Monthly Salary', categoryId: 'cat_income', type: 'income', isPaid: true },
];

export const MOCK_FIXED_TRANSACTIONS: Transaction[] = [
    { id: 'tx_davibank', amount: 1647884, date: '2026-02-05', description: 'DaviBank Card Bill', categoryId: 'cat_davibank', type: 'fixed', isPaid: true },
    { id: 'tx_nu', amount: 73600, date: '2026-02-10', description: 'Nu Card Bill', categoryId: 'cat_nu', type: 'fixed', isPaid: false },
    { id: 'tx_util', amount: 300000, date: '2026-02-15', description: 'Electricity & Water', categoryId: 'cat_utilities', type: 'fixed', isPaid: false },
];

export const MOCK_VARIABLE_TRANSACTIONS: Transaction[] = [
    { id: 'tx_mercado_1', amount: 600000, date: '2026-02-02', description: 'Weekly Groceries', categoryId: 'cat_mercado', type: 'variable', isPaid: true },
    { id: 'tx_gas_1', amount: 150000, date: '2026-02-08', description: 'Full Tank', categoryId: 'cat_gasoline', type: 'variable', isPaid: true },
];

/** All mock transactions combined, including a January set for multi-month tests. */
export const MOCK_TRANSACTIONS: Transaction[] = [
    ...MOCK_INCOME_TRANSACTIONS,
    ...MOCK_FIXED_TRANSACTIONS,
    ...MOCK_VARIABLE_TRANSACTIONS,
    // January entries for replication / prior-month tests
    { id: 'tx_davibank_jan', amount: 1647884, date: '2026-01-05', description: 'DaviBank Card Bill', categoryId: 'cat_davibank', type: 'fixed', isPaid: true },
    { id: 'tx_nu_jan', amount: 73600, date: '2026-01-10', description: 'Nu Card Bill', categoryId: 'cat_nu', type: 'fixed', isPaid: true },
    { id: 'tx_util_jan', amount: 300000, date: '2026-01-15', description: 'Electricity & Water', categoryId: 'cat_utilities', type: 'fixed', isPaid: true },
];

// ─── Budget constants ─────────────────────────────────────────────────────────
/** Monthly variable spending limit used in mock scenarios. */
export const MOCK_VARIABLE_BUDGET_LIMIT = 1_900_000;

/** Monthly income used in mock scenarios. */
export const MOCK_TOTAL_INCOME = 8_862_400;

// ─── Test helpers ─────────────────────────────────────────────────────────────

/**
 * Filter MOCK_TRANSACTIONS by month/year (and optionally by type).
 * Mirrors the logic in fetchTransactionsByMonth without a real DB call.
 */
export const getTransactionsByMonth = (
    date: Date,
    type?: Transaction['type']
): Transaction[] => {
    const month = date.getMonth() + 1; // 1-indexed
    const year = date.getFullYear();

    return MOCK_TRANSACTIONS.filter(tx => {
        const [txYear, txMonth] = tx.date.split('-').map(Number);
        const matchesDate = txYear === year && txMonth === month;
        if (!matchesDate) return false;
        if (type && tx.type !== type) return false;
        return true;
    });
};

/**
 * Compute dashboard aggregates from MOCK_TRANSACTIONS.
 * Useful for asserting expected values against live hook output in integration tests.
 */
export const calculateMockDashboardStats = (currentDate: Date) => {
    const txs = getTransactionsByMonth(currentDate);

    const totalIncome = txs.filter(tx => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
    const totalFixed = txs.filter(tx => tx.type === 'fixed').reduce((s, tx) => s + tx.amount, 0);
    const totalVariable = txs.filter(tx => tx.type === 'variable').reduce((s, tx) => s + tx.amount, 0);
    const paidFixed = txs.filter(tx => tx.type === 'fixed' && tx.isPaid).reduce((s, tx) => s + tx.amount, 0);
    const paidVariable = txs.filter(tx => tx.type === 'variable' && tx.isPaid).reduce((s, tx) => s + tx.amount, 0);

    const netFlow = totalIncome - totalFixed - totalVariable;
    const actualNetFlow = totalIncome - paidFixed - paidVariable;
    const projectedNetFlow = totalIncome - totalFixed - MOCK_VARIABLE_BUDGET_LIMIT;

    const pendingFixed = totalFixed - paidFixed;
    const pendingVariable = Math.max(0, MOCK_VARIABLE_BUDGET_LIMIT - paidVariable);

    const variablePercent = MOCK_VARIABLE_BUDGET_LIMIT > 0
        ? (totalVariable / MOCK_VARIABLE_BUDGET_LIMIT) * 100
        : 0;

    return {
        totalIncome,
        totalFixed,
        totalVariable,
        netFlow,
        actualNetFlow,
        projectedNetFlow,
        paidFixedExpenses: paidFixed,
        pendingFixedExpenses: pendingFixed,
        paidVariableExpenses: paidVariable,
        pendingVariableExpenses: pendingVariable,
        variableBudgetLimit: MOCK_VARIABLE_BUDGET_LIMIT,
        variablePercent,
    };
};
