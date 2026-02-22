import { Outlet, useLocation, useElementScrollRestoration } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

export function Shell() {
    const location = useLocation()
    useElementScrollRestoration({ id: 'main-scroll-container' })

    // Hide standard layout wrapper on auth pages
    if (location.pathname === '/login') {
        return <Outlet />
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-brand-background">
            {/* Sidebar for Desktop */}
            <Sidebar className="hidden md:flex" />

            {/* Main Content */}
            <main id="main-scroll-container" data-scroll-restoration-id="main-scroll-container" className="flex-1 flex flex-col overflow-y-auto scroll-smooth w-full relative pb-24 md:pb-0">
                <Header />

                {/* Page Content */}
                <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            <BottomNav />
            <TanStackRouterDevtools />
        </div>
    )
}
