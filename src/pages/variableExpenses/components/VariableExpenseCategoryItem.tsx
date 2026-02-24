import { formatCurrency, cn } from '../../../lib/utils';
import type { useVariableExpensesLogic } from '../hooks/useVariableExpensesLogic';

type breakdownItemType = ReturnType<typeof useVariableExpensesLogic>['stats']['breakdown'][number];

interface VariableExpenseCategoryItemProps {
    item: breakdownItemType;
}

export function VariableExpenseCategoryItem({ item }: VariableExpenseCategoryItemProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{formatCurrency(item.amount)}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", item.statusColor)}
                    style={{ width: `${Math.min(item.percentOfLimit, 100)}%` }}
                />
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{item.percentOfSpent.toFixed(1)}% of spending</span>
                <span>{item.percentOfLimit.toFixed(1)}% of limit</span>
            </div>
        </div>
    );
}
