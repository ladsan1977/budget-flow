import type { ReactNode } from 'react';
import { formatCurrency, cn } from '../../lib/utils';
import { Card } from './Card';

interface MobileDataCardProps {
    icon: ReactNode;
    categoryName: string;
    date?: string;
    description: string;
    amount?: number;
    isIncome?: boolean;
    statusNode?: ReactNode;
    typeNode?: ReactNode;
    actions?: ReactNode;
}

export function MobileDataCard({
    icon,
    categoryName,
    date,
    description,
    amount,
    isIncome,
    statusNode,
    typeNode,
    actions
}: MobileDataCardProps) {
    return (
        <Card className="p-4 flex flex-col gap-3 md:hidden">
            {/* Top Row: Category Icon + Name (left), Date (right) */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 overflow-hidden">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0">
                        {icon}
                    </div>
                    <span className="font-medium truncate">{categoryName}</span>
                    {typeNode && <span className="ml-1 shrink-0">{typeNode}</span>}
                </div>
                {date && (
                    <div className="text-xs text-slate-400 shrink-0 ml-2">
                        {date}
                    </div>
                )}
            </div>

            {/* Middle Row: Description */}
            <div className="flex items-start justify-between">
                <div className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                    {description}
                </div>
            </div>

            {/* Bottom Row: Status/Badge and Amount + Actions */}
            <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                    {statusNode}
                    {actions && (
                        <div className="flex gap-1 ml-1">
                            {actions}
                        </div>
                    )}
                </div>
                {amount !== undefined && (
                    <div className={cn(
                        "text-lg font-bold tabular-nums shrink-0",
                        isIncome ? "text-brand-success" : "text-slate-900 dark:text-slate-100"
                    )}>
                        {isIncome ? '+' : ''}{formatCurrency(amount)}
                    </div>
                )}
            </div>
        </Card>
    );
}
