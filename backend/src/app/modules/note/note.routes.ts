import { Router } from 'express';
import { USER_ROLES } from '@/constants';
import authorizeUser from '@/middlewares/authorizeUser';
import validateRequest from '@/middlewares/validateRequest';
import { noteControllers } from '@/modules/note/note.controllers';
import { checkNoteOwnership } from '@/modules/note/note.middlewares';
import { noteValidations } from '@/modules/note/note.validation';

const router = Router();

router.post(
	'/',
	validateRequest(noteValidations.creationSchema),
	authorizeUser(...USER_ROLES),
	noteControllers.createNote
);

router.get('/', authorizeUser(...USER_ROLES), noteControllers.getAllNotes);

router.get('/admin', authorizeUser('admin'), noteControllers.getAllNotesForAdmin);

router.patch(
	'/:id',
	validateRequest(noteValidations.updateSchema),
	authorizeUser(...USER_ROLES),
	checkNoteOwnership('PATCH: /notes/:id'),
	noteControllers.updateNote
);

router.delete(
	'/:id',
	authorizeUser(...USER_ROLES),
	checkNoteOwnership('DELETE: /notes/:id'),
	noteControllers.deleteNote
);

export const noteRoutes = router;
