import { createRootRoute, useRouter, useLocation } from '@tanstack/react-router'
import { Shell } from '../components/layout/Shell'
import { ThemeProvider } from '../components/theme-provider'
import { DateProvider } from '../context/DateContext'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { TransactionModalProvider, useTransactionModal } from '../context/TransactionModalContext'
import { TransactionModal } from '../components/transactions/TransactionModal'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { Toaster } from 'sonner'
import { useEffect } from 'react'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <ErrorBoundary>
            <ThemeProvider defaultTheme="dark" storageKey="budget-buddy-theme">
                <AuthProvider>
                    <DateProvider>
                        <TransactionModalProvider>
                            <AuthGuard />
                            <GlobalTransactionModal />
                            <Toaster position="top-right" richColors />
                        </TransactionModalProvider>
                    </DateProvider>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    )
}

function AuthGuard() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const location = useLocation()

    useEffect(() => {
        if (!isLoading && !user && location.pathname !== '/login') {
            router.navigate({ to: '/login', replace: true })
        } else if (!isLoading && user && location.pathname === '/login') {
            // Redirect away from login if already authenticated
            router.navigate({ to: '/', replace: true })
        }
    }, [isLoading, user, location.pathname, router])

    return <Shell />
}

function GlobalTransactionModal() {
    const { isOpen, initialType, lockType, initialData, closeModal } = useTransactionModal();

    return (
        <TransactionModal
            isOpen={isOpen}
            onClose={closeModal}
            initialType={initialType}
            lockType={lockType}
            initialData={initialData}
        />
    );
}
