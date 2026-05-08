import { Router } from 'express';
import { USER_ROLES } from '@/constants';
import authorizeUser from '@/middlewares/authorizeUser';
import { checkOwnership } from '@/middlewares/checkOwnership';
import validateRequest from '@/middlewares/validateRequest';
import { postControllers } from '@/modules/post/post.controllers';
import { Post } from '@/modules/post/post.model';
import { postValidations } from '@/modules/post/post.validation';

const router = Router();

router.post(
	'/',
	validateRequest(postValidations.creationSchema),
	authorizeUser(...USER_ROLES),
	postControllers.createPost
);

router.get('/', postControllers.getAllPosts);

router.get('/:id', postControllers.getSinglePost);

router.patch(
	'/:id',
	validateRequest(postValidations.updateSchema),
	authorizeUser(...USER_ROLES),
	checkOwnership(Post, 'post', 'PATCH: /posts/:id'),
	postControllers.updatePost
);

router.delete(
	'/:id',
	authorizeUser(...USER_ROLES),
	checkOwnership(Post, 'post', 'DELETE: /posts/:id'),
	postControllers.deletePost
);

export const postRoutes = router;
