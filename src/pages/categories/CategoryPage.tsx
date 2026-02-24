import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { QueryErrorFallback } from '../../components/ui/QueryErrorFallback';
import { Plus } from 'lucide-react';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ModalHeaderActions } from '../../components/common/ModalHeaderActions';
import { useCategoryLogic } from './hooks/useCategoryLogic';
import { CategoryDesktop } from './components/CategoryDesktop';
import { CategoryMobile } from './components/CategoryMobile';
import { CategoryForm } from './components/CategoryForm';
import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { cn } from '../../lib/utils';

export default function CategoryPage() {
    const { state, actions } = useCategoryLogic();
    const isMobile = useIsMobile();

    if (state.error) {
        return <QueryErrorFallback error={state.error} resetErrorBoundary={actions.refetch} title="Failed to load categories" />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div
                className={cn(
                    // Layout & Positioning
                    "sticky top-16 md:top-0 z-20 md:static flex flex-col gap-4",
                    // Spacing
                    "-m-4 sm:-m-6 p-4 sm:p-6 pb-4 md:m-0 md:p-0",
                    // Background & Borders
                    "bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md md:bg-transparent md:backdrop-blur-none",
                    "border-b border-slate-200/50 dark:border-slate-800/50 md:border-none"
                )}
            >
                <div className="flex flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Categories
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 hidden md:block">
                            Manage your incoming and outgoing categories.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={actions.handleOpenCreate} className="gap-2 shadow-lg shadow-brand-primary/20 shrink-0 hidden sm:inline-flex">
                            <Plus className="h-4 w-4" />
                            <span>Add Category</span>
                        </Button>
                        <Button onClick={actions.handleOpenCreate} variant="outline" size="sm" className="shadow-lg shadow-brand-primary/20 sm:hidden shrink-0 gap-2 h-10 px-3">
                            <Plus className="h-4 w-4" />
                            <span className="text-sm font-medium">Add</span>
                        </Button>
                    </div>
                </div>
            </div>

            {state.isLoading ? (
                <div className="text-slate-500">Loading categories...</div>
            ) : isMobile ? (
                <CategoryMobile
                    categories={state.categories}
                    onEdit={actions.handleOpenEdit}
                    onDelete={actions.handleDelete}
                />
            ) : (
                <CategoryDesktop
                    categories={state.categories}
                    onEdit={actions.handleOpenEdit}
                    onDelete={actions.handleDelete}
                />
            )}

            {/* Modal */}
            {state.isModalOpen && (
                <div className="fixed inset-0 z-50 sm:flex sm:items-center sm:justify-center p-0 sm:p-6">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={actions.closeFormModal} />
                    <Card
                        className={cn(
                            // Form Factor & Positioning
                            "fixed top-10 bottom-24 left-4 right-4",
                            "sm:relative sm:top-auto sm:bottom-auto sm:left-auto sm:right-auto sm:w-full sm:max-w-lg sm:h-auto",
                            // Layout
                            "flex flex-col transform overflow-hidden sm:overflow-visible p-0",
                            // Styling & Animations
                            "rounded-2xl bg-white shadow-2xl transition-all dark:bg-brand-surface",
                            "animate-in zoom-in-95 duration-200"
                        )}
                    >
                        <CardHeader className="shrink-0 flex flex-row items-center justify-between border-b border-slate-100 p-4 sm:p-6 dark:border-slate-800">
                            <CardTitle className="text-lg md:text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 flex-none">
                                {state.editingCategory ? 'Edit Category' : 'Add Category'}
                            </CardTitle>

                            <div className="flex items-center gap-2">
                                <ModalHeaderActions
                                    onCancel={actions.closeFormModal}
                                    formId="category-form"
                                />
                            </div>
                        </CardHeader>
                        <div className="flex flex-col sm:overflow-visible overflow-y-auto w-full md:h-auto min-h-0">
                            <div className="p-4 sm:p-6 pb-12 sm:pb-6 space-y-6 flex-1">
                                <CategoryForm
                                    id="category-form"
                                    initialData={state.editingCategory || undefined}
                                    onSubmit={actions.handleSubmit}
                                    onCancel={actions.closeFormModal}
                                    isLoading={state.isSaving}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!state.categoryToDelete}
                onClose={actions.closeDeleteModal}
                onConfirm={actions.confirmDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Yes, delete"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
}
