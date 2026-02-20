import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export function InfoModal({ isOpen, onClose, title, message }: InfoModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <Card className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-0 shadow-2xl transition-all dark:bg-brand-surface animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="border-b border-slate-100 p-6 dark:border-slate-800">
                    <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <div className="p-6 text-slate-600 dark:text-slate-300">
                    {message}
                </div>
                <div className="flex justify-end gap-3 border-t border-slate-100 p-6 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20">
                    <Button onClick={onClose} className="px-6 shadow-md shadow-brand-primary/20">
                        Close
                    </Button>
                </div>
            </Card>
        </div>
    );
}
