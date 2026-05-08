import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, X } from 'lucide-react';
import { type KeyboardEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userCreationSchema, userUpdateSchema } from '@/lib/validations';
import type { ICreateUserPayload, IUpdateUserPayload, IUser, TUserRole } from '@/types';

interface UserFormProps {
	initialData?: IUser;
	onSubmit: (payload: ICreateUserPayload | IUpdateUserPayload) => Promise<void>;
	isLoading?: boolean;
	mode?: 'create' | 'edit';
}

type UserFormValues = z.infer<typeof userCreationSchema>;

export function UserForm({ initialData, onSubmit, isLoading, mode = 'create' }: UserFormProps) {
	const [interestInput, setInterestInput] = useState('');

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, dirtyFields },
	} = useForm<UserFormValues>({
		// @ts-ignore
		resolver: zodResolver(mode === 'create' ? userCreationSchema : userUpdateSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			role: 'user',
			interests: [],
		},
	});

	const interests = watch('interests') || [];

	useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.name,
				email: initialData.email,
				role: initialData.role,
				interests: initialData.interests || [],
				password: '',
			});
		}
	}, [initialData, reset]);

	const addInterest = () => {
		const trimmed = interestInput.trim().toLowerCase();
		if (trimmed && !interests.includes(trimmed)) {
			setValue('interests', [...interests, trimmed], { shouldDirty: true });
			setInterestInput('');
		}
	};

	const removeInterest = (interest: string) => {
		setValue(
			'interests',
			interests.filter((i) => i !== interest),
			{ shouldDirty: true }
		);
	};

	const handleInterestKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addInterest();
		}
	};

	const handleFormSubmit = async (data: UserFormValues) => {
		if (mode === 'edit') {
			const payload: IUpdateUserPayload = {};
			if (dirtyFields.name && data.name) payload.name = data.name;
			if (dirtyFields.email && data.email) payload.email = data.email;
			if (data.password) payload.password = data.password;
			if (dirtyFields.role && data.role) payload.role = data.role as TUserRole;

			if (JSON.stringify(data.interests) !== JSON.stringify(initialData?.interests)) {
				payload.interests = data.interests;
			}
			if (Object.keys(payload).length > 0) {
				await onSubmit(payload);
			}
		} else {
			await onSubmit({
				name: data.name!,
				email: data.email!,
				password: data.password!,
				role: data.role || 'user',
				interests:
					data.interests && data.interests.length > 0 ? data.interests : undefined,
			});
		}
	};

	return (
		// @ts-ignore
		<form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
			<div className="space-y-2">
				<Label htmlFor="user-name">Name</Label>
				<Input id="user-name" placeholder="Full name" {...register('name')} />
				{errors.name && (
					<p className="text-sm font-medium text-destructive">
						{errors.name.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="user-email">Email</Label>
				<Input
					id="user-email"
					placeholder="email@example.com"
					type="email"
					{...register('email')}
				/>
				{errors.email && (
					<p className="text-sm font-medium text-destructive">
						{errors.email.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="user-password">
					Password {mode === 'edit' && '(leave blank to keep current)'}
				</Label>
				<Input
					id="user-password"
					placeholder={mode === 'edit' ? 'Leave blank to keep current' : 'Password'}
					type="password"
					{...register('password')}
				/>
				{errors.password && (
					<p className="text-sm font-medium text-destructive">
						{errors.password.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="user-role">Role</Label>
				<select
					className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					id="user-role"
					{...register('role')}
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
				{errors.interests && (
					<p className="text-sm font-medium text-destructive">
						{errors.interests.message}
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
					<Save className="mr-2 size-4" />
				)}
				{mode === 'create' ? 'Create User' : 'Update User'}
			</Button>
		</form>
	);
}
