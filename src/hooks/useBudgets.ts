import { useQuery } from '@tanstack/react-query';
import { fetchBudgets } from '../services/budgets.service';
import type { BudgetGoal } from '../types';
import { useAuth } from '../context/AuthContext';

export function useBudgets(date?: Date) {
    const { user } = useAuth();
    // If date is provided, create a cache key that includes the month/year
    const queryKey = ['budgets', date ? `${date.getFullYear()}-${date.getMonth()}` : 'all', user?.id];

    return useQuery<BudgetGoal[], Error>({
        queryKey,
        queryFn: () => fetchBudgets(date),
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Helper to get the monthly variable budget limit for a specific month.
 * Since there is exactly one budget row per user per month, we just grab the first.
 */
export function useVariableBudgetLimit(date: Date) {
    const { data: budgets = [], ...rest } = useBudgets(date);

    const variableLimit = budgets[0]?.amount || 0;

    return {
        ...rest,
        data: variableLimit,
    };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setMonthlyVariableBudget } from '../services/budgets.service';
import { toast } from 'sonner';

export function useUpdateBudget() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ date, amount }: { date: Date; amount: number }) =>
            setMonthlyVariableBudget(date, amount),
        onSuccess: () => {
            // Invalidate ALL budget queries (any month/filter variant)
            queryClient.invalidateQueries({ queryKey: ['budgets'] });

            // Invalidate ALL dashboard-stats queries to ensure the UI
            // reflects the updated variable budget limit immediately.
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

            toast.success('Budget updated successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to update budget:', error);
            toast.error(`Failed to update budget: ${error.message}`);
        }
    });
}
