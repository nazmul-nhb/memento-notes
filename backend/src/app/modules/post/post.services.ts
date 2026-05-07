import { Types } from 'mongoose';
import { STATUS_CODES } from 'nhb-toolbox/constants';
import type { Maybe } from 'nhb-toolbox/types';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { QueryBuilder } from '@/classes/QueryBuilder';
import { Post } from '@/modules/post/post.model';
import type { IPost } from '@/modules/post/post.types';
import { User } from '@/modules/user/user.model';
import { getQueryMeta } from '@/utilities/queryHelpers';

const createPostInDB = async (payload: IPost, userId: Maybe<string>) => {
	const newPost = await Post.create({ ...payload, user_id: userId });

	return newPost;
};

const getAllPostsFromDB = async (query?: Record<string, unknown>) => {
	const postQuery = new QueryBuilder(Post.find(), query).sort().paginate();

	const meta = await getQueryMeta(Post, postQuery.modelQuery, query);

	const posts = await postQuery.modelQuery.populate('user_id', 'name email');

	return { meta, posts };
};

const getSinglePostFromDB = async (id: string) => {
	const post = await Post.findPostById(id);

	return post;
};

const getSpecificUserPostsFromDB = async (userId: string) => {
	// ! COuld have done it simply using Post.find() method
	// const postQuery = new QueryBuilder(Post.find({ user_id: userId }), query).sort().paginate();

	const [userWithPosts] = await User.aggregate([
		{
			$match: { _id: new Types.ObjectId(userId) },
		},
		{
			$lookup: {
				from: 'posts',
				localField: '_id',
				foreignField: 'user_id',
				as: 'posts',
			},
		},
		{ $project: { password: 0, interests: 0, posts: { user_id: 0 } } },
	]);

	return userWithPosts;
};

const updatePostInDB = async (id: string, payload: Partial<IPost>) => {
	const updatedPost = await Post.findOneAndUpdate({ _id: id }, payload, {
		runValidators: true,
		returnDocument: 'after',
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

	return result;
};

export const postServices = {
	createPostInDB,
	getAllPostsFromDB,
	getSinglePostFromDB,
	getSpecificUserPostsFromDB,
	updatePostInDB,
	deletePostFromDB,
};
