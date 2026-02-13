import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'


export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <>
            <div className="p-2 flex gap-2 font-bold bg-primary text-white">
                <Link to="/" className="[&.active]:opacity-75">
                    Budget Buddy
                </Link>
            </div>
            <div className="p-4">
                <Outlet />
            </div>
            <TanStackRouterDevtools />
        </>
    )
}
