/**
 * Fallback color used when a category has no color assigned.
 * Matches brand-primary (indigo-500).
 */
export const CATEGORY_FALLBACK_COLOR = '#6366f1';

/**
 * Maps Tailwind text-* color classes to their CSS hex equivalents.
 *
 * This exists because Tailwind's JIT compiler only tree-shakes classes that
 * appear as complete literal strings in source files. Any class assembled at
 * runtime (e.g. `color.replace('text-', 'bg-')`) is invisible to the scanner
 * and stripped from the CSS bundle.
 *
 * When rendering colors from dynamic data (e.g. category colors from the DB),
 * always use `style={{ backgroundColor: resolveColor(color) }}` instead of
 * constructing a Tailwind class at runtime.
 *
 * Covers all standard Tailwind 500-weight palette colors.
 * Add entries here as new shades are used in category data.
 */
const TAILWIND_COLOR_MAP: Record<string, string> = {
    'text-slate-500': '#64748b',
    'text-gray-500': '#6b7280',
    'text-red-500': '#ef4444',
    'text-orange-500': '#f97316',
    'text-amber-500': '#f59e0b',
    'text-yellow-500': '#eab308',
    'text-lime-500': '#84cc16',
    'text-green-500': '#22c55e',
    'text-emerald-500': '#10b981',
    'text-teal-500': '#14b8a6',
    'text-cyan-500': '#06b6d4',
    'text-sky-500': '#0ea5e9',
    'text-blue-500': '#3b82f6',
    'text-indigo-500': '#6366f1',
    'text-violet-500': '#8b5cf6',
    'text-purple-500': '#a855f7',
    'text-fuchsia-500': '#d946ef',
    'text-pink-500': '#ec4899',
    'text-rose-500': '#f43f5e',
};

/**
 * A curated list of predefined valid Tailwind colors used for category creation.
 */
export const PRESET_COLORS = Object.keys(TAILWIND_COLOR_MAP);

/**
 * Converts a category color stored in the database to a CSS color value that
 * is safe to use in `style={{ backgroundColor }}`.
 *
 * Handles three formats:
 *  - `undefined` / `null`          → returns `CATEGORY_FALLBACK_COLOR`
 *  - CSS value (`#hex`, `rgb(…)`)  → returned as-is
 *  - Tailwind class (`text-*`)     → mapped to its hex via `TAILWIND_COLOR_MAP`
 */
export function resolveColor(color: string | undefined): string {
    if (!color) return CATEGORY_FALLBACK_COLOR;

    if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) {
        return color;
    }

    return TAILWIND_COLOR_MAP[color] ?? CATEGORY_FALLBACK_COLOR;
}
