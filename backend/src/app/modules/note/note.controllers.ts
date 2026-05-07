import { noteServices } from '@/modules/note/note.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

const createNote = catchAsync(async (req, res) => {
	const newNote = await noteServices.createNoteInDB(req.body);

	sendResponse(res, 'Note', 'POST', newNote);
});

const getAllNotes = catchAsync(async (_req, res) => {
	const notes = await noteServices.getAllNotesFromDB();

	sendResponse(res, 'Note', 'GET', notes);
});

const getSingleNote = catchAsync(async (req, res) => {
	const note = await noteServices.getSingleNoteFromDB(req?.params?.id);

	sendResponse(res, 'Note', 'GET', note);
});

const updateNote = catchAsync(async (req, res) => {
	const note = await noteServices.updateNoteInDB(req?.params?.id, req?.body);

	sendResponse(res, 'Note', 'PATCH', note);
});

const deleteNote = catchAsync(async (req, res) => {
	await noteServices.deleteNoteFromDB(req?.params?.id);

	sendResponse(res, 'Note', 'DELETE');
});

export const noteControllers = {
	createNote,
	getAllNotes,
	getSingleNote,
	updateNote,
	deleteNote,
};
