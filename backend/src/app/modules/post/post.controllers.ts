import { postServices } from '@/modules/post/post.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

const createPost = catchAsync(async (req, res) => {
	const newPost = await postServices.createPostInDB(req.body, req?.user?._id);

	sendResponse(res, 'Post', 'POST', newPost);
});

const getAllPosts = catchAsync(async (req, res) => {
	const posts = await postServices.getAllPostsFromDB(req.query);

	sendResponse(res, 'Post', 'GET', posts);
});

const getSinglePost = catchAsync(async (req, res) => {
	const post = await postServices.getSinglePostFromDB(req?.params?.id);

	sendResponse(res, 'Post', 'GET', post);
});

const getSpecificUserPosts = catchAsync(async (req, res) => {
	const posts = await postServices.getSpecificUserPostsFromDB(req?.params?.id);

	sendResponse(res, 'Post', 'GET', posts);
});

const updatePost = catchAsync(async (req, res) => {
	const post = await postServices.updatePostInDB(req?.params?.id, req?.body);

	sendResponse(res, 'Post', 'PATCH', post);
});

const deletePost = catchAsync(async (req, res) => {
	const result = await postServices.deletePostFromDB(req?.params?.id);

	sendResponse(res, 'Post', 'DELETE', result);
});

export const postControllers = {
	createPost,
	getAllPosts,
	getSinglePost,
	getSpecificUserPosts,
	updatePost,
	deletePost,
};
