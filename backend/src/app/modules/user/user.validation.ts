import { z } from 'zod';
import { USER_ROLES } from '@/constants';
import { authValidations } from '@/modules/auth/auth.validation';

/** Validation Schema for Creating new User */
const creationSchema = authValidations.registerSchema
	.extend({
		role: z.enum(USER_ROLES).optional().default('user'),
		interests: z.array(z.string({ error: 'Interest is required!' }).trim()),
	})
	.strict();

const updateSchema = creationSchema.pick({ name: true, interests: true }).partial();

/** User Validation Schema */
export const userValidations = { creationSchema, updateSchema };
