import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { formatCurrency } from '../../../lib/utils';

interface ExpensesGaugeCardProps {
    totalFixed: number;
    totalVariable: number;
}

export function ExpensesGaugeCard({
    totalFixed,
    totalVariable,
}: ExpensesGaugeCardProps) {

    const totalExpenses = totalFixed + totalVariable;

    // Default evenly assuming zero state metrics to keep Gauge visible while empty
    const fixedPct = totalExpenses > 0 ? (totalFixed / totalExpenses) * 100 : 50;
    const variablePct = totalExpenses > 0 ? (totalVariable / totalExpenses) * 100 : 50;

    // SVG Layout Constants
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    // Stroke segment offset computations (Out of 100 length map scaled)
    const fixedDash = (fixedPct / 100) * circumference;
    const variableDash = (variablePct / 100) * circumference;

    return (
        <Card className="col-span-1 border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle>Expenses Composition</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">

                {/* SVG Split Ring */}
                <div className="relative h-48 w-48 flex-shrink-0 flex items-center justify-center">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                        {/* Background Empty Ring (Optional styling base) */}
                        <circle
                            className="text-slate-100 dark:text-slate-800"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="50"
                            cy="50"
                        />

                        {/* Fixed Expenses Arc */}
                        <circle
                            className="text-brand-primary transition-all duration-1000 ease-out"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="50"
                            cy="50"
                            style={{
                                strokeDasharray: `${fixedDash} ${circumference}`,
                                strokeDashoffset: "0",
                            }}
                        />

                        {/* Variable Expenses Arc */}
                        <circle
                            className="text-brand-warning transition-all duration-1000 ease-out"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="50"
                            cy="50"
                            style={{
                                strokeDasharray: `${variableDash} ${circumference}`,
                                strokeDashoffset: `-${fixedDash}`, // Push variable start off the tail of fixed
                            }}
                        />
                    </svg>

                    {/* Inner Text Center */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {formatCurrency(totalExpenses)}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Total Spent
                        </span>
                    </div>
                </div>

                {/* Bottom Stats Level */}
                <div className="w-full flex flex-col gap-3">
                    {/* Fixed Block */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-brand-primary" />
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {totalExpenses > 0 ? fixedPct.toFixed(1) : 0}%
                            </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">Fixed</span>
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                            {formatCurrency(totalFixed)}
                        </span>
                    </div>

                    {/* Variable Block */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-brand-warning" />
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {totalExpenses > 0 ? variablePct.toFixed(1) : 0}%
                            </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">Daily Spending</span>
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                            {formatCurrency(totalVariable)}
                        </span>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
