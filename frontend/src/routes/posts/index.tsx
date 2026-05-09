import { createFileRoute } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import { Plus, StickyNote } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { PostForm } from '@/components/forms/post-form';
import { PageContainer } from '@/components/layout/page-container';
import { EmptyState } from '@/components/shared/empty-state';
import { CardSkeletonGrid } from '@/components/shared/loading-skeleton';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { PostCard } from '@/components/shared/post-card';
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
import { useCreatePost, useDeletePost, usePosts, useUpdatePost } from '@/hooks/use-posts';
import { useAuth } from '@/providers/auth-provider';
import type { ICreatePostPayload, IPost, IUpdatePostPayload } from '@/types';

export const Route = createFileRoute('/posts/')({
    component: PostsPage,
});

function PostsPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<IPost | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { user, isAuthenticated } = useAuth();
    const { data, isLoading } = usePosts({ page, limit });
    const createPost = useCreatePost();
    const updatePost = useUpdatePost();
    const deletePost = useDeletePost();

    const isOwner = (post: IPost) => {
        if (!user) return false;
        const authorId = typeof post.user_id === 'object' ? post.user_id._id : post.user_id;
        return authorId === user._id;
    };

    const handleCreate = async (payload: ICreatePostPayload | IUpdatePostPayload) => {
        await createPost.mutateAsync(payload as ICreatePostPayload);
        setIsCreateOpen(false);
        toast.success('Post published successfully!');
    };

    const handleUpdate = async (payload: ICreatePostPayload | IUpdatePostPayload) => {
        if (!editingPost) return;
        await updatePost.mutateAsync({
            id: editingPost._id,
            payload: payload as IUpdatePostPayload,
        });
        setEditingPost(null);
        toast.success('Post updated successfully!');
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        await deletePost.mutateAsync(deletingId);
        setDeletingId(null);
        toast.success('Post deleted successfully!');
    };

    return (
        <PageContainer>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Posts</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Explore ideas shared by the community.
                    </p>
                </div>
                {isAuthenticated && (
                    <Button
                        className="bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="mr-2 size-4" />
                        New Post
                    </Button>
                )}
            </div>

            {isLoading ? (
                <CardSkeletonGrid count={6} />
            ) : data?.posts?.length ? (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {data.posts.map((post) => (
                                <PostCard
                                    isOwner={isOwner(post)}
                                    key={post._id}
                                    onDelete={setDeletingId}
                                    onEdit={setEditingPost}
                                    post={post}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    {data.meta && (
                        <PaginationControls
                            meta={data.meta}
                            onLimitChange={(newLimit) => {
                                setLimit(newLimit);
                                setPage(1);
                            }}
                            onPageChange={setPage}
                        />
                    )}
                </>
            ) : (
                <EmptyState
                    description="Be the first to share something!"
                    icon={<StickyNote className="size-8 text-muted-foreground" />}
                    title="No posts yet"
                />
            )}

            {/* Create Dialog */}
            <Dialog onOpenChange={setIsCreateOpen} open={isCreateOpen}>
                <DialogContent className="border-white/10 bg-card">
                    <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>
                        <DialogDescription>
                            Share your thoughts with the community.
                        </DialogDescription>
                    </DialogHeader>
                    <PostForm
                        isLoading={createPost.isPending}
                        mode="create"
                        onSubmit={handleCreate}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog onOpenChange={(open) => !open && setEditingPost(null)} open={!!editingPost}>
                <DialogContent className="border-white/10 bg-card">
                    <DialogHeader>
                        <DialogTitle>Edit Post</DialogTitle>
                        <DialogDescription>Update your post.</DialogDescription>
                    </DialogHeader>
                    {editingPost && (
                        <PostForm
                            initialData={editingPost}
                            isLoading={updatePost.isPending}
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
                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            post.
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
