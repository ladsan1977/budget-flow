
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { INITIAL_TRANSACTIONS, CATEGORIES, VARIABLE_BUDGET_LIMIT } from '../../services/mockData'; // Assuming we re-use these for now
import { formatCurrency, cn } from '../../lib/utils';
import { Edit2, AlertCircle } from 'lucide-react';

export default function VariableCostsPage() {
    // 1. Logic & State: Create a state variable for globalVariableLimit (default: $1,900,000).
    const [globalLimit, setGlobalLimit] = useState(VARIABLE_BUDGET_LIMIT);
    const [isEditingLimit, setIsEditingLimit] = useState(false);
    const [tempLimit, setTempLimit] = useState(globalLimit.toString());

    // 2. Automatic Calculation: The 'Total Spent' must be the dynamic sum of all transactions in mockData where type === 'variable'.
    const variableTransactions = useMemo(() => {
        return INITIAL_TRANSACTIONS.filter(t => t.type === 'variable');
    }, []);

    const totalSpent = useMemo(() => {
        return variableTransactions.reduce((acc, t) => acc + t.amount, 0);
    }, [variableTransactions]);

    const percentage = globalLimit > 0 ? (totalSpent / globalLimit) * 100 : 0;
    const remainingBalance = globalLimit - totalSpent;

    // Determine color based on percentage
    const getStatusColor = (percent: number) => {
        if (percent < 70) return 'bg-brand-success'; // Mint
        if (percent < 90) return 'bg-brand-warning'; // Amber
        return 'bg-brand-danger'; // Rose
    };

    const getStatusTextColor = (percent: number) => {
        if (percent < 70) return 'text-brand-success';
        if (percent < 90) return 'text-brand-warning';
        return 'text-brand-danger';
    };

    // 3. Expense Breakdown List:
    const breakdown = useMemo(() => {
        const categoryMap = new Map<string, number>();

        variableTransactions.forEach(t => {
            const current = categoryMap.get(t.categoryId) || 0;
            categoryMap.set(t.categoryId, current + t.amount);
        });

        const result = Array.from(categoryMap.entries()).map(([catId, amount]) => {
            const category = CATEGORIES.find(c => c.id === catId);
            return {
                id: catId,
                name: category?.name || 'Uncategorized',
                amount,
                percentOfLimit: globalLimit > 0 ? (amount / globalLimit) * 100 : 0,
                percentOfSpent: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
            };
        }).sort((a, b) => b.amount - a.amount);

        return result;
    }, [variableTransactions, totalSpent, globalLimit]);

    const handleSaveLimit = () => {
        const newLimit = parseFloat(tempLimit);
        if (!isNaN(newLimit) && newLimit > 0) {
            setGlobalLimit(newLimit);
            setIsEditingLimit(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Variable Budget
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Track your discretionary spending against a global monthly goal.
                    </p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-12">
                {/* Left Column: Global Limit & Progress (8 cols) */}
                <div className="md:col-span-8 space-y-6">

                    {/* Global Limit Card */}
                    <Card className="bg-white border-slate-200 dark:bg-brand-surface dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Monthly Goal
                            </CardTitle>
                            {isEditingLimit ? (
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditingLimit(false)}>Cancel</Button>
                                    <Button size="sm" onClick={handleSaveLimit}>Save</Button>
                                </div>
                            ) : (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                                    setTempLimit(globalLimit.toString());
                                    setIsEditingLimit(true);
                                }}>
                                    <Edit2 className="h-4 w-4" />
                                    <span className="sr-only">Edit Limit</span>
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {isEditingLimit ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-slate-400">$</span>
                                    <input
                                        type="number"
                                        value={tempLimit}
                                        onChange={(e) => setTempLimit(e.target.value)}
                                        className="text-4xl font-bold bg-transparent border-b border-slate-300 focus:border-brand-primary outline-none w-full tabular-nums text-slate-900 dark:text-white"
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
                                    {formatCurrency(globalLimit)}
                                </div>
                            )}
                            <p className="text-xs text-slate-500 mt-2">
                                Total allowed for all variable categories this month.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Fulfillment Progress Card */}
                    <Card className="bg-white border-slate-200 dark:bg-brand-surface dark:border-slate-800 shadow-sm">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        Total Spent So Far
                                    </p>
                                    <div className={cn("text-4xl font-extrabold tabular-nums tracking-tight", getStatusTextColor(percentage))}>
                                        {formatCurrency(totalSpent)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        Remaining Balance
                                    </p>
                                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                                        {formatCurrency(remainingBalance)}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className={cn("h-full transition-all duration-1000 ease-out", getStatusColor(percentage))}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>

                            <div className="flex justify-between mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <span>0%</span>
                                <span>{percentage.toFixed(1)}% Used</span>
                                <span>100%</span>
                            </div>

                            {percentage >= 100 && (
                                <div className="mt-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <div>
                                        <span className="font-bold">Budget Exceeded!</span> You have spent {formatCurrency(totalSpent - globalLimit)} over your limit.
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Breakdown List (4 cols) */}
                <div className="md:col-span-4 space-y-6">
                    <Card className="h-full bg-white border-slate-200 dark:bg-brand-surface dark:border-slate-800 shadow-sm flex flex-col">
                        <CardHeader>
                            <CardTitle>Spending Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto pr-2">
                            <div className="space-y-5">
                                {breakdown.map((item) => (
                                    <div key={item.id} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                                            <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{formatCurrency(item.amount)}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${item.percentOfSpent}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                            <span>{item.percentOfSpent.toFixed(1)}% of spending</span>
                                            <span>{item.percentOfLimit.toFixed(1)}% of limit</span>
                                        </div>
                                    </div>
                                ))}

                                {breakdown.length === 0 && (
                                    <div className="text-center py-10 text-slate-400">
                                        <p>No variable expenses yet.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
