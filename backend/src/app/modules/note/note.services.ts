import { STATUS_CODES } from 'nhb-toolbox/constants';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { QueryBuilder } from '@/classes/QueryBuilder';
import { Note } from '@/modules/note/note.model';
import type { INote, TUpdateNote } from '@/modules/note/note.types';

const createNoteInDB = async (payload: INote) => {
	const newNote = await Note.create(payload);

	return newNote;
};

const getAllNotesFromDB = async (query?: Record<string, unknown>) => {
	const noteQuery = new QueryBuilder(Note.find(), query).sort();
	// const notes = await Note.find({});

	const notes = await noteQuery.modelQuery;

	return notes;
};

const getSingleNoteFromDB = async (id: string) => {
	const note_1 = await Note.findNoteById(id);

	return note_1;
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
			'update_note'
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
			'delete_note'
		);
	}
};

export const noteServices = {
	createNoteInDB,
	getAllNotesFromDB,
	getSingleNoteFromDB,
	updateNoteInDB,
	deleteNoteFromDB,
};
