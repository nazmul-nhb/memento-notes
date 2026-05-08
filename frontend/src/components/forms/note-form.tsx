import { Loader2, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ICreateNotePayload, INote, IUpdateNotePayload } from '@/types';

interface NoteFormProps {
    initialData?: INote;
    onSubmit: (payload: ICreateNotePayload | IUpdateNotePayload) => Promise<void>;
    isLoading?: boolean;
    mode?: 'create' | 'edit';
}

export function NoteForm({ initialData, onSubmit, isLoading, mode = 'create' }: NoteFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
        }
    }, [initialData]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (mode === 'edit') {
            const payload: IUpdateNotePayload = {};
            if (title !== initialData?.title) payload.title = title;
            if (content !== initialData?.content) payload.content = content;
            if (Object.keys(payload).length > 0) {
                await onSubmit(payload);
            }
        } else {
            await onSubmit({ title, content });
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label htmlFor="note-title">Title</Label>
                <Input
                    id="note-title"
                    maxLength={255}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title..."
                    required={mode === 'create'}
                    value={title}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="note-content">Content</Label>
                <Textarea
                    className="min-h-32 resize-y"
                    id="note-content"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your note..."
                    required={mode === 'create'}
                    value={content}
                />
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
