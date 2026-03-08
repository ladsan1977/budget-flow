import { useQueries } from '@tanstack/react-query';
import { fetchTransactionsByMonth } from '../services/transactions.service';
import { fetchBudgets } from '../services/budgets.service';
import type { DashboardStats } from '../types';
import type { Transaction, BudgetGoal } from '../types';
import { useAuth } from '../context/AuthContext';

/**
 * Computes DashboardStats from raw query data entirely on the client.
 * Called via the TanStack Query `select` option so the transform runs
 * whenever the cache changes — no extra network request required.
 */
function computeStats(
    transactions: Transaction[],
    budgets: BudgetGoal[]
): DashboardStats {
    const sumByObj = (txs: Transaction[]) => {
        return txs.reduce(
            (acc, tx) => {
                acc.total += tx.amount;
                if (tx.account?.type === 'bank') acc.bank += tx.amount;
                else if (tx.account?.type === 'cash') acc.cash += tx.amount;
                return acc;
            },
            { total: 0, bank: 0, cash: 0 }
        );
    };

    const incomeTxs = transactions.filter(tx => tx.type === 'income');
    const incomeStats = sumByObj(incomeTxs);

    const paidIncomeTxs = transactions.filter(tx => tx.type === 'income' && tx.isPaid);
    const paidIncomeStats = sumByObj(paidIncomeTxs);

    const fixedTxs = transactions.filter(tx => tx.type === 'expense' && tx.expenseNature === 'fixed');
    const fixedStats = sumByObj(fixedTxs);

    const variableTxs = transactions.filter(tx => tx.type === 'expense' && tx.expenseNature === 'variable');
    const variableStats = sumByObj(variableTxs);

    const paidFixedTxs = transactions.filter(tx => tx.type === 'expense' && tx.expenseNature === 'fixed' && tx.isPaid);
    const paidFixedStats = sumByObj(paidFixedTxs);

    const paidVariableTxs = transactions.filter(tx => tx.type === 'expense' && tx.expenseNature === 'variable' && tx.isPaid);
    const paidVariableStats = sumByObj(paidVariableTxs);

    const transferTxs = transactions.filter(tx => tx.type === 'transfer');
    let transferFlowBank = 0;
    let transferFlowCash = 0;

    transferTxs.forEach(tx => {
        // Deduct from source
        if (tx.account?.type === 'bank') transferFlowBank -= tx.amount;
        else if (tx.account?.type === 'cash') transferFlowCash -= tx.amount;

        // Add to destination
        if (tx.toAccount?.type === 'bank') transferFlowBank += tx.amount;
        else if (tx.toAccount?.type === 'cash') transferFlowCash += tx.amount;
    });

    const netFlow = incomeStats.total - fixedStats.total - variableStats.total;

    // Current Net Flow = Income Paid - Expenses Paid
    const actualNetFlow = paidIncomeStats.total - paidFixedStats.total - paidVariableStats.total;
    const actualNetFlowBank = paidIncomeStats.bank - paidFixedStats.bank - paidVariableStats.bank + transferFlowBank;
    const actualNetFlowCash = paidIncomeStats.cash - paidFixedStats.cash - paidVariableStats.cash + transferFlowCash;

    const variableBudgetLimit = budgets[0]?.amount ?? 0;

    const variableBudgetPercent =
        variableBudgetLimit > 0
            ? (variableStats.total / variableBudgetLimit) * 100
            : 0;

    // Projected net flow = All Incomes - All Expenses (Paid and Pending)
    const projectedNetFlow = incomeStats.total - fixedStats.total - variableStats.total;
    const projectedNetFlowBank = incomeStats.bank - fixedStats.bank - variableStats.bank + transferFlowBank;
    const projectedNetFlowCash = incomeStats.cash - fixedStats.cash - variableStats.cash + transferFlowCash;

    const pendingFixedExpenses = fixedStats.total - paidFixedStats.total;
    const pendingVariableExpenses = variableStats.total - paidVariableStats.total;

    return {
        totalTransactions: transactions.length,
        totalIncome: incomeStats.total,
        totalIncomeBank: incomeStats.bank,
        totalIncomeCash: incomeStats.cash,
        totalFixedExpenses: fixedStats.total,
        totalFixedExpensesBank: fixedStats.bank,
        totalFixedExpensesCash: fixedStats.cash,
        totalVariableExpenses: variableStats.total,
        totalVariableExpensesBank: variableStats.bank,
        totalVariableExpensesCash: variableStats.cash,
        netFlow,
        actualNetFlow,
        actualNetFlowBank,
        actualNetFlowCash,
        projectedNetFlow,
        projectedNetFlowBank,
        projectedNetFlowCash,
        paidFixedExpenses: paidFixedStats.total,
        pendingFixedExpenses,
        paidVariableExpenses: paidVariableStats.total,
        pendingVariableExpenses,
        variableBudgetLimit,
        variableBudgetPercent,
    };
}

/**
 * Fetches transactions-by-month and budgets in parallel, then derives
 * DashboardStats on the client so the UI updates instantly on cache changes.
 */
export function useDashboardStats(currentDate: Date) {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const { user } = useAuth();

    const [txQuery, budgetQuery] = useQueries({
        queries: [
            {
                queryKey: ['transactions', 'by-month', year, month, undefined, undefined, user?.id],
                queryFn: () => fetchTransactionsByMonth(currentDate),
                enabled: !!user,
                staleTime: 1 * 60 * 1000, // 1 minute
            },
            {
                queryKey: ['budgets', `${year}-${month - 1}`, user?.id], // matches useBudgets key
                queryFn: () => fetchBudgets(currentDate),
                enabled: !!user,
                staleTime: 5 * 60 * 1000, // 5 minutes
            },
        ],
    });

    const isLoading = txQuery.isLoading || budgetQuery.isLoading;
    const error = txQuery.error ?? budgetQuery.error;

    const data =
        txQuery.data && budgetQuery.data
            ? computeStats(txQuery.data, budgetQuery.data)
            : undefined;

    return {
        data,
        isLoading,
        error,
        refetch: () => {
            txQuery.refetch();
            budgetQuery.refetch();
        },
    };
}
