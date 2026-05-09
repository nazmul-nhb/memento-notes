import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, Lock, Mail, User, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema } from '@/lib/validations';
import type { IRegisterPayload } from '@/types';

interface RegisterFormProps {
    onSubmit: (payload: IRegisterPayload) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        // @ts-expect-error This is false negative but need to ignore because Vercel treats ts-expect-error as unused
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <div className="relative">
                    <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        autoComplete="name"
                        className="pl-10"
                        id="register-name"
                        placeholder="John Doe"
                        type="text"
                        {...register('name')}
                    />
                </div>
                {errors.name && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        autoComplete="email"
                        className="pl-10"
                        id="register-email"
                        placeholder="name@example.com"
                        type="email"
                        {...register('email')}
                    />
                </div>
                {errors.email && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                    <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        autoComplete="new-password"
                        className="pl-10"
                        id="register-password"
                        placeholder="At least 6 characters"
                        type="password"
                        {...register('password')}
                    />
                </div>
                {errors.password && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <Button
                className="w-full bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
                disabled={isLoading}
                type="submit"
            >
                {isLoading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                    <UserPlus className="mr-2 size-4" />
                )}
                Create Account
            </Button>
        </form>
    );
}
