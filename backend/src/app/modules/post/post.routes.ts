import { Router } from 'express';
import validateRequest from '@/middlewares/validateRequest';
import { postControllers } from '@/modules/post/post.controllers';
import { postValidations } from '@/modules/post/post.validation';

const router = Router();

router.post('/', validateRequest(postValidations.creationSchema), postControllers.createPost);

router.get('/', postControllers.getAllPosts);

router.get('/:id', postControllers.getSinglePost);

router.patch('/:id', validateRequest(postValidations.updateSchema), postControllers.updatePost);

router.delete('/:id', postControllers.deletePost);

export const postRoutes = router;
