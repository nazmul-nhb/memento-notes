import { Router } from 'express';
import { ADMIN_ROLES, USER_ROLES } from '@/constants';
import authorizeUser from '@/middlewares/authorizeUser';
import validateRequest from '@/middlewares/validateRequest';
import { userControllers } from '@/modules/user/user.controllers';
import { userValidations } from '@/modules/user/user.validation';

const router = Router();

router.post(
	'/',
	validateRequest(userValidations.creationSchema),
	authorizeUser(...ADMIN_ROLES),
	userControllers.createUser
);

router.get('/', authorizeUser(...ADMIN_ROLES), userControllers.getAllUsers);

// router.get('/:id', authorizeUser(...ADMIN_ROLES), userControllers.getSingleUser);

router.patch(
	'/:id',
	validateRequest(userValidations.updateSchema),
	authorizeUser(...ADMIN_ROLES),
	userControllers.updateUser
);

router.delete('/:id', authorizeUser(...ADMIN_ROLES), userControllers.removeUser);

router.get('/me', authorizeUser(...USER_ROLES), userControllers.getCurrentUser);

export const userRoutes = router;
