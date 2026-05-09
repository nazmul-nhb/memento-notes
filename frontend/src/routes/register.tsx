import { createFileRoute, Link, Navigate, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { RegisterForm } from '@/components/forms/register-form';
import { PageContainer } from '@/components/layout/page-container';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/providers/auth-provider';

export const Route = createFileRoute('/register')({
    component: RegisterPage,
});

function RegisterPage() {
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (payload: {
        name: string;
        email: string;
        password: string;
    }) => {
        setIsLoading(true);
        setError(null);
        try {
            await register(payload);
            toast.success('Account created! Please sign in.');
            navigate({ to: '/login' });
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message || 'Registration failed. Please try again.';
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
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>
                        Join Memento Notes to start capturing your ideas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm
                        error={error}
                        isLoading={isLoading}
                        onSubmit={handleRegister}
                    />
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            className="font-medium text-violet-400 hover:text-violet-300"
                            to="/login"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </PageContainer>
    );
}
