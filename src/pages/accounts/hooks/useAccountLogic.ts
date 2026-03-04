import { useState, useMemo } from 'react';
import { useAccounts, useAccountMutations } from '../../../hooks/useAccounts';
import type { Account } from '../../../types';

export function useAccountLogic() {
    const { data: accounts = [], isLoading, error, refetch } = useAccounts();
    const { createAccountMutation, updateAccountMutation, deleteAccountMutation } = useAccountMutations();

    const sortedAccounts = useMemo(() => {
        return [...accounts].sort((a, b) => {
            // Put defaults first
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;

            // Then sort by type
            if (a.type !== b.type) {
                return a.type.localeCompare(b.type);
            }

            // Then by name
            return a.name.localeCompare(b.name);
        });
    }, [accounts]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

    const handleOpenCreate = () => {
        setEditingAccount(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (account: Account) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setAccountToDelete(id);
    };

    const confirmDelete = () => {
        if (accountToDelete) {
            deleteAccountMutation.mutate(accountToDelete);
            setAccountToDelete(null);
        }
    };

    const closeDeleteModal = () => {
        setAccountToDelete(null);
    };

    const closeFormModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (data: Partial<Account>) => {
        if (editingAccount) {
            updateAccountMutation.mutate({ id: editingAccount.id, updates: data }, {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            createAccountMutation.mutate(data as Omit<Account, 'id' | 'userId' | 'createdAt'>, {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    return {
        state: {
            accounts: sortedAccounts,
            isLoading,
            error,
            isModalOpen,
            editingAccount,
            accountToDelete,
            isSaving: createAccountMutation.isPending || updateAccountMutation.isPending
        },
        actions: {
            refetch,
            handleOpenCreate,
            handleOpenEdit,
            handleDelete,
            confirmDelete,
            closeDeleteModal,
            closeFormModal,
            handleSubmit,
            setIsModalOpen
        }
    };
}
