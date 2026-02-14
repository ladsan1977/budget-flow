import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function Shell() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-brand-background">
            {/* Sidebar for Desktop */}
            <Sidebar className="hidden md:flex" />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <Sidebar
                        className="relative z-50 w-72 h-full shadow-2xl animate-in slide-in-from-left duration-300"
                        onLinkClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto w-full relative">
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

                {/* Page Content */}
                <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            <TanStackRouterDevtools />
        </div>
    )
}
