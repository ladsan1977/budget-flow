import { QueryErrorFallback } from '../../components/ui/QueryErrorFallback';
import { TransactionModal } from '../../components/transactions/TransactionModal';
import { InfoModal } from '../../components/common/InfoModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { useFixedExpensesLogic } from './hooks/useFixedExpensesLogic';
import { FixedExpensesDesktop } from './components/FixedExpensesDesktop';
import { FixedExpensesMobile } from './components/FixedExpensesMobile';
import { FixedExpensesReplicationModal } from './components/FixedExpensesReplicationModal';

export default function FixedExpensesPage() {
    const isMobile = useIsMobile();
    const logic = useFixedExpensesLogic();

    const {
        data: { draftTransactions, sourceMonthName, targetMonthName },
        modals: {
            isReplicateModalOpen, setIsReplicateModalOpen,
            isAddModalOpen, setIsAddModalOpen,
            editingTransaction, setEditingTransaction,
            isInfoModalOpen, setIsInfoModalOpen,
            isConfirmModalOpen, setIsConfirmModalOpen,
            transactionToDelete, setTransactionToDelete,
            infoMessage
        },
        actions: {
            handleConfirmReplication,
            proceedWithReplication,
            handleDraftChange,
            removeDraft,
            confirmDeleteTransaction
        },
        queryState: { error, isPending }
    } = logic;

    if (error) {
        return <QueryErrorFallback error={error as Error} title="Failed to load fixed expenses" />;
    }

    return (
        <>
            {isMobile ? (
                <FixedExpensesMobile {...logic} />
            ) : (
                <FixedExpensesDesktop {...logic} />
            )}

            {/* Replication Modal */}
            <FixedExpensesReplicationModal
                isOpen={isReplicateModalOpen}
                onOpenChange={setIsReplicateModalOpen}
                onConfirm={handleConfirmReplication}
                draftTransactions={draftTransactions}
                sourceMonthName={sourceMonthName}
                targetMonthName={targetMonthName}
                isPending={isPending}
                onDraftChange={handleDraftChange}
                onRemoveDraft={removeDraft}
            />

            {/* Add/Edit Transaction Modal */}
            <TransactionModal
                isOpen={isAddModalOpen || !!editingTransaction}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingTransaction(null);
                }}
                initialType="fixed"
                lockType={true}
                initialData={editingTransaction}
            />

            {/* Clone Last Month Modals */}
            <InfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                title="Info"
                message={infoMessage}
            />
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={proceedWithReplication}
                title="Overwrite current month"
                message={"You already have fixed expenses registered for this month.\n\nIf you clone the previous month, ALL the fixed expenses of the current month will be permanently deleted and replaced.\n\nDo you want to continue?"}
                confirmText="Yes, overwrite"
                cancelText="Cancel"
                variant="danger"
            />
            <ConfirmModal
                isOpen={!!transactionToDelete}
                onClose={() => setTransactionToDelete(null)}
                onConfirm={confirmDeleteTransaction}
                title="Delete Expense"
                message="Are you sure you want to delete this expense? This action cannot be undone."
                confirmText="Yes, delete"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
}
