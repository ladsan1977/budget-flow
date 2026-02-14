import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost" | "link" | "danger"
    size?: "default" | "sm" | "lg" | "icon"
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", isLoading, children, ...props }, ref) => {
        const variants = {
            primary:
                "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20",
            outline:
                "border border-slate-200 bg-white hover:bg-slate-100 hover:text-brand-primary dark:border-slate-700 dark:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800",
            ghost:
                "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-50",
            link: "text-brand-primary underline-offset-4 hover:underline p-0 h-auto font-medium",
            danger:
                "bg-brand-danger text-white hover:bg-brand-danger/90 shadow-lg shadow-brand-danger/20",
        }

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3 text-xs",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10 p-0 flex items-center justify-center",
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-brand-background",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
