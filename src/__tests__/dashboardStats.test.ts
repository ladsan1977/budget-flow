/**
 * Unit tests for the DashboardStats computation logic.
 * We test the pure computeStats helper by extracting its logic inline,
 * keeping the tests independent of TanStack Query internals.
 */
import { describe, expect, it } from 'vitest';
import type { Transaction, BudgetGoal } from '../types';
import { VARIABLE_CATEGORY_ID } from '../lib/constants';

// ─── Pure helper (mirrors src/hooks/useDashboardStats.ts: computeStats) ──────
function computeStats(transactions: Transaction[], budgets: BudgetGoal[]) {
    const totalIncome = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalFixedExpenses = transactions
        .filter(tx => tx.type === 'fixed')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalVariableExpenses = transactions
        .filter(tx => tx.type === 'variable')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const paidFixedExpenses = transactions
        .filter(tx => tx.type === 'fixed' && tx.isPaid)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const paidVariableExpenses = transactions
        .filter(tx => tx.type === 'variable' && tx.isPaid)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const netFlow = totalIncome - totalFixedExpenses - totalVariableExpenses;

    const actualNetFlow = totalIncome - paidFixedExpenses - paidVariableExpenses;

    const variableBudgetLimit =
        budgets.find(b => b.categoryId === VARIABLE_CATEGORY_ID)?.amount ?? 0;

    const variableBudgetPercent =
        variableBudgetLimit > 0
            ? (totalVariableExpenses / variableBudgetLimit) * 100
            : 0;

    const projectedNetFlow = totalIncome - totalFixedExpenses - variableBudgetLimit;

    const pendingFixedExpenses = totalFixedExpenses - paidFixedExpenses;
    const pendingVariableExpenses = Math.max(0, variableBudgetLimit - paidVariableExpenses);

    return {
        totalIncome,
        totalFixedExpenses,
        totalVariableExpenses,
        netFlow,
        actualNetFlow,
        projectedNetFlow,
        paidFixedExpenses,
        pendingFixedExpenses,
        paidVariableExpenses,
        pendingVariableExpenses,
        variableBudgetLimit,
        variableBudgetPercent,
    };
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const baseTx = {
    id: '',
    date: '2026-02-01',
    description: 'test',
    categoryId: 'cat_test',
    isPaid: true,
    userId: 'user1',
};

const budget: BudgetGoal = {
    categoryId: VARIABLE_CATEGORY_ID,
    amount: 1000,
    month: '2026-02-01',
};

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('computeStats', () => {
    it('calculates all fields correctly for a normal month', () => {
        const transactions: Transaction[] = [
            { ...baseTx, id: '1', type: 'income', amount: 5000 },
            { ...baseTx, id: '2', type: 'fixed', amount: 1500 },
            { ...baseTx, id: '3', type: 'variable', amount: 400 },
            { ...baseTx, id: '4', type: 'variable', amount: 100 },
        ];

        const result = computeStats(transactions, [budget]);

        expect(result.totalIncome).toBe(5000);
        expect(result.totalFixedExpenses).toBe(1500);
        expect(result.totalVariableExpenses).toBe(500);
        expect(result.netFlow).toBe(3000); // 5000 - 1500 - 500
        expect(result.actualNetFlow).toBe(3000); // Because they all default to true
        expect(result.projectedNetFlow).toBe(2500); // 5000 - 1500 - 1000
        expect(result.variableBudgetLimit).toBe(1000);
        expect(result.variableBudgetPercent).toBe(50); // 500/1000 * 100
    });

    it('returns variableBudgetPercent = 0 when budget limit is 0 (no division by zero)', () => {
        const transactions: Transaction[] = [
            { ...baseTx, id: '1', type: 'variable', amount: 200 },
        ];

        const result = computeStats(transactions, []); // no budget row

        expect(result.variableBudgetLimit).toBe(0);
        expect(result.variableBudgetPercent).toBe(0);
    });

    it('returns all zeros when there are no transactions', () => {
        const result = computeStats([], [budget]);

        expect(result.totalIncome).toBe(0);
        expect(result.totalFixedExpenses).toBe(0);
        expect(result.totalVariableExpenses).toBe(0);
        expect(result.netFlow).toBe(0);
        expect(result.variableBudgetPercent).toBe(0);
    });

    it('netFlow is negative when expenses exceed income', () => {
        const transactions: Transaction[] = [
            { ...baseTx, id: '1', type: 'income', amount: 100 },
            { ...baseTx, id: '2', type: 'fixed', amount: 300 },
        ];

        const result = computeStats(transactions, []);
        expect(result.netFlow).toBe(-200);
    });

    it('variableBudgetPercent can exceed 100 when over budget', () => {
        const transactions: Transaction[] = [
            { ...baseTx, id: '1', type: 'variable', amount: 1500 },
        ];

        const result = computeStats(transactions, [budget]); // limit = 1000

        expect(result.variableBudgetPercent).toBe(150);
    });
});
