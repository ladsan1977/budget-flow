import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default:
            "border-transparent bg-brand-primary text-white hover:bg-brand-primary/80",
        secondary:
            "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400",
        outline: "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800",
        success:
            "border-transparent bg-brand-success/10 text-brand-success hover:bg-brand-success/20",
        warning:
            "border-transparent bg-brand-warning/10 text-brand-warning hover:bg-brand-warning/20",
        danger:
            "border-transparent bg-brand-danger/10 text-brand-danger hover:bg-brand-danger/20",
    }

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
