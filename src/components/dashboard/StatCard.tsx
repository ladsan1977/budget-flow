import type { ReactNode } from 'react';
import { type LucideIcon, Landmark, Banknote } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency, cn } from '../../lib/utils';

export interface StatCardProps {
    title: string;
    amount: number;
    icon: LucideIcon;
    /** Color class for the Icon (e.g. text-brand-success) */
    iconColor?: string;
    description?: ReactNode;
    /** Color class for the description text (e.g. text-brand-success) */
    descriptionColor?: string;
    /** Color class for the amount text, used for conditional formatting like Net Cash Flow */
    amountColor?: string;
    /** Additional classes for the Card wrapper, like border-l-4 */
    className?: string;
    bankAmount?: number;
    cashAmount?: number;
    /** If provided, the icon becomes a clickable button navigating somewhere */
    onClick?: () => void;
}

export function StatCard({
    title,
    amount,
    icon: Icon,
    iconColor = 'text-slate-500',
    description,
    descriptionColor = 'text-slate-500 dark:text-slate-400',
    amountColor,
    className,
    bankAmount,
    cashAmount,
    onClick,
}: StatCardProps) {
    return (
        <Card className={cn("flex flex-col", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {onClick ? (
                    <button
                        type="button"
                        onClick={onClick}
                        title={`View ${title} transactions`}
                        className={cn(
                            'h-7 w-7 flex items-center justify-center rounded-md transition-all',
                            'hover:scale-110 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer',
                            iconColor
                        )}
                    >
                        <Icon className="h-4 w-4" />
                    </button>
                ) : (
                    <Icon className={cn('h-4 w-4', iconColor)} />
                )}
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-between">
                <div>
                    <div className={cn('text-2xl font-bold', amountColor)}>
                        {formatCurrency(amount)}
                    </div>
                    {description && (
                        <p className={cn('text-xs mt-1', descriptionColor)}>
                            {description}
                        </p>
                    )}
                </div>

                {(bankAmount !== undefined || cashAmount !== undefined) && (
                    <div className="flex flex-row flex-wrap gap-2 mt-4 md:flex-col md:gap-1.5">
                        {bankAmount !== undefined && (
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300">
                                <Landmark className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                                {formatCurrency(bankAmount)}
                            </div>
                        )}
                        {cashAmount !== undefined && (
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300">
                                <Banknote className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                                {formatCurrency(cashAmount)}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

