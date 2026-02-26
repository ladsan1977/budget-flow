import { useState, useMemo } from 'react';
import { useTransactionsByMonth } from '../../../hooks/useTransactions';
import { useVariableBudgetLimit, useUpdateBudget } from '../../../hooks/useBudgets';
import { useCategories } from '../../../hooks/useCategories';
import { useDate } from '../../../context/DateContext';
import { VARIABLE_CATEGORY_ID } from '../../../lib/constants';

// Determine color based on percentage
const getStatusColor = (percent: number) => {
    if (percent < 70) return 'bg-brand-success';
    if (percent < 90) return 'bg-brand-warning';
    return 'bg-brand-danger';
};

const getStatusTextColor = (percent: number) => {
    if (percent < 70) return 'text-brand-success';
    if (percent < 90) return 'text-brand-warning';
    return 'text-brand-danger';
};

export function useVariableExpensesLogic() {
    const { currentDate } = useDate();

    // Live data from Supabase (via TanStack Query cache)
    const { data: variableTransactions = [] } = useTransactionsByMonth('variable');
    const { data: globalLimit = 0, isLoading: limitLoading } = useVariableBudgetLimit(currentDate);
    const { data: categories = [] } = useCategories();
    const updateBudgetMutation = useUpdateBudget();

    // Inline budget-edit state
    const [isEditingLimit, setIsEditingLimit] = useState(false);
    const [tempLimit, setTempLimit] = useState<number>(0);

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const totalSpent = useMemo(
        () => variableTransactions.reduce((acc, t) => acc + t.amount, 0),
        [variableTransactions]
    );

    const percentage = globalLimit > 0 ? (totalSpent / globalLimit) * 100 : 0;
    const remainingBalance = globalLimit - totalSpent;

    // Spending breakdown aggregated by category
    const breakdown = useMemo(() => {
        const categoryMap = new Map<string, number>();
        variableTransactions.forEach(t => {
            const key = t.categoryId ?? '__uncategorized__';
            categoryMap.set(key, (categoryMap.get(key) || 0) + t.amount);
        });
        return Array.from(categoryMap.entries()).map(([catId, amount]) => {
            const category = categories.find(c => c.id === catId);
            const percentOfLimit = globalLimit > 0 ? (amount / globalLimit) * 100 : 0;
            const percentOfSpent = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
            return {
                id: catId,
                isPrimary: catId === VARIABLE_CATEGORY_ID,
                name: category?.name || 'Uncategorized',
                amount,
                color: category?.color,
                percentOfLimit,
                percentOfSpent,
                statusColor: getStatusColor(percentOfLimit),
            };
        }).sort((a, b) => b.amount - a.amount);
    }, [variableTransactions, totalSpent, globalLimit, categories]);

    const handleSaveLimit = () => {
        if (!isNaN(tempLimit) && tempLimit > 0) {
            updateBudgetMutation.mutate(
                { date: currentDate, amount: tempLimit },
                { onSuccess: () => setIsEditingLimit(false) }
            );
        }
    };

    return {
        data: {
            categories,
            globalLimit,
            variableTransactions,
        },
        stats: {
            totalSpent,
            remainingBalance,
            percentage,
            breakdown,
            statusColor: getStatusColor(percentage),
            statusTextColor: getStatusTextColor(percentage),
        },
        state: {
            isEditingLimit,
            tempLimit,
            limitLoading,
        },
        modals: {
            isAddModalOpen,
            setIsAddModalOpen,
        },
        actions: {
            setIsEditingLimit,
            setTempLimit,
            handleSaveLimit,
            updateBudgetMutation,
        }
    };
}
