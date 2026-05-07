import { STATUS_CODES } from 'nhb-toolbox/constants';
import type { Maybe } from 'nhb-toolbox/types';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { QueryBuilder } from '@/classes/QueryBuilder';
import { Note } from '@/modules/note/note.model';
import type { INote, TUpdateNote } from '@/modules/note/note.types';
import type { DecodedUser } from '@/types/interfaces';

const createNoteInDB = async (payload: INote, userId: Maybe<string>) => {
	const newNote = await Note.create({ ...payload, user_id: userId });

	return newNote;
};

const getAllNotesFromDB = async (user: Maybe<DecodedUser>, query?: Record<string, unknown>) => {
	const noteQuery = new QueryBuilder(Note.find({ user_id: user?._id }), query)
		.sort()
		.paginate();

	const notes = await noteQuery.modelQuery.populate('user_id', 'name email');

	return notes;
};

const getAllNotesForAdminFromDB = async (query?: Record<string, unknown>) => {
	const noteQuery = new QueryBuilder(Note.find(), query).sort().paginate();

	const notes = await noteQuery.modelQuery.populate('user_id', 'name email');

	return notes;
};

const updateNoteInDB = async (id: string, payload: TUpdateNote) => {
	const updatedNote = await Note.findOneAndUpdate({ _id: id }, payload, {
		runValidators: true,
		new: true,
	});

	if (!updatedNote) {
		throw new ErrorWithStatus(
			'Not Updated Error',
			`Cannot update specified note with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'PATCH: /notes/:id'
		);
	}

	return updatedNote;
};

const deleteNoteFromDB = async (id: string) => {
	const result = await Note.deleteOne({ _id: id });

	if (result.deletedCount < 1) {
		throw new ErrorWithStatus(
			'Delete Failed Error',
			`Failed to delete note with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'DELETE: /notes/:id'
		);
	}

	return result;
};

export const noteServices = {
	createNoteInDB,
	getAllNotesFromDB,
	getAllNotesForAdminFromDB,
	updateNoteInDB,
	deleteNoteFromDB,
};
