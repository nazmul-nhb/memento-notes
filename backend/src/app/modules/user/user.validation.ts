import { z } from 'zod';
import { USER_ROLES } from '@/constants';
import { authValidations } from '@/modules/auth/auth.validation';

/** Validation Schema for Creating new User */
const creationSchema = authValidations.registerSchema
	.extend({
		role: z.enum(USER_ROLES).optional(),
		interests: z.array(z.string({ error: 'Interest is required!' }).trim()).optional(),
	})
	.strict();

const updateSchema = creationSchema.partial();

/** User Validation Schema */
export const userValidations = { creationSchema, updateSchema };
