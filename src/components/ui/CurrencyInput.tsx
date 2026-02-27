import * as React from 'react';
import { cn } from '../../lib/utils';
import { DEFAULT_LOCALE, DEFAULT_CURRENCY } from '../../lib/constants';

export interface CurrencyInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
    /** The numeric value to display (controlled). */
    value: number;
    /** Called with the new numeric value whenever the user edits the input. */
    onChange: (value: number) => void;
    /** Optional class name to customize the currency prefix glyph */
    prefixClassName?: string;
}

/**
 * A controlled currency input that:
 * - Prefixes the field with a "$" glyph (absolute-positioned inside the wrapper)
 * - Uses `inputMode="numeric"` for mobile-friendly number keyboards
 * - Strips all non-numeric / non-decimal characters before forwarding the value
 * - Formats the display value using Intl.NumberFormat when the field is blurred
 */
const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ className, prefixClassName, value, onChange, onFocus, onBlur, ...props }, ref) => {
        const formatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        // While focused we show the raw numeric string; while blurred we show formatted.
        const [isFocused, setIsFocused] = React.useState(false);
        const [rawValue, setRawValue] = React.useState(value.toString());

        // Keep rawValue in sync if the parent updates value externally.
        React.useEffect(() => {
            if (!isFocused) {
                setRawValue(Math.max(0, value).toString());
            }
        }, [value, isFocused]);

        const displayValue = isFocused ? rawValue : formatter.format(Math.max(0, value));

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            // Show raw number while editing to make it easy to clear/edit
            setRawValue(value === 0 ? '' : value.toString());
            onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            // Commit the parsed value to parent
            const parsed = parseFloat(rawValue.replace(/[^0-9.]/g, ''));
            const final = Math.max(0, isNaN(parsed) ? 0 : parsed);
            onChange(final);
            setRawValue(final.toString());
            onBlur?.(e);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // Strip everything except digits and a single decimal point
            const cleaned = e.target.value.replace(/[^0-9.]/g, '');
            setRawValue(cleaned);

            // Fire onChange on every keystroke so parent state stays in sync
            const parsed = parseFloat(cleaned);
            if (!isNaN(parsed)) {
                onChange(Math.max(0, parsed));
            }
        };

        return (
            <div className="relative flex items-center">
                {/* Currency prefix glyph */}
                <span
                    className={cn(
                        "pointer-events-none absolute left-3 select-none text-slate-400 dark:text-slate-500 text-sm font-medium",
                        prefixClassName
                    )}
                    aria-hidden="true"
                >
                    {new Intl.NumberFormat(DEFAULT_LOCALE, { style: 'currency', currency: DEFAULT_CURRENCY, minimumFractionDigits: 0, maximumFractionDigits: 0 })
                        .format(0)
                        .replace(/[\d,.\s]/g, '')
                        .trim() || '$'}
                </span>

                <input
                    {...props}
                    ref={ref}
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={cn(
                        // Base layout
                        'w-full pl-7 pr-3 py-2 rounded-lg text-sm',
                        // Border & background
                        'border border-slate-200 bg-white',
                        'dark:border-slate-700 dark:bg-brand-surface',
                        // Text
                        'text-slate-900 dark:text-slate-100 tabular-nums font-semibold',
                        // Focus ring — matches shadcn/ui style
                        'outline-none ring-offset-white transition-shadow',
                        'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
                        'dark:ring-offset-brand-background',
                        // Disabled
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        className
                    )}
                />
            </div>
        );
    }
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
