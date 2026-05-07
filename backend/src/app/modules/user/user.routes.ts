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
	authorizeUser('admin'),
	userControllers.createUser
);

router.get('/', authorizeUser('admin'), userControllers.getAllUsers);

// router.get('/:id', authorizeUser('admin'), userControllers.getSingleUser);

router.patch(
	'/:id',
	validateRequest(userValidations.updateSchema),
	authorizeUser('admin'),
	userControllers.updateUser
);

router.delete('/:id', authorizeUser('admin'), userControllers.removeUser);

router.get('/me', authorizeUser(...USER_ROLES), userControllers.getCurrentUser);

export const userRoutes = router;
