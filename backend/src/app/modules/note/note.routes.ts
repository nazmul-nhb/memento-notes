import { Router } from 'express';
import { USER_ROLES } from '@/constants';
import authorizeUser from '@/middlewares/authorizeUser';
import validateRequest from '@/middlewares/validateRequest';
import { noteControllers } from '@/modules/note/note.controllers';
import { noteValidations } from '@/modules/note/note.validation';

const router = Router();

router.post(
	'/',
	validateRequest(noteValidations.creationSchema),
	authorizeUser(...USER_ROLES),
	noteControllers.createNote
);

router.get('/', authorizeUser(...USER_ROLES), noteControllers.getAllNotes);

router.get('/:id', authorizeUser(...USER_ROLES), noteControllers.getSingleNote);

router.patch(
	'/:id',
	authorizeUser(...USER_ROLES),
	validateRequest(noteValidations.updateSchema),
	noteControllers.updateNote
);

router.delete('/:id', authorizeUser(...USER_ROLES), noteControllers.deleteNote);

export const noteRoutes = router;
