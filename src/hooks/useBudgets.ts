import { useQuery } from '@tanstack/react-query';
import { fetchBudgets } from '../services/supabaseData';
import type { BudgetGoal } from '../types';

export function useBudgets(date?: Date) {
    // If date is provided, create a cache key that includes the month/year
    const queryKey = ['budgets', date ? `${date.getFullYear()}-${date.getMonth()}` : 'all'];

    return useQuery<BudgetGoal[], Error>({
        queryKey,
        queryFn: () => fetchBudgets(date),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Helper to get total variable budget limit for a specific month
 */
export function useVariableBudgetLimit(date: Date) {
    const { data: budgets = [], ...rest } = useBudgets(date);

    // Logic updated to find the specific 'Groceries' budget which acts as the global variable limit
    const variableLimit = budgets
        .find(b => b.categoryId === 'cat_groceries')?.amount || 0;

    return {
        ...rest,
        data: variableLimit,
    };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setMonthlyVariableBudget } from '../services/supabaseData';
import { toast } from 'sonner';

export function useUpdateBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ date, amount }: { date: Date; amount: number }) =>
            setMonthlyVariableBudget(date, amount),
        onSuccess: (_, variables) => {
            const { date } = variables;

            // Invalidate budgets query
            queryClient.invalidateQueries({ queryKey: ['budgets'] });

            // Invalidate dashboard stats for this month
            // Note: dashboard-stats key in hook is ['dashboard-stats', year, month]
            // month in hook is 1-indexed
            queryClient.invalidateQueries({
                queryKey: ['dashboard-stats', date.getFullYear(), date.getMonth() + 1]
            });

            toast.success('Budget updated successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to update budget:', error);
            toast.error(`Failed to update budget: ${error.message}`);
        }
    });
}
