import { useNavigate } from '@tanstack/react-router';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../../../lib/utils';
import type { CategoryBreakdown } from '../../../types';

import { resolveColor } from '../../../lib/colors';

interface VariableBreakdownCardProps {
    /** Pre-computed category breakdown produced by the parent's useMemo. */
    breakdown: CategoryBreakdown[];
    className?: string;
}

export function VariableBreakdownCard({ breakdown, className }: VariableBreakdownCardProps) {
    const navigate = useNavigate();

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Variable Breakdown</CardTitle>
                <CardDescription>Where your money is going.</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    {breakdown.length === 0 ? (
                        <div className="py-8 text-center text-slate-500">
                            No variable expenses yet.
                        </div>
                    ) : (
                        breakdown.map((item) => {
                            const color = resolveColor(item.color);
                            return (
                                <div key={item.categoryId} className="space-y-2">
                                    {/* Category label + amount */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 font-medium">
                                            <div
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                            {item.name}
                                        </div>
                                        <div className="text-slate-500">
                                            {formatCurrency(item.totalAmount)}
                                        </div>
                                    </div>

                                    {/* Progress bar — capped at 100% visually */}
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div
                                            className="h-full transition-all duration-500"
                                            style={{
                                                width: `${Math.min(item.percentOfBudget, 100)}%`,
                                                backgroundColor:
                                                    item.percentOfBudget > 90
                                                        ? '#F43F5E' // Red (danger)
                                                        : item.percentOfBudget >= 70
                                                            ? '#F59E0B' // Yellow (warning)
                                                            : '#10B981', // Green (success)
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    variant="ghost"
                    className="w-full text-brand-primary text-sm"
                    onClick={() => navigate({ to: '/transactions' })}
                >
                    View All Transactions
                </Button>
            </CardFooter>
        </Card>
    );
}
