import { Router } from 'express';
import { authRoutes } from '@/modules/auth/auth.routes';
import { noteRoutes } from '@/modules/note/note.routes';
import { postRoutes } from '@/modules/post/post.routes';
import { userRoutes } from '@/modules/user/user.routes';
import type { IRoute } from '@/types/interfaces';

const router = Router();

const routes: IRoute[] = [
	{ path: '/auth', route: authRoutes },
	{ path: '/users', route: userRoutes },
	{ path: '/notes', route: noteRoutes },
	{ path: '/posts', route: postRoutes },
];

routes.forEach((item) => router.use(item.path, item.route));

export default router;
