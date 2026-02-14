import { Link } from '@tanstack/react-router'
import {
    LayoutDashboard,
    Receipt,
    PieChart,
    History,
    BarChart3,
    Settings,
    Wallet,
} from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/fixed-expenses', label: 'Fixed Expenses', icon: Receipt },
    { to: '/variable-budget', label: 'Variable Budget', icon: PieChart },
    { to: '/transactions', label: 'Transaction History', icon: History },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
]

export function Sidebar({ className, onLinkClick }: { className?: string; onLinkClick?: () => void }) {
    return (
        <aside
            className={cn(
                'w-64 bg-white dark:bg-brand-surface border-r border-slate-200 dark:border-slate-800 flex flex-col',
                className
            )}
        >
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg shadow-brand-primary/20">
                    <Wallet className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Budget Buddy
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        onClick={onLinkClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-primary/10 hover:text-brand-primary transition-colors [&.active]:bg-brand-primary/10 [&.active]:text-brand-primary dark:[&.active]:text-brand-primary font-medium"
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-primary/10 hover:text-brand-primary transition-colors [&.active]:bg-brand-primary/10 [&.active]:text-brand-primary font-medium"
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>

                <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 flex items-center gap-3">
                    {/* Placeholder Avatar */}
                    <div className="w-10 h-10 rounded-full bg-brand-primary/20 border-2 border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
                        AR
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                            Alex Reynolds
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            Pro Account
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
