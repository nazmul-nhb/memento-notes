import type { Document, Model, Types } from 'mongoose';
import type z from 'zod';
import type { postValidations } from '@/modules/post/post.validation';

export interface IPost extends z.infer<typeof postValidations.creationSchema> {
	user_id: Types.ObjectId;
}

export interface IPostDoc extends IPost, Document {
	_id: Types.ObjectId;
	created_at: string;
	updated_at: string;
}

export interface IPostModel extends Model<IPostDoc> {
	findPostById: (id: string) => Promise<IPostDoc>;
}
