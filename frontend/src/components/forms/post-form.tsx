import { Loader2, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ICreatePostPayload, IPost, IUpdatePostPayload } from '@/types';

interface PostFormProps {
    initialData?: IPost;
    onSubmit: (payload: ICreatePostPayload | IUpdatePostPayload) => Promise<void>;
    isLoading?: boolean;
    mode?: 'create' | 'edit';
}

export function PostForm({ initialData, onSubmit, isLoading, mode = 'create' }: PostFormProps) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setBody(initialData.body);
        }
    }, [initialData]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (mode === 'edit') {
            const payload: IUpdatePostPayload = {};
            if (title !== initialData?.title) payload.title = title;
            if (body !== initialData?.body) payload.body = body;
            if (Object.keys(payload).length > 0) {
                await onSubmit(payload);
            }
        } else {
            await onSubmit({ title, body });
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label htmlFor="post-title">Title</Label>
                <Input
                    id="post-title"
                    maxLength={255}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title..."
                    required={mode === 'create'}
                    value={title}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="post-body">Body</Label>
                <Textarea
                    className="min-h-32 resize-y"
                    id="post-body"
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your post..."
                    required={mode === 'create'}
                    value={body}
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
                {mode === 'create' ? 'Publish Post' : 'Save Changes'}
            </Button>
        </form>
    );
}
