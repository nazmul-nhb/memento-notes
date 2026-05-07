import { Router } from 'express';
import validateRequest from '@/middlewares/validateRequest';
import { authControllers } from '@/modules/auth/auth.controllers';
import { authValidations } from '@/modules/auth/auth.validation';

const router = Router();

router.post(
	'/register',
	validateRequest(authValidations.registerSchema),
	authControllers.registerUser
);

router.post('/login', validateRequest(authValidations.loginSchema), authControllers.loginUser);

router.get('/refresh-token', authControllers.refreshToken);

export const authRoutes = router;
