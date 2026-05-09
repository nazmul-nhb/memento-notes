import { createFileRoute, Link, Navigate, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { LoginForm } from '@/components/forms/login-form';
import { PageContainer } from '@/components/layout/page-container';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/providers/auth-provider';

export const Route = createFileRoute('/login')({
    component: LoginPage,
});

function LoginPage() {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (payload: { email: string; password: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            await login(payload);
            navigate({ to: '/' });
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message || 'Login failed. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <PageContainer className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
            <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>Sign in to your Memento Notes account</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm error={error} isLoading={isLoading} onSubmit={handleLogin} />
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link
                            className="font-medium text-violet-400 hover:text-violet-300"
                            to="/register"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </PageContainer>
    );
}
