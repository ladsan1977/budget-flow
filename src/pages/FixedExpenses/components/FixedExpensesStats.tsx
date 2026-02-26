import { Card, CardContent } from '../../../components/ui/Card';
import { formatCurrency } from '../../../lib/utils';
import { CreditCard } from 'lucide-react';
import type { FixedExpensesLogicReturn } from '../hooks/useFixedExpensesLogic';

interface FixedExpensesStatsProps {
    stats: FixedExpensesLogicReturn['stats'];
}

export function FixedExpensesStats({ stats }: FixedExpensesStatsProps) {
    const { totalFixedAmount, paidAmount, remainingToPay, paidPercentage, pendingPercentage, monthOverMonthChange } = stats;

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {/* Card 1: Total Obligations */}
            <Card className="bg-white border-slate-200 dark:bg-[#151932] dark:border-[#252a41] shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Total Fixed Costs
                    </p>
                    <div className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                        {formatCurrency(totalFixedAmount)}
                    </div>
                    {monthOverMonthChange !== null && monthOverMonthChange !== undefined && (
                        <div className={`text-xs flex items-center gap-1 font-medium ${monthOverMonthChange > 0 ? 'text-emerald-600 dark:text-emerald-400' :
                                monthOverMonthChange < 0 ? 'text-rose-600 dark:text-rose-400' :
                                    'text-slate-500 dark:text-slate-400'
                            }`}>
                            <span>
                                {monthOverMonthChange > 0 ? '↗ ' : ''}
                                {monthOverMonthChange < 0 ? '↘ ' : ''}
                                {Math.abs(monthOverMonthChange).toFixed(1)}%
                            </span> from last month
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Card 2: Payment Progress */}
            <Card className="bg-white border-slate-200 dark:bg-[#151932] dark:border-[#252a41] shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Paid to Date</p>
                    <div className="text-3xl font-bold mb-4 text-emerald-600">
                        {formatCurrency(paidAmount)}
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                            style={{ width: `${paidPercentage}%` }}
                        />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 text-right mt-1.5 font-medium">
                        {Math.round(paidPercentage)}%
                    </div>
                </CardContent>
            </Card>

            {/* Card 3: Outstanding Bills */}
            <Card className="bg-white border-slate-200 dark:bg-[#151932] dark:border-[#252a41] shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Remaining to Pay</p>
                    <div className="text-3xl font-bold mb-4 text-orange-600">
                        {formatCurrency(remainingToPay)}
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-500 rounded-full"
                            style={{ width: `${pendingPercentage}%` }}
                        />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 text-right mt-1.5 font-medium">
                        {Math.round(pendingPercentage)}%
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
