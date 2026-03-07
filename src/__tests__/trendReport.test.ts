import { describe, it, expect } from 'vitest';
import { computeMonthStat } from '../pages/reports/hooks/useTrendReport';
import type { Transaction } from '../types';

// ─── Fixture factory ──────────────────────────────────────────────────────────
const baseTx: Omit<Transaction, 'id' | 'type' | 'amount'> = {
    date: '2026-01-15',
    description: 'test transaction',
    accountId: 'acc_test',
    isPaid: true,
    userId: 'user_test',
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15',
};

function makeTx(
    id: string,
    type: Transaction['type'],
    amount: number,
    expenseNature?: Transaction['expenseNature']
): Transaction {
    return { ...baseTx, id, type, amount, expenseNature };
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('computeMonthStat', () => {
    const LABEL = 'Jan';
    const KEY = '2026-01';

    it('correctly aggregates a typical month', () => {
        const txs: Transaction[] = [
            makeTx('1', 'income', 5000),
            makeTx('2', 'expense', 1500, 'fixed'),
            makeTx('3', 'expense', 300, 'variable'),
            makeTx('4', 'expense', 200, 'variable'),
        ];

        const result = computeMonthStat(txs, LABEL, KEY);

        expect(result.month).toBe(LABEL);
        expect(result.monthKey).toBe(KEY);
        expect(result.income).toBe(5000);
        expect(result.fixedExpenses).toBe(1500);
        expect(result.variableExpenses).toBe(500);
        expect(result.netFlow).toBe(3000); // 5000 - 1500 - 500
    });

    it('returns all zeros for an empty month', () => {
        const result = computeMonthStat([], LABEL, KEY);

        expect(result.income).toBe(0);
        expect(result.fixedExpenses).toBe(0);
        expect(result.variableExpenses).toBe(0);
        expect(result.netFlow).toBe(0);
    });

    it('produces a negative netFlow when expenses exceed income', () => {
        const txs: Transaction[] = [
            makeTx('1', 'income', 500),
            makeTx('2', 'expense', 1000, 'fixed'),
        ];

        const result = computeMonthStat(txs, LABEL, KEY);

        expect(result.netFlow).toBe(-500);
    });

    it('ignores transfer transactions', () => {
        const txs: Transaction[] = [
            makeTx('1', 'income', 3000),
            makeTx('2', 'transfer', 500), // should NOT count
        ];

        const result = computeMonthStat(txs, LABEL, KEY);

        expect(result.income).toBe(3000);
        expect(result.fixedExpenses).toBe(0);
        expect(result.variableExpenses).toBe(0);
        expect(result.netFlow).toBe(3000);
    });

    it('handles a month with only fixed expenses', () => {
        const txs: Transaction[] = [
            makeTx('1', 'expense', 800, 'fixed'),
            makeTx('2', 'expense', 200, 'fixed'),
        ];

        const result = computeMonthStat(txs, LABEL, KEY);

        expect(result.income).toBe(0);
        expect(result.fixedExpenses).toBe(1000);
        expect(result.variableExpenses).toBe(0);
        expect(result.netFlow).toBe(-1000);
    });
});
