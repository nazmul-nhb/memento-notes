import { createFileRoute } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import { NotebookPen, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { NoteForm } from '@/components/forms/note-form';
import { PageContainer } from '@/components/layout/page-container';
import { EmptyState } from '@/components/shared/empty-state';
import { CardSkeletonGrid } from '@/components/shared/loading-skeleton';
import { NoteCard } from '@/components/shared/note-card';
import { PaginationControls } from '@/components/shared/pagination-controls';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useCreateNote, useDeleteNote, useNotes, useUpdateNote } from '@/hooks/use-notes';
import type { ICreateNotePayload, INote, IUpdateNotePayload } from '@/types';

export const Route = createFileRoute('/notes/')({
    component: NotesPage,
});

function NotesPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<INote | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data, isLoading } = useNotes({ page, limit });
    const createNote = useCreateNote();
    const updateNote = useUpdateNote();
    const deleteNote = useDeleteNote();

    const handleCreate = async (payload: ICreateNotePayload | IUpdateNotePayload) => {
        await createNote.mutateAsync(payload as ICreateNotePayload);
        setIsCreateOpen(false);
        toast.success('Note created successfully!');
    };

    const handleUpdate = async (payload: ICreateNotePayload | IUpdateNotePayload) => {
        if (!editingNote) return;
        await updateNote.mutateAsync({
            id: editingNote._id,
            payload: payload as IUpdateNotePayload,
        });
        setEditingNote(null);
        toast.success('Note updated successfully!');
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        await deleteNote.mutateAsync(deletingId);
        setDeletingId(null);
        toast.success('Note deleted successfully!');
    };

    return (
        <PageContainer>
            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Notes</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Your private notes, visible only to you.
                    </p>
                </div>
                <Button
                    className="bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
                    onClick={() => setIsCreateOpen(true)}
                >
                    <Plus className="mr-2 size-4" />
                    New Note
                </Button>
            </div>

            {/* Notes Grid */}
            {isLoading ? (
                <CardSkeletonGrid count={6} />
            ) : data?.notes?.length ? (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {data.notes.map((note) => (
                                <NoteCard
                                    key={note._id}
                                    note={note}
                                    onDelete={setDeletingId}
                                    onEdit={setEditingNote}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    {data.meta && (
                        <PaginationControls 
                            meta={data.meta} 
                            onPageChange={setPage} 
                            onLimitChange={(newLimit) => {
                                setLimit(newLimit);
                                setPage(1);
                            }}
                        />
                    )}
                </>
            ) : (
                <EmptyState
                    description="Create your first note to get started."
                    icon={<NotebookPen className="size-8 text-muted-foreground" />}
                    title="No notes yet"
                />
            )}

            {/* Create Dialog */}
            <Dialog onOpenChange={setIsCreateOpen} open={isCreateOpen}>
                <DialogContent className="border-white/10 bg-card">
                    <DialogHeader>
                        <DialogTitle>Create Note</DialogTitle>
                        <DialogDescription>Add a new private note.</DialogDescription>
                    </DialogHeader>
                    <NoteForm
                        isLoading={createNote.isPending}
                        mode="create"
                        onSubmit={handleCreate}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog onOpenChange={(open) => !open && setEditingNote(null)} open={!!editingNote}>
                <DialogContent className="border-white/10 bg-card">
                    <DialogHeader>
                        <DialogTitle>Edit Note</DialogTitle>
                        <DialogDescription>Update your note details.</DialogDescription>
                    </DialogHeader>
                    {editingNote && (
                        <NoteForm
                            initialData={editingNote}
                            isLoading={updateNote.isPending}
                            mode="edit"
                            onSubmit={handleUpdate}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog
                onOpenChange={(open) => !open && setDeletingId(null)}
                open={!!deletingId}
            >
                <AlertDialogContent className="border-white/10 bg-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            note.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/80"
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PageContainer>
    );
}
