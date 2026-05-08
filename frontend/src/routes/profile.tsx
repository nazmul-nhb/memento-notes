import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Calendar, Mail, Shield, Sparkles, User } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/providers/auth-provider';

export const Route = createFileRoute('/profile')({
    component: ProfilePage,
});

function ProfilePage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <PageContainer className="flex min-h-[60vh] items-center justify-center">
                <div className="w-full max-w-lg space-y-4">
                    <Skeleton className="mx-auto size-20 rounded-full bg-white/10" />
                    <Skeleton className="mx-auto h-6 w-48 bg-white/10" />
                    <Skeleton className="mx-auto h-4 w-32 bg-white/5" />
                </div>
            </PageContainer>
        );
    }

    if (!user) return null;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formattedDate = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <PageContainer>
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm">
                    {/* Gradient banner */}
                    <div className="h-24 bg-linear-to-r from-violet-600/40 via-indigo-600/40 to-cyan-600/40" />

                    <div className="-mt-12 px-6">
                        <Avatar className="size-20 border-4 border-card">
                            <AvatarFallback className="bg-linear-to-br from-violet-500 to-indigo-600 text-xl text-white">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <CardHeader className="pt-3">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-white">{user.name}</h1>
                            {user.role === 'admin' && (
                                <Badge className="bg-violet-500/10 text-violet-400">
                                    <Shield className="mr-1 size-3" />
                                    Admin
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="size-4" />
                            {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="size-4" />
                            Joined {formattedDate}
                        </div>

                        {user.interests && user.interests.length > 0 && (
                            <>
                                <Separator className="bg-white/10" />
                                <div>
                                    <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-white">
                                        <Sparkles className="size-4 text-violet-400" />
                                        Interests
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {user.interests.map((interest) => (
                                            <Badge
                                                className="bg-violet-500/10 text-violet-400"
                                                key={interest}
                                                variant="secondary"
                                            >
                                                {interest}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <Separator className="bg-white/10" />

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="size-4" />
                            Role: <span className="capitalize text-white">{user.role}</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </PageContainer>
    );
}
