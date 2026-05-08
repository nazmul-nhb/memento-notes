import { Loader2, Save, X } from 'lucide-react';
import type { FormEvent, KeyboardEvent } from 'react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ICreateUserPayload, IUpdateUserPayload, IUser, TUserRole } from '@/types';

interface UserFormProps {
    initialData?: IUser;
    onSubmit: (payload: ICreateUserPayload | IUpdateUserPayload) => Promise<void>;
    isLoading?: boolean;
    mode?: 'create' | 'edit';
}

export function UserForm({ initialData, onSubmit, isLoading, mode = 'create' }: UserFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<TUserRole>('user');
    const [interests, setInterests] = useState<string[]>([]);
    const [interestInput, setInterestInput] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setEmail(initialData.email);
            setRole(initialData.role);
            setInterests(initialData.interests || []);
        }
    }, [initialData]);

    const addInterest = () => {
        const trimmed = interestInput.trim().toLowerCase();
        if (trimmed && !interests.includes(trimmed)) {
            setInterests([...interests, trimmed]);
            setInterestInput('');
        }
    };

    const removeInterest = (interest: string) => {
        setInterests(interests.filter((i) => i !== interest));
    };

    const handleInterestKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addInterest();
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (mode === 'edit') {
            const payload: IUpdateUserPayload = {};
            if (name !== initialData?.name) payload.name = name;
            if (email !== initialData?.email) payload.email = email;
            if (password) payload.password = password;
            if (role !== initialData?.role) payload.role = role;
            if (JSON.stringify(interests) !== JSON.stringify(initialData?.interests)) {
                payload.interests = interests;
            }
            if (Object.keys(payload).length > 0) {
                await onSubmit(payload);
            }
        } else {
            await onSubmit({
                name,
                email,
                password,
                role,
                interests: interests.length > 0 ? interests : undefined,
            });
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label htmlFor="user-name">Name</Label>
                <Input
                    id="user-name"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    required={mode === 'create'}
                    value={name}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                    id="user-email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required={mode === 'create'}
                    type="email"
                    value={email}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="user-password">
                    Password {mode === 'edit' && '(leave blank to keep current)'}
                </Label>
                <Input
                    id="user-password"
                    maxLength={56}
                    minLength={6}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'edit' ? 'Leave blank to keep current' : 'Password'}
                    required={mode === 'create'}
                    type="password"
                    value={password}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="user-role">Role</Label>
                <select
                    className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    id="user-role"
                    onChange={(e) => setRole(e.target.value as TUserRole)}
                    value={role}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="user-interests">Interests</Label>
                <div className="flex gap-2">
                    <Input
                        id="user-interests"
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyDown={handleInterestKeyDown}
                        placeholder="Type and press Enter..."
                        value={interestInput}
                    />
                    <Button onClick={addInterest} type="button" variant="outline">
                        Add
                    </Button>
                </div>
                {interests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {interests.map((interest) => (
                            <Badge
                                className="gap-1 bg-violet-500/10 text-violet-400"
                                key={interest}
                                variant="secondary"
                            >
                                {interest}
                                <button
                                    className="ml-0.5 rounded-full hover:bg-white/10"
                                    onClick={() => removeInterest(interest)}
                                    type="button"
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
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
                    <Save className="mr-2 size-4" />
                )}
                {mode === 'create' ? 'Create User' : 'Update User'}
            </Button>
        </form>
    );
}
