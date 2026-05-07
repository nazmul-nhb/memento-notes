import { STATUS_CODES } from 'nhb-toolbox/constants';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { QueryBuilder } from '@/classes/QueryBuilder';
import { Post } from '@/modules/post/post.model';
import type { IPost } from '@/modules/post/post.types';

const createPostInDB = async (payload: IPost) => {
	const newPost = await Post.create(payload);

	return newPost;
};

const getAllPostsFromDB = async (query?: Record<string, unknown>) => {
	const postQuery = new QueryBuilder(Post.find(), query).sort();
	// const posts = await Post.find({});

	const posts = await postQuery.modelQuery;

	return posts;
};

const getSinglePostFromDB = async (id: string) => {
	const post_1 = await Post.findPostById(id);

	return post_1;
};

const updatePostInDB = async (id: string, payload: Partial<IPost>) => {
	const updatedPost = await Post.findOneAndUpdate({ _id: id }, payload, {
		runValidators: true,
		new: true,
	});

	if (!updatedPost) {
		throw new ErrorWithStatus(
			'Not Updated Error',
			`Cannot update specified post with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'update_post'
		);
	}

	return updatedPost;
};

const deletePostFromDB = async (id: string) => {
	const result = await Post.deleteOne({ _id: id });

	if (result.deletedCount < 1) {
		throw new ErrorWithStatus(
			'Delete Failed Error',
			`Failed to delete post with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'delete_post'
		);
	}
};

export const postServices = {
	createPostInDB,
	getAllPostsFromDB,
	getSinglePostFromDB,
	updatePostInDB,
	deletePostFromDB,
};
