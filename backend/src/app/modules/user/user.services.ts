import { type PipelineStage, Types } from 'mongoose';
import { STATUS_CODES } from 'nhb-toolbox/constants';
import type { Maybe } from 'nhb-toolbox/types';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { QueryBuilder } from '@/classes/QueryBuilder';
import { User } from '@/modules/user/user.model';
import type { IPlainUser, TUser, TUserGroup, TUserWithPosts } from '@/modules/user/user.types';
import { safeUser } from '@/modules/user/user.utils';
import type { TEmail } from '@/types';
import type { DecodedUser } from '@/types/interfaces';
import { hashPassword } from '@/utilities/authUtilities';
import { getQueryMeta } from '@/utilities/queryHelpers';
import { validateObjectId } from '@/utilities/validateObjectId';

/** * Create a new user in MongoDB `user` collection. */
const createUserInDB = async (payload: TUser) => {
	const newUser = await User.create(payload);

	return safeUser(newUser);
};

/** * Get all users from DB. */
const getAllUsersFromDB = async (query?: Record<string, unknown>) => {
	const userQuery = new QueryBuilder(User.find(), query).sort().paginate();

	const meta = await getQueryMeta(User, userQuery.modelQuery, query);

	const users = await userQuery.modelQuery;

	return { meta, users };
};

/** * Get current user from DB. */
const getCurrentUserFromDB = async (email: Maybe<TEmail>) => {
	const user = await User.validateUser(email);

	return safeUser(user);
};

/** * Get a single user from DB. */
const getSingleUserFromDB = async (id: string) => {
	validateObjectId(id, 'user', 'GET: /users/:id');

	const user = await User.findById(id);

	if (!user) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No user found with ID: ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'GET: /users/:id'
		);
	}

	return user;
};

/** * Update a user in DB. */
const updateUserInDB = async (
	id: string,
	payload: Partial<TUser>,
	updater: Maybe<DecodedUser>
) => {
	validateObjectId(id, 'user', 'PATCH: /users/:id');

	const user = await getSingleUserFromDB(id);

	if (updater?.email !== user?.email && user?.role === 'admin') {
		throw new ErrorWithStatus(
			'Forbidden Request',
			"You can't update other admin's information!",
			STATUS_CODES.FORBIDDEN,
			'PATCH: /users/:id'
		);
	}

	if (payload?.password) {
		payload.password = await hashPassword(payload?.password);
	}

	const updatedUser = await User.findOneAndUpdate({ _id: id }, payload, {
		runValidators: true,
		returnDocument: 'after',
	});

	if (!updatedUser) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No user found with ID: ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'PATCH: /users/:id'
		);
	}

	return updatedUser;
};

const removeUserFromDB = async (id: string, email: Maybe<TEmail>) => {
	validateObjectId(id, 'user', 'DELETE: /users/:id');

	const user = await getSingleUserFromDB(id);

	if (user?.email === email) {
		throw new ErrorWithStatus(
			'Bad Request',
			"You can't delete your own account!",
			STATUS_CODES.BAD_REQUEST,
			'DELETE: /users/:id'
		);
	}

	if (user?.role === 'admin') {
		throw new ErrorWithStatus(
			'Bad Request',
			"You can't delete an admin account!",
			STATUS_CODES.BAD_REQUEST,
			'DELETE: /users/:id'
		);
	}

	const result = await User.deleteOne({ _id: id });

	if (result.deletedCount < 1) {
		throw new ErrorWithStatus(
			'Delete Failed Error',
			`Failed to delete User with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'DELETE: /users/:id'
		);
	}

	return result;
};

const groupUsersByInterestFromDB = async (interest?: string) => {
	const pipeline: PipelineStage[] = [];

	if (interest) {
		pipeline.push({
			$match: {
				interests: interest,
			},
		});

		pipeline.push({
			$project: {
				password: 0,
			},
		});
	} else {
		pipeline.push(
			{
				$addFields: {
					originalInterests: '$interests',
				},
			},
			{ $unwind: '$interests' },
			{
				$group: {
					_id: '$interests',
					count: { $sum: 1 },
					users: {
						$push: {
							_id: '$_id',
							name: '$name',
							email: '$email',
							role: '$role',
							interests: '$originalInterests',
							created_at: '$created_at',
							updated_at: '$updated_at',
						},
					},
				},
			}
			// ! No Projection: Keep _id for interest name to have better document view -> first value starts with the interest name.
			// {
			// 	$project: {
			// 		_id: 0,
			// 		interest: '$_id',
			// 		count: 1,
			// 		users: 1,
			// 	},
			// }
		);
	}

	const users = await User.aggregate<TUserGroup | Omit<IPlainUser, 'password'>>(pipeline);

	return users;
};

const getSpecificUserPostsFromDB = async (userId: string) => {
	const [userWithPosts] = await User.aggregate<TUserWithPosts>([
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
		{ $project: { password: 0, posts: { user_id: 0 } } },
	]);

	return userWithPosts;
};

export const userServices = {
	createUserInDB,
	getAllUsersFromDB,
	getCurrentUserFromDB,
	getSingleUserFromDB,
	updateUserInDB,
	removeUserFromDB,
	groupUsersByInterestFromDB,
	getSpecificUserPostsFromDB,
};
