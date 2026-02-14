import { createRootRoute } from '@tanstack/react-router'
import { Shell } from '../components/layout/Shell'
import { ThemeProvider } from '../components/theme-provider'
import { DateProvider } from '../context/DateContext'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="budget-buddy-theme">
            <DateProvider>
                <Shell />
            </DateProvider>
        </ThemeProvider>
    )
}
