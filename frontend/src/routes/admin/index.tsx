import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
    Edit,
    Loader2,
    NotebookPen,
    Plus,
    Shield,
    StickyNote,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UserForm } from '@/components/forms/user-form';
import { PageContainer } from '@/components/layout/page-container';
import { EmptyState } from '@/components/shared/empty-state';
import { CardSkeletonGrid, TableSkeleton } from '@/components/shared/loading-skeleton';
import { NoteCard } from '@/components/shared/note-card';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminNotes, useDeleteNote } from '@/hooks/use-notes';
import { useDeletePost, usePosts } from '@/hooks/use-posts';
import {
    useCreateUser,
    useDeleteUser,
    useUpdateUser,
    useUsers,
    useUsersByInterest,
} from '@/hooks/use-users';
import type { ICreateUserPayload, IUpdateUserPayload, IUser } from '@/types';

export const Route = createFileRoute('/admin/')({
    component: AdminPage,
});

function AdminPage() {
    const [userPage, setUserPage] = useState(1);
    const [userLimit, setUserLimit] = useState(10);
    const [notePage, setNotePage] = useState(1);
    const [noteLimit, setNoteLimit] = useState(12);
    const [postPage, setPostPage] = useState(1);
    const [postLimit, setPostLimit] = useState(12);
    const [interestFilter, setInterestFilter] = useState('');
    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<IUser | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
    const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

    const { data: usersData, isLoading: usersLoading } = useUsers({
        page: userPage,
        limit: userLimit,
    });
    const { data: notesData, isLoading: notesLoading } = useAdminNotes({
        page: notePage,
        limit: noteLimit,
    });
    const { data: postsData, isLoading: postsLoading } = usePosts({
        page: postPage,
        limit: postLimit,
    });
    const { data: interestGroups, isLoading: interestsLoading } = useUsersByInterest(
        interestFilter || undefined
    );

    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();
    const deleteNote = useDeleteNote();
    const deletePost = useDeletePost();

    const handleCreateUser = async (payload: ICreateUserPayload | IUpdateUserPayload) => {
        await createUser.mutateAsync(payload as ICreateUserPayload);
        setIsCreateUserOpen(false);
        toast.success('User created successfully!');
    };

    const handleUpdateUser = async (payload: ICreateUserPayload | IUpdateUserPayload) => {
        if (!editingUser) return;
        await updateUser.mutateAsync({
            id: editingUser._id,
            payload: payload as IUpdateUserPayload,
        });
        setEditingUser(null);
        toast.success('User updated successfully!');
    };

    const handleDeleteUser = async () => {
        if (!deletingUserId) return;
        try {
            await deleteUser.mutateAsync(deletingUserId);
            setDeletingUserId(null);
            toast.success('User deleted successfully!');
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message || 'Failed to delete user.';
            toast.error(message);
            setDeletingUserId(null);
        }
    };

    const handleDeleteNote = async () => {
        if (!deletingNoteId) return;
        try {
            await deleteNote.mutateAsync(deletingNoteId);
            setDeletingNoteId(null);
            toast.success('Note deleted successfully!');
        } catch {
            toast.error('Failed to delete note.');
            setDeletingNoteId(null);
        }
    };

    const handleDeletePost = async () => {
        if (!deletingPostId) return;
        try {
            await deletePost.mutateAsync(deletingPostId);
            setDeletingPostId(null);
            toast.success('Post deleted successfully!');
        } catch {
            toast.error('Failed to delete post.');
            setDeletingPostId(null);
        }
    };

    return (
        <PageContainer>
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Shield className="size-6 text-violet-400" />
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage users, view all notes, and explore interest groups.
                </p>
            </div>

            <Tabs className="space-y-6" defaultValue="users">
                <TabsList
                    aria-label="Admin Dashboard Tabs"
                    className="border border-white/10 bg-white/5"
                    variant={'line'}
                >
                    <TabsTrigger value="users">
                        <Users className="mr-1.5 size-4" />
                        Users
                    </TabsTrigger>
                    <TabsTrigger value="notes">
                        <NotebookPen className="mr-1.5 size-4" />
                        All Notes
                    </TabsTrigger>
                    <TabsTrigger value="posts">
                        <StickyNote className="mr-1.5 size-4" />
                        All Posts
                    </TabsTrigger>
                    <TabsTrigger value="interests">
                        <Shield className="mr-1.5 size-4" />
                        Interests
                    </TabsTrigger>
                </TabsList>

                {/* Users Tab */}
                <TabsContent value="users">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">User Management</h2>
                        <Button
                            className="bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
                            onClick={() => setIsCreateUserOpen(true)}
                        >
                            <Plus className="mr-2 size-4" />
                            Add User
                        </Button>
                    </div>

                    {usersLoading ? (
                        <TableSkeleton rows={5} />
                    ) : usersData?.users?.length ? (
                        <>
                            <div className="overflow-hidden rounded-xl border border-white/10">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Interests</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {usersData.users.map((user) => (
                                            <TableRow
                                                className="border-white/5 hover:bg-white/5"
                                                key={user._id}
                                            >
                                                <TableCell className="font-medium text-white">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {user.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            user.role === 'admin'
                                                                ? 'bg-violet-500/10 text-violet-400'
                                                                : 'bg-white/5 text-muted-foreground'
                                                        }
                                                        variant="secondary"
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.interests
                                                            ?.slice(0, 3)
                                                            .map((i) => (
                                                                <Badge
                                                                    className="bg-indigo-500/10 text-xs text-indigo-400"
                                                                    key={i}
                                                                    variant="secondary"
                                                                >
                                                                    {i}
                                                                </Badge>
                                                            ))}
                                                        {(user.interests?.length || 0) > 3 && (
                                                            <Badge
                                                                className="bg-white/5 text-xs text-muted-foreground"
                                                                variant="secondary"
                                                            >
                                                                +{user.interests?.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            onClick={() => setEditingUser(user)}
                                                            size="icon-xs"
                                                            variant="ghost"
                                                        >
                                                            <Edit className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                setDeletingUserId(user._id)
                                                            }
                                                            size="icon-xs"
                                                            variant="ghost"
                                                        >
                                                            <Trash2 className="size-3.5 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {usersData.meta && (
                                <PaginationControls
                                    meta={usersData.meta}
                                    onLimitChange={(limit) => {
                                        setUserLimit(limit);
                                        setUserPage(1);
                                    }}
                                    onPageChange={setUserPage}
                                />
                            )}
                        </>
                    ) : (
                        <EmptyState title="No users found" />
                    )}
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes">
                    <h2 className="mb-4 text-lg font-semibold text-white">All Notes</h2>

                    {notesLoading ? (
                        <CardSkeletonGrid count={6} />
                    ) : notesData?.notes?.length ? (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {notesData.notes.map((note) => (
                                    <NoteCard
                                        key={note._id}
                                        note={note}
                                        onDelete={setDeletingNoteId}
                                        showAuthor
                                    />
                                ))}
                            </div>
                            {notesData.meta && (
                                <PaginationControls
                                    meta={notesData.meta}
                                    onLimitChange={(limit) => {
                                        setNoteLimit(limit);
                                        setNotePage(1);
                                    }}
                                    onPageChange={setNotePage}
                                />
                            )}
                        </>
                    ) : (
                        <EmptyState title="No notes found" />
                    )}
                </TabsContent>

                {/* Posts Tab */}
                <TabsContent value="posts">
                    <h2 className="mb-4 text-lg font-semibold text-white">All Posts</h2>

                    {postsLoading ? (
                        <CardSkeletonGrid count={6} />
                    ) : postsData?.posts?.length ? (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {postsData.posts.map((post) => (
                                    <PostCard
                                        isOwner={true}
                                        key={post._id}
                                        onDelete={setDeletingPostId}
                                        post={post}
                                    />
                                ))}
                            </div>
                            {postsData.meta && (
                                <PaginationControls
                                    meta={postsData.meta}
                                    onLimitChange={(limit) => {
                                        setPostLimit(limit);
                                        setPostPage(1);
                                    }}
                                    onPageChange={setPostPage}
                                />
                            )}
                        </>
                    ) : (
                        <EmptyState title="No posts found" />
                    )}
                </TabsContent>

                {/* Interests Tab */}
                <TabsContent value="interests">
                    <div className="mb-4 flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-white">Users by Interest</h2>
                        <Input
                            className="max-w-xs"
                            onChange={(e) => setInterestFilter(e.target.value)}
                            placeholder="Filter by interest..."
                            value={interestFilter}
                        />
                    </div>

                    {interestsLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-8 animate-spin text-violet-500" />
                        </div>
                    ) : interestGroups && Array.isArray(interestGroups) ? (
                        interestGroups.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {interestGroups.map((group, idx) => {
                                    // Check if it's a grouped response (has count + users) or filtered flat list
                                    if ('count' in group && 'users' in group) {
                                        const g = group as {
                                            _id: string;
                                            count: number;
                                            users: Array<{
                                                _id: string;
                                                name: string;
                                                email: string;
                                            }>;
                                        };
                                        return (
                                            <motion.div
                                                animate={{ opacity: 1, y: 0 }}
                                                initial={{ opacity: 0, y: 10 }}
                                                key={g._id}
                                                transition={{
                                                    delay: idx * 0.05,
                                                }}
                                            >
                                                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                                    <CardHeader className="pb-2">
                                                        <div className="flex items-center justify-between">
                                                            <CardTitle className="text-base capitalize text-white">
                                                                {g._id}
                                                            </CardTitle>
                                                            <Badge
                                                                className="bg-violet-500/10 text-violet-400"
                                                                variant="secondary"
                                                            >
                                                                {g.count} user
                                                                {g.count !== 1 ? 's' : ''}
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-1.5">
                                                            {g.users.slice(0, 5).map((u) => (
                                                                <div
                                                                    className="flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-white/5"
                                                                    key={u._id}
                                                                >
                                                                    <span className="text-white">
                                                                        {u.name}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {u.email}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                            {g.users.length > 5 && (
                                                                <p className="pt-1 text-xs text-muted-foreground">
                                                                    +{g.users.length - 5} more
                                                                </p>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    }
                                    // Flat user list (filtered by specific interest)
                                    const u = group as {
                                        _id: string;
                                        name: string;
                                        email: string;
                                        role: string;
                                        interests: string[];
                                    };
                                    return (
                                        <motion.div
                                            animate={{ opacity: 1, y: 0 }}
                                            initial={{ opacity: 0, y: 10 }}
                                            key={u._id}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base text-white">
                                                        {u.name}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">
                                                        {u.email}
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {u.interests?.map((i) => (
                                                            <Badge
                                                                className="bg-indigo-500/10 text-xs text-indigo-400"
                                                                key={i}
                                                                variant="secondary"
                                                            >
                                                                {i}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <EmptyState title="No results found" />
                        )
                    ) : null}
                </TabsContent>
            </Tabs>

            {/* Create User Dialog */}
            <Dialog onOpenChange={setIsCreateUserOpen} open={isCreateUserOpen}>
                <DialogContent className="border-white/10 bg-card">
                    <DialogHeader>
                        <DialogTitle>Create User</DialogTitle>
                        <DialogDescription>Add a new user to the system.</DialogDescription>
                    </DialogHeader>
                    <UserForm
                        isLoading={createUser.isPending}
                        mode="create"
                        onSubmit={handleCreateUser}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog onOpenChange={(open) => !open && setEditingUser(null)} open={!!editingUser}>
                <DialogContent className="border-white/10 bg-card">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information.</DialogDescription>
                    </DialogHeader>
                    {editingUser && (
                        <UserForm
                            initialData={editingUser}
                            isLoading={updateUser.isPending}
                            mode="edit"
                            onSubmit={handleUpdateUser}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete User Confirmation */}
            <AlertDialog
                onOpenChange={(open) => !open && setDeletingUserId(null)}
                open={!!deletingUserId}
            >
                <AlertDialogContent className="border-white/10 bg-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the user and all their associated notes
                            and posts. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/80"
                            onClick={handleDeleteUser}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Note Confirmation */}
            <AlertDialog
                onOpenChange={(open) => !open && setDeletingNoteId(null)}
                open={!!deletingNoteId}
            >
                <AlertDialogContent className="border-white/10 bg-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the note.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/80"
                            onClick={handleDeleteNote}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Post Confirmation */}
            <AlertDialog
                onOpenChange={(open) => !open && setDeletingPostId(null)}
                open={!!deletingPostId}
            >
                <AlertDialogContent className="border-white/10 bg-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the post.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/80"
                            onClick={handleDeletePost}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PageContainer>
    );
}
