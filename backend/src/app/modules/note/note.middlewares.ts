import { STATUS_CODES } from 'nhb-toolbox/constants';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { isAdmin } from '@/modules/auth/auth.utils';
import { Note } from '@/modules/note/note.model';
import catchAsync from '@/utilities/catchAsync';
import { areObjectIdsEqual } from '@/utilities/validateObjectId';

/**
 * * Middleware to check note ownership.
 * @param path - The path where the error occurred.
 *
 * @remarks
 * - User can only access their own notes.
 * - Admin can access all notes.
 */
export function checkNoteOwnership(path: string) {
	return catchAsync(async (req, _res, next) => {
		const note = await Note.findNoteById(req.params.id, path);
		const user = req.user;

		if (!areObjectIdsEqual(note.user_id, user?._id) || !isAdmin(user)) {
			throw new ErrorWithStatus(
				'Unauthorized',
				`You don't have permission to perform this action!`,
				STATUS_CODES.UNAUTHORIZED,
				path
			);
		}

		next();
	});
}
