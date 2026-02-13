import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/' as any)({
    component: Index,
})

function Index() {
    return (
        <div className="p-2">
            <h3 className="text-xl text-primary font-bold">Welcome to Budget Buddy!</h3>
            <p>Your financial companion.</p>
        </div>
    )
}
