import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Safely shifts a YYYY-MM-DD date to a target month.
 * If the original day exceeds the days in the target month (e.g. Jan 31 -> Feb),
 * it clamps the day to the last valid day of the target month (e.g. Feb 28).
 */
export function shiftDateToTargetMonth(dateStr: string, targetYear: number, targetMonth: number): string {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const day = parseInt(parts[2], 10);

    const daysInTargetMonth = new Date(targetYear, targetMonth, 0).getDate();
    const validDay = Math.min(day, daysInTargetMonth);

    return `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`;
}
