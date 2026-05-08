import { userServices } from '@/modules/user/user.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

/** * Create a new user */
const createUser = catchAsync(async (req, res) => {
	const user = await userServices.createUserInDB(req.body);

	sendResponse(res, 'User', 'POST', user);
});

/** * Get all users from DB. */
const getAllUsers = catchAsync(async (req, res) => {
	const users = await userServices.getAllUsersFromDB(req.query);

	sendResponse(res, 'User', 'GET', users);
});

/** * Get current logged in user. */
const getCurrentUser = catchAsync(async (req, res) => {
	const user = await userServices.getCurrentUserFromDB(req?.user?.email);

	sendResponse(res, 'User', 'GET', user, 'Successfully retrieved user profile!');
});

// const getSingleUser = catchAsync(async (req, res) => {
// 	const user = await userServices.getSingleUserFromDB(req?.params?.id);

// 	sendResponse(res, 'User', 'GET', user);
// });

/** * Update a user in DB. */
const updateUser = catchAsync(async (req, res) => {
	const user = await userServices.updateUserInDB(req?.params?.id, req?.body, req.user);

	sendResponse(res, 'User', 'PATCH', user);
});

/** * Remove a user from DB. */
const removeUser = catchAsync(async (req, res) => {
	const result = await userServices.removeUserFromDB(req?.params?.id, req.user?.email);

	sendResponse(res, 'User', 'DELETE', result);
});

const groupUsersByInterest = catchAsync(async (req, res) => {
	const users = await userServices.groupUsersByInterestFromDB(req?.query?.interest as string);

	sendResponse(res, 'User', 'GET', users);
});

const getSpecificUserPosts = catchAsync(async (req, res) => {
	const posts = await userServices.getSpecificUserPostsFromDB(req?.params?.id);

	sendResponse(res, 'Post', 'GET', posts);
});

export const userControllers = {
	createUser,
	getAllUsers,
	getCurrentUser,
	// getSingleUser,
	updateUser,
	removeUser,
	groupUsersByInterest,
	getSpecificUserPosts,
};
