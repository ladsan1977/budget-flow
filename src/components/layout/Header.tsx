import { useState } from 'react'
import { Moon, Sun, Plus, Wallet, Menu, X, Tags, BarChart3, LogOut } from 'lucide-react'
import { Link, useRouter } from '@tanstack/react-router'
import { Button } from '../ui/Button'
import { useTheme } from '../theme-provider'
import { MonthSelector } from '../common/MonthSelector'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { cn } from '../../lib/utils'

export function Header() {
    const { theme, setTheme } = useTheme()
    const { user } = useAuth()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.navigate({ to: '/login', replace: true })
    }

    // Secondary navigation items for mobile drawer
    const mobileDrawerItems = [
        { to: '/categories', label: 'Categories', icon: Tags },
        { to: '/reports', label: 'Reports', icon: BarChart3 },
    ]

    return (
        <>
            <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-brand-surface/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-40 w-full sticky top-0">
                <div className="flex items-center gap-4">
                    {/* Logo for mobile, since sidebar is hidden on mobile */}
                    <div className="md:hidden flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg shadow-brand-primary/20">
                            <Wallet className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white w-full">
                            Budget Buddy
                        </h1>
                    </div>

                    {/* Desktop Date Selector */}
                    <div className="hidden md:flex items-center">
                        <MonthSelector />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="primary" size="sm" className="gap-2 shadow-lg shadow-brand-primary/20 hidden sm:flex" style={{ visibility: 'hidden' }} >
                        <Plus className="w-4 h-4" />
                        <span>Quick-Add</span>
                    </Button>

                    {/* Mobile Hamburger Menu (Right Side) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden rounded-full"
                    >
                        <Menu className="w-5 h-5 text-slate-500 hover:text-brand-primary transition-colors" />
                    </Button>

                    {/* Desktop Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hidden md:flex"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </header>

            {/* Mobile Drawer Navigation */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden",
                    isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
                className={cn(
                    "fixed inset-y-0 right-0 z-[70] w-72 bg-white dark:bg-brand-surface border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col md:hidden",
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <h2 className="font-bold tracking-tight text-slate-900 dark:text-white">Menu</h2>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full">
                            <X className="w-5 h-5 text-slate-500" />
                        </Button>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {mobileDrawerItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-primary/10 hover:text-brand-primary transition-colors [&.active]:bg-brand-primary/10 [&.active]:text-brand-primary dark:[&.active]:text-brand-primary font-medium"
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold uppercase shrink-0">
                            {user?.email?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">
                                {user?.user_metadata?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-danger hover:bg-brand-danger/10 rounded-lg transition-colors border border-transparent hover:border-brand-danger/20"
                    >
                        <LogOut className="w-4 h-4" />
                        Log out
                    </button>
                </div>
            </div>
        </>
    )
}
