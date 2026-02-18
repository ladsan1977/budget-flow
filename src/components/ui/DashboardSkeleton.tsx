import { Card, CardHeader, CardContent } from './Card';

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-9 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                    <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
            </div>

            {/* Summary Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                            <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2" />
                            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardContent className="p-6">
                        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
