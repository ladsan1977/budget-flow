import { Link, useLocation } from '@tanstack/react-router'
import { LayoutDashboard, ReceiptText, Plus, Target, Receipt } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTransactionModal } from '../../context/TransactionModalContext'

export function BottomNav() {
    const location = useLocation()
    const { openModal } = useTransactionModal()

    const navItems = [
        {
            to: '/',
            icon: LayoutDashboard,
            label: 'Dashboard',
        },
        {
            to: '/transactions',
            icon: ReceiptText,
            label: 'Transactions',
        },
        {
            // Placeholder for the center button
            isCenterAction: true,
        },
        {
            to: '/fixed-expenses',
            icon: Receipt,
            label: 'Fixed',
        },
        {
            to: '/variable-budget',
            icon: Target,
            label: 'Spending',
        },
    ]

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-brand-surface border-t border-slate-200 dark:border-slate-800 pb-safe">
            <div className="flex justify-between items-center px-6 h-16">
                {navItems.map((item) => {
                    if (item.isCenterAction) {
                        return (
                            <div key="center-action" className="relative -top-5">
                                <button
                                    onClick={() => openModal({ initialType: 'variable' })}
                                    className="flex items-center justify-center w-14 h-14 bg-brand-primary text-white rounded-full shadow-lg shadow-brand-primary/30 hover:scale-105 transition-transform active:scale-95"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            </div>
                        )
                    }

                    const isActive = location.pathname === item.to
                    const Icon = item.icon!

                    return (
                        <Link
                            key={item.to}
                            to={item.to as any}
                            className={cn(
                                "flex flex-col items-center justify-center w-12 gap-1 py-1 transition-colors",
                                isActive
                                    ? "text-brand-primary"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive && "fill-brand-primary/20")} />
                            <span className="text-[10px] font-medium leading-none">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
