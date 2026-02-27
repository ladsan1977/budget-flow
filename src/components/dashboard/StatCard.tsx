import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
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
}: StatCardProps) {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn('h-4 w-4', iconColor)} />
            </CardHeader>
            <CardContent>
                <div className={cn('text-2xl font-bold', amountColor)}>
                    {formatCurrency(amount)}
                </div>
                {description && (
                    <p className={cn('text-xs', descriptionColor)}>
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
