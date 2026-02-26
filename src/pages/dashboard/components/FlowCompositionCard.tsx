import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { formatCurrency } from '../../../lib/utils';

interface FlowCompositionCardProps {
    totalIncome: number;
    paidFixed: number;
    pendingFixed: number;
    paidVariable: number;
    pendingVariable: number;
}

export function FlowCompositionCard({
    totalIncome,
    paidFixed,
    pendingFixed,
    paidVariable,
    pendingVariable,
}: FlowCompositionCardProps) {
    const safeDenom = totalIncome > 0 ? totalIncome : 1;

    const calcPct = (val: number) => Math.min(Math.max((val / safeDenom) * 100, 0), 100);

    const fixedPaidPct = calcPct(paidFixed);
    const fixedPendingPct = calcPct(pendingFixed);
    const totalFixed = paidFixed + pendingFixed;
    const totalFixedPct = calcPct(totalFixed);

    const varPaidPct = calcPct(paidVariable);
    const varPendingPct = calcPct(pendingVariable);
    const totalVar = paidVariable + pendingVariable;
    const totalVarPct = calcPct(totalVar);

    return (
        <Card className="col-span-1 border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle>Flow Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Legend */}
                <div className="flex gap-4 text-xs font-medium text-slate-500 justify-end mb-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-slate-400 dark:bg-slate-500" />
                        <span>Paid</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700" />
                        <span>Pending</span>
                    </div>
                </div>

                {/* Income */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-900 dark:text-slate-100">Income</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">100%</span>
                            <span className="font-semibold">{formatCurrency(totalIncome)}</span>
                        </div>
                    </div>
                    <div className="w-full h-4 sm:h-5 bg-brand-success/20 rounded-full flex overflow-hidden">
                        <div className="h-full bg-brand-success transition-all duration-500" style={{ width: '100%' }} />
                    </div>
                </div>

                {/* Fixed Expenses */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-900 dark:text-slate-100">Fixed Expenses</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">{totalFixedPct.toFixed(1)}%</span>
                            <span className="font-semibold">{formatCurrency(totalFixed)}</span>
                        </div>
                    </div>
                    <div className="w-full h-4 sm:h-5 bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
                        <div className="h-full bg-brand-primary transition-all duration-500" style={{ width: `${fixedPaidPct}%` }} />
                        <div className="h-full bg-brand-primary/20 transition-all duration-500" style={{ width: `${fixedPendingPct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Paid: <strong>{formatCurrency(paidFixed)}</strong></span>
                        <span>Pending: <strong>{formatCurrency(pendingFixed)}</strong></span>
                    </div>
                </div>

                {/* Variable Expenses */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-900 dark:text-slate-100">Daily Spending</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">{totalVarPct.toFixed(1)}%</span>
                            <span className="font-semibold">{formatCurrency(totalVar)}</span>
                        </div>
                    </div>
                    <div className="w-full h-4 sm:h-5 bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
                        <div className="h-full bg-brand-warning transition-all duration-500" style={{ width: `${varPaidPct}%` }} />
                        <div className="h-full bg-brand-warning/20 transition-all duration-500" style={{ width: `${varPendingPct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Paid: <strong>{formatCurrency(paidVariable)}</strong></span>
                        <span>Pending: <strong>{formatCurrency(pendingVariable)}</strong></span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
