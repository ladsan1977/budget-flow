import { createRootRoute } from '@tanstack/react-router'
import { Shell } from '../components/layout/Shell'
import { ThemeProvider } from '../components/theme-provider'
import { DateProvider } from '../context/DateContext'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <ErrorBoundary>
            <ThemeProvider defaultTheme="dark" storageKey="budget-buddy-theme">
                <DateProvider>
                    <Shell />
                    <Toaster position="top-right" richColors />
                </DateProvider>
            </ThemeProvider>
        </ErrorBoundary>
    )
}
