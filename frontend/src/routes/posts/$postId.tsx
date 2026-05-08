import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Loader2, User } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSinglePost } from '@/hooks/use-posts';

export const Route = createFileRoute('/posts/$postId')({
    component: SinglePostPage,
});

function SinglePostPage() {
    const { postId } = Route.useParams();
    const { data: post, isLoading } = useSinglePost(postId);

    if (isLoading) {
        return (
            <PageContainer className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-violet-500" />
            </PageContainer>
        );
    }

    if (!post) {
        return (
            <PageContainer className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-white">Post not found</h2>
                    <p className="mt-2 text-muted-foreground">
                        The post you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link className="mt-4 inline-block" to="/posts">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to Posts
                        </Button>
                    </Link>
                </div>
            </PageContainer>
        );
    }

    const author = typeof post.user_id === 'object' ? post.user_id : null;
    const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <PageContainer>
            <Link className="mb-6 inline-flex" to="/posts">
                <Button size="sm" variant="ghost">
                    <ArrowLeft className="mr-2 size-4" />
                    Back to Posts
                </Button>
            </Link>

            <motion.article
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                    {post.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                    {author && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <User className="size-4" />
                            <span>{author.name}</span>
                        </div>
                    )}
                    <Badge
                        className="border-white/10 bg-white/5 text-muted-foreground"
                        variant="outline"
                    >
                        <Calendar className="mr-1 size-3" />
                        {formattedDate}
                    </Badge>
                </div>

                <Separator className="my-6 bg-white/10" />

                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                    {post.body.split('\n').map((paragraph, i) => (
                        <p className="mb-4" key={i}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </motion.article>
        </PageContainer>
    );
}
