import { useQuery } from '@tanstack/react-query';
import { fetchBudgets } from '../services/budgets.service';
import type { BudgetGoal } from '../types';
import { VARIABLE_CATEGORY_ID } from '../lib/constants';
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
 * Helper to get total variable budget limit for a specific month
 */
export function useVariableBudgetLimit(date: Date) {
    const { data: budgets = [], ...rest } = useBudgets(date);

    // Logic updated to find the specific 'Groceries' budget which acts as the global variable limit
    const variableLimit = budgets
        .find(b => b.categoryId === VARIABLE_CATEGORY_ID)?.amount || 0;

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
