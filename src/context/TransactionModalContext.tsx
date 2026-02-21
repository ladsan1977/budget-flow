import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, TransactionType } from '../types';

interface ModalContextType {
    isOpen: boolean;
    initialType: TransactionType;
    lockType: boolean;
    initialData: Transaction | null;
    openModal: (options?: { initialType?: TransactionType; lockType?: boolean; initialData?: Transaction | null }) => void;
    closeModal: () => void;
}

const TransactionModalContext = createContext<ModalContextType | undefined>(undefined);

export function TransactionModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialType, setInitialType] = useState<TransactionType>('variable');
    const [lockType, setLockType] = useState(false);
    const [initialData, setInitialData] = useState<Transaction | null>(null);

    const openModal = (options?: { initialType?: TransactionType; lockType?: boolean; initialData?: Transaction | null }) => {
        setInitialType(options?.initialType ?? 'variable');
        setLockType(options?.lockType ?? false);
        setInitialData(options?.initialData ?? null);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setInitialData(null);
        setLockType(false);
    };

    return (
        <TransactionModalContext.Provider value={{ isOpen, initialType, lockType, initialData, openModal, closeModal }}>
            {children}
        </TransactionModalContext.Provider>
    );
}

export function useTransactionModal() {
    const context = useContext(TransactionModalContext);
    if (!context) {
        throw new Error('useTransactionModal must be used within a TransactionModalProvider');
    }
    return context;
}
