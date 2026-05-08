import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowRight, NotebookPen, StickyNote, Users } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';

export const Route = createFileRoute('/')({
    component: HomePage,
});

const features = [
    {
        icon: NotebookPen,
        title: 'Private Notes',
        description:
            'Keep your thoughts organized with secure, private notes that only you can access.',
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        icon: StickyNote,
        title: 'Public Posts',
        description: 'Share your ideas with the community through beautifully crafted posts.',
        gradient: 'from-indigo-500 to-blue-600',
    },
    {
        icon: Users,
        title: 'Admin Dashboard',
        description: 'Powerful admin tools to manage users, content, and gain insights.',
        gradient: 'from-cyan-500 to-teal-600',
    },
];

function HomePage() {
    const { isAuthenticated, user } = useAuth();

    return (
        <PageContainer>
            {/* Hero Section */}
            <div className="flex flex-col items-center py-16 text-center md:py-24">
                {/* Glowing badge */}
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-400"
                    initial={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-400 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-violet-500" />
                    </span>
                    {isAuthenticated
                        ? `Welcome back, ${user?.name}`
                        : 'Your second brain, reimagined'}
                </motion.div>

                <motion.h1
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.2 }}
                >
                    Capture ideas with{' '}
                    <span className="bg-linear-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Memento Notes
                    </span>
                </motion.h1>

                <motion.p
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 max-w-xl text-lg text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.3 }}
                >
                    A premium note-taking and blogging platform. Create private notes, share
                    public posts, and manage it all in one beautiful dark interface.
                </motion.p>

                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.4 }}
                >
                    {isAuthenticated ? (
                        <>
                            <Link to="/notes">
                                <Button className="bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500">
                                    <NotebookPen className="mr-2 size-4" />
                                    My Notes
                                </Button>
                            </Link>
                            <Link to="/posts">
                                <Button variant="outline">
                                    Browse Posts
                                    <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register">
                                <Button className="bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500">
                                    Get Started Free
                                    <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </Link>
                            <Link to="/posts">
                                <Button variant="outline">Explore Posts</Button>
                            </Link>
                        </>
                    )}
                </motion.div>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-6 pb-16 md:grid-cols-3">
                {features.map((feature, i) => (
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.07]"
                        initial={{ opacity: 0, y: 20 }}
                        key={feature.title}
                        transition={{ delay: 0.5 + i * 0.1 }}
                    >
                        {/* Hover glow */}
                        <div className="absolute -inset-px rounded-2xl bg-linear-to-b from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                        <div
                            className={`relative mb-4 flex size-12 items-center justify-center rounded-xl bg-linear-to-br ${feature.gradient} shadow-lg`}
                        >
                            <feature.icon className="size-6 text-white" />
                        </div>

                        <h3 className="relative text-lg font-semibold text-white">
                            {feature.title}
                        </h3>
                        <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Decorative background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 right-0 size-96 rounded-full bg-violet-600/10 blur-3xl" />
                <div className="absolute -bottom-40 left-0 size-96 rounded-full bg-indigo-600/10 blur-3xl" />
            </div>
        </PageContainer>
    );
}
