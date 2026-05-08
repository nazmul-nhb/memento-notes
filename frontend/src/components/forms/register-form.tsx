import { AlertCircle, Loader2, Lock, Mail, User, UserPlus } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { IRegisterPayload } from '@/types';

interface RegisterFormProps {
    onSubmit: (payload: IRegisterPayload) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit({ name, email, password });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
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
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        type="text"
                        value={name}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        autoComplete="email"
                        className="pl-10"
                        id="register-email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        type="email"
                        value={email}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                    <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        autoComplete="new-password"
                        className="pl-10"
                        id="register-password"
                        maxLength={56}
                        minLength={6}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        type="password"
                        value={password}
                    />
                </div>
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
