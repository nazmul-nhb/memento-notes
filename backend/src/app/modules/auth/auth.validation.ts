import { z } from 'zod';

/** Zod schema to validate login credentials. */
const loginSchema = z
	.object({
		email: z
			.email({ error: 'Please provide a valid email address!' })
			.brand('Email')
			.trim(),
		password: z
			.string({ error: 'Password is required!' })
			.trim()
			.min(6, {
				message: 'Password must be at least 6 characters long!',
			})
			.max(56, {
				message: 'Password cannot be more than 56 characters!',
			}),
	})
	.strict();

const registerSchema = loginSchema
	.extend({
		name: z.string({ error: 'Name is required!' }).trim(),
	})
	.strict();

export const authValidations = { loginSchema, registerSchema };
