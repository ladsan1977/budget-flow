import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger'
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <Card className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-0 shadow-2xl transition-all dark:bg-brand-surface animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="flex flex-row items-center gap-3 border-b border-slate-100 p-6 dark:border-slate-800">
                    {variant === 'danger' && <AlertTriangle className="h-6 w-6 text-red-500" />}
                    <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <div className="p-6 text-slate-600 dark:text-slate-300 whitespace-pre-line">
                    {message}
                </div>
                <div className="flex justify-end gap-3 border-t border-slate-100 p-6 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20">
                    <Button variant="ghost" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        className="px-6 shadow-md"
                    >
                        {confirmText}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
