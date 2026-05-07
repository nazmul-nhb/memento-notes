import { STATUS_CODES } from 'nhb-toolbox/constants';
import type { Maybe } from 'nhb-toolbox/types';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { QueryBuilder } from '@/classes/QueryBuilder';
import { User } from '@/modules/user/user.model';
import type { TUser } from '@/modules/user/user.types';
import { safeUser } from '@/modules/user/user.utils';
import type { TEmail } from '@/types';
import type { DecodedUser } from '@/types/interfaces';
import { hashPassword } from '@/utilities/authUtilities';
import { validateObjectId } from '@/utilities/validateObjectId';

/** * Create a new user in MongoDB `user` collection. */
const createUserInDB = async (payload: TUser) => {
	const newUser = await User.create(payload);

	return safeUser(newUser);
};

/** * Get all users from DB. */
const getAllUsersFromDB = async (query?: Record<string, unknown>) => {
	const userQuery = new QueryBuilder(User.find(), query).sort();

	return await userQuery.modelQuery;
};

/** * Get current user from DB. */
const getCurrentUserFromDB = async (email: TEmail | undefined) => {
	const user = await User.validateUser(email);

	return safeUser(user);
};

/** * Get a single user from DB. */
const getSingleUserFromDB = async (id: string) => {
	validateObjectId(id, 'user', 'get_user');

	const user = await User.findById(id);

	if (!user) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No user found with ID: ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'get_user'
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
	validateObjectId(id, 'user', 'update_user');

	const user = await getSingleUserFromDB(id);

	if (updater?.email !== user?.email && user?.role === 'admin') {
		throw new ErrorWithStatus(
			'Forbidden Request',
			"You can't update other admin's information!",
			STATUS_CODES.FORBIDDEN,
			'update_user'
		);
	}

	if (payload?.password) {
		payload.password = await hashPassword(payload?.password);
	}

	const updatedUser = await User.findOneAndUpdate({ _id: id }, payload, {
		runValidators: true,
		upsert: false,
		returnDocument: 'after',
	});

	if (!updatedUser) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No user found with ID: ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'update_user'
		);
	}

	return updatedUser;
};

const removeUserFromDB = async (id: string, email: Maybe<TEmail>) => {
	validateObjectId(id, 'user', 'delete_user');

	const user = await getSingleUserFromDB(id);

	if (user?.email === email) {
		throw new ErrorWithStatus(
			'Bad Request',
			"You can't delete your own account!",
			STATUS_CODES.BAD_REQUEST,
			'delete_user'
		);
	}

	if (user?.role === 'admin') {
		throw new ErrorWithStatus(
			'Bad Request',
			"You can't delete an admin account!",
			STATUS_CODES.BAD_REQUEST,
			'delete_user'
		);
	}

	const result = await User.deleteOne({ _id: id });

	if (result.deletedCount < 1) {
		throw new ErrorWithStatus(
			'Delete Failed Error',
			`Failed to delete User with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'delete_User'
		);
	}

	return result;
};

export const userServices = {
	createUserInDB,
	getAllUsersFromDB,
	getCurrentUserFromDB,
	getSingleUserFromDB,
	updateUserInDB,
	removeUserFromDB,
};
