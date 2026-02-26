import { cn, formatCurrency } from '../../../lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';

interface BudgetGaugeProps {
    actualNetFlow: number;
    projectedNetFlow: number;
    totalIncome: number;
    className?: string;
}

export function BudgetGauge({ actualNetFlow, projectedNetFlow, totalIncome, className }: BudgetGaugeProps) {
    // Health percentage: how much of the income is remaining as actual net cash flow
    // If actualNetFlow is negative or income is 0, health is 0%
    const healthPercent = totalIncome > 0
        ? Math.max(0, Math.min((actualNetFlow / totalIncome) * 100, 100))
        : 0;

    const gaugeColor = actualNetFlow < 0
        ? 'text-brand-danger'
        : healthPercent < 10
            ? 'text-brand-warning'
            : 'text-brand-success';

    const gaugeStroke = actualNetFlow < 0
        ? '#F43F5E' // brand-danger
        : healthPercent < 10
            ? '#F59E0B' // brand-warning
            : '#10B981'; // brand-success

    return (
        <Card className={cn("border-brand-primary/20", className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Net Cash Flow Health</CardTitle>
                </div>
                <CardDescription>
                    Your remaining cash flow relative to income.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8 py-8">
                {/* Circular Gauge */}
                <div className="relative h-48 w-48 flex items-center justify-center">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle
                            className="text-slate-200 dark:text-slate-700"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                        />
                        {/* Progress Circle */}
                        <circle
                            className={cn("transition-all duration-1000 ease-out", gaugeColor)}
                            strokeWidth="8"
                            strokeLinecap="round"
                            stroke={gaugeStroke}
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            style={{
                                strokeDasharray: `${2 * Math.PI * 40}`,
                                strokeDashoffset: `${2 * Math.PI * 40 * (1 - (healthPercent / 100))}`,
                            }}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(actualNetFlow)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">NET FLOW</span>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4 text-center md:text-left min-w-[200px]">
                    <div>
                        <div className="text-sm text-slate-500 mb-1">Total Income</div>
                        <div className="text-xl font-medium text-slate-900 dark:text-slate-100">
                            {formatCurrency(totalIncome)}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-slate-500 mb-1">Health Score</div>
                        <div className={cn("text-xl font-semibold", gaugeColor)}>
                            {Math.round(healthPercent)}% Retained
                        </div>
                    </div>
                </div>
            </CardContent>
            <div className="border-t border-slate-200 dark:border-slate-800 p-4 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                Projected end of month: <span className={projectedNetFlow >= 0 ? 'text-brand-success' : 'text-brand-danger'}>{formatCurrency(projectedNetFlow)}</span>
            </div>
        </Card>
    );
}
