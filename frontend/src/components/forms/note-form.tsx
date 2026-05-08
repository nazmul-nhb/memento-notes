import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { noteCreationSchema, noteUpdateSchema } from '@/lib/validations';
import type { ICreateNotePayload, INote, IUpdateNotePayload } from '@/types';

interface NoteFormProps {
	initialData?: INote;
	onSubmit: (payload: ICreateNotePayload | IUpdateNotePayload) => Promise<void>;
	isLoading?: boolean;
	mode?: 'create' | 'edit';
}

type NoteFormValues = z.infer<typeof noteCreationSchema>;

export function NoteForm({ initialData, onSubmit, isLoading, mode = 'create' }: NoteFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, dirtyFields },
	} = useForm<NoteFormValues>({
		// @ts-ignore
		resolver: zodResolver(mode === 'edit' ? noteUpdateSchema : noteCreationSchema),
		defaultValues: {
			title: '',
			content: '',
		},
	});

	useEffect(() => {
		if (initialData) {
			reset({
				title: initialData.title,
				content: initialData.content,
			});
		}
	}, [initialData, reset]);

	const handleFormSubmit = async (data: NoteFormValues) => {
		if (mode === 'edit') {
			const payload: IUpdateNotePayload = {};
			if (dirtyFields.title) payload.title = data.title;
			if (dirtyFields.content) payload.content = data.content;

			if (Object.keys(payload).length > 0) {
				await onSubmit(payload);
			}
		} else {
			await onSubmit(data);
		}
	};

	return (
		// @ts-ignore
		<form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
			<div className="space-y-2">
				<Label htmlFor="note-title">Title</Label>
				<Input id="note-title" placeholder="Note title..." {...register('title')} />
				{errors.title && (
					<p className="text-sm font-medium text-destructive">
						{errors.title.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="note-content">Content</Label>
				<Textarea
					className="min-h-32 max-h-64 resize-y"
					id="note-content"
					placeholder="Write your note..."
					{...register('content')}
				/>
				{errors.content && (
					<p className="text-sm font-medium text-destructive">
						{errors.content.message}
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
				{mode === 'create' ? 'Create Note' : 'Save Changes'}
			</Button>
		</form>
	);
}
