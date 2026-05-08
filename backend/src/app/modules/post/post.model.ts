import { model, Schema } from 'mongoose';
import { STATUS_CODES } from 'nhb-toolbox/constants';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import type { IPostDoc, IPostModel } from '@/modules/post/post.types';
import { validateObjectId } from '@/utilities/validateObjectId';

const postSchema = new Schema<IPostDoc>(
	{
		user_id: {
			type: Schema.Types.ObjectId,
			ref: 'Users',
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		body: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
		versionKey: false,
	}
);

// * User posts listing (with pagination sorted by created_at)
postSchema.index({ created_at: 'desc' });

// * For $lookup performance
postSchema.index({ user_id: 'asc' });

postSchema.statics.findPostById = async function (id: string) {
	validateObjectId(id, 'post', 'GET: /posts/:id');

	const post = await this.findById(id);

	if (!post) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No post found with ID ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'post'
		);
	}

	return post;
};

export const Post = model<IPostDoc, IPostModel>('Posts', postSchema);
