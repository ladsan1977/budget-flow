import { QueryErrorFallback } from '../../components/ui/QueryErrorFallback';
import { TransactionModal } from '../../components/transactions/TransactionModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { useTransactionsLogic } from './hooks/useTransactionsLogic';
import { TransactionsDesktop } from './components/TransactionsDesktop';
import { TransactionsMobile } from './components/TransactionsMobile';

export default function TransactionsPage() {
    const isMobile = useIsMobile();
    const logic = useTransactionsLogic();

    const {
        modals: {
            isAddModalOpen, setIsAddModalOpen,
            editingTransaction, setEditingTransaction,
            transactionToDelete, setTransactionToDelete
        },
        actions: {
            confirmDeleteTransaction,
            refetch
        },
        queryState: { error }
    } = logic;

    if (error) {
        return <QueryErrorFallback error={error as Error} resetErrorBoundary={() => refetch()} title="Failed to load transactions" />;
    }

    return (
        <>
            {isMobile ? (
                <TransactionsMobile {...logic} />
            ) : (
                <TransactionsDesktop {...logic} />
            )}

            {/* Add/Edit Transaction Modal */}
            <TransactionModal
                isOpen={isAddModalOpen || !!editingTransaction}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingTransaction(null);
                }}
                initialData={editingTransaction}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!transactionToDelete}
                onClose={() => setTransactionToDelete(null)}
                onConfirm={confirmDeleteTransaction}
                title="Delete Transaction"
                message="Are you sure you want to delete this transaction? This action cannot be undone."
                confirmText="Yes, delete"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
}
