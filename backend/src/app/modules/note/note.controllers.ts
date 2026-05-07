import { noteServices } from '@/modules/note/note.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

const createNote = catchAsync(async (req, res) => {
	const newNote = await noteServices.createNoteInDB(req.body, req.user?._id);

	sendResponse(res, 'Note', 'POST', newNote);
});

const getAllNotes = catchAsync(async (req, res) => {
	const notes = await noteServices.getAllNotesFromDB(req.user, req.query);

	sendResponse(res, 'Note', 'GET', notes);
});

const getAllNotesForAdmin = catchAsync(async (req, res) => {
	const notes = await noteServices.getAllNotesForAdminFromDB(req?.query);

	sendResponse(res, 'Note', 'GET', notes);
});

const updateNote = catchAsync(async (req, res) => {
	const note = await noteServices.updateNoteInDB(req?.params?.id, req?.body);

	sendResponse(res, 'Note', 'PATCH', note);
});

const deleteNote = catchAsync(async (req, res) => {
	const result = await noteServices.deleteNoteFromDB(req?.params?.id);

	sendResponse(res, 'Note', 'DELETE', result);
});

export const noteControllers = {
	createNote,
	getAllNotes,
	getAllNotesForAdmin,
	updateNote,
	deleteNote,
};
