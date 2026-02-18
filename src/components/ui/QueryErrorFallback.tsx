import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface QueryErrorFallbackProps {
    error: Error;
    resetErrorBoundary?: () => void;
    title?: string;
}

export function QueryErrorFallback({
    error,
    resetErrorBoundary,
    title = 'Failed to load data',
}: QueryErrorFallbackProps) {
    return (
        <div className="flex items-center justify-center p-6">
            <Card className="w-full max-w-md border-brand-danger/20 bg-brand-danger/5">
                <CardHeader>
                    <div className="flex items-center gap-2 text-brand-danger">
                        <AlertCircle className="h-5 w-5" />
                        <CardTitle className="text-lg">{title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {error.message}
                    </p>
                    {resetErrorBoundary && (
                        <Button
                            onClick={resetErrorBoundary}
                            variant="outline"
                            className="w-full"
                        >
                            Retry
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
