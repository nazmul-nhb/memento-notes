import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { postCreationSchema, postUpdateSchema } from '@/lib/validations';
import type { ICreatePostPayload, IPost, IUpdatePostPayload } from '@/types';

interface PostFormProps {
	initialData?: IPost;
	onSubmit: (payload: ICreatePostPayload | IUpdatePostPayload) => Promise<void>;
	isLoading?: boolean;
	mode?: 'create' | 'edit';
}

type PostFormValues = z.infer<typeof postCreationSchema>;

export function PostForm({ initialData, onSubmit, isLoading, mode = 'create' }: PostFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, dirtyFields },
	} = useForm<PostFormValues>({
		// @ts-ignore This is false negative but need to ignore because Vercel treats ts-expect-error as unused
		resolver: zodResolver(mode === 'create' ? postCreationSchema : postUpdateSchema),
		defaultValues: {
			title: '',
			body: '',
		},
	});

	useEffect(() => {
		if (initialData) {
			reset({
				title: initialData.title,
				body: initialData.body,
			});
		}
	}, [initialData, reset]);

	const handleFormSubmit = async (data: PostFormValues) => {
		if (mode === 'edit') {
			const payload: IUpdatePostPayload = {};
			if (dirtyFields.title) payload.title = data.title;
			if (dirtyFields.body) payload.body = data.body;

			if (Object.keys(payload).length > 0) {
				await onSubmit(payload);
			}
		} else {
			await onSubmit(data);
		}
	};

	return (
		// @ts-ignore This is false negative but need to ignore because Vercel treats ts-expect-error as unused
		<form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
			<div className="space-y-2">
				<Label htmlFor="post-title">Title</Label>
				<Input id="post-title" placeholder="Post title..." {...register('title')} />
				{errors.title && (
					<p className="text-sm font-medium text-destructive">
						{errors.title.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="post-body">Body</Label>
				<Textarea
					className="min-h-32 max-h-64 resize-y"
					id="post-body"
					placeholder="Write your post..."
					{...register('body')}
				/>
				{errors.body && (
					<p className="text-sm font-medium text-destructive">
						{errors.body.message}
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
				{mode === 'create' ? 'Publish Post' : 'Save Changes'}
			</Button>
		</form>
	);
}
