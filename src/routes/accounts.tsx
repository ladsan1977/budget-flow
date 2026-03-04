import { createFileRoute } from '@tanstack/react-router'
import AccountsPage from '../pages/accounts/AccountsPage'

export const Route = createFileRoute('/accounts')({
    component: AccountsPage,
})
