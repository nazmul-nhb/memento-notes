import type { Document, Model, Types } from 'mongoose';
import { STATUS_CODES } from 'nhb-toolbox/constants';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { isAdmin } from '@/modules/auth/auth.utils';
import type { ErrorPath, TCollection } from '@/types';
import catchAsync from '@/utilities/catchAsync';
import { areObjectIdsEqual, validateObjectId } from '@/utilities/validateObjectId';

/**
 * * Middleware to check item ownership.
 * @param model - The model to check ownership for.
 * @param collection - The collection name.
 * @param path - The path where the error occurred.
 *
 * @remarks
 * - User can only access their own item.
 * - Admin can access all items.
 */
export function checkOwnership(
	model: Model<Document & { user_id: Types.ObjectId }>,
	collection: Lowercase<TCollection>,
	path: ErrorPath
) {
	return catchAsync(async (req, _res, next) => {
		const id = req.params.id;

		validateObjectId(id, collection, path);

		const item = await model.findById(id);

		if (!item) {
			throw new ErrorWithStatus(
				'Not Found Error',
				`No ${collection} found with ID ${id}!`,
				STATUS_CODES.NOT_FOUND,
				path
			);
		}

		const user = req.user;

		if (areObjectIdsEqual(item.user_id, user?._id) || isAdmin(user)) {
			next();
		} else {
			throw new ErrorWithStatus(
				'Unauthorized',
				`You don't have permission to perform this action!`,
				STATUS_CODES.UNAUTHORIZED,
				path
			);
		}
	});
}
