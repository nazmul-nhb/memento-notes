import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email({ message: 'Please provide a valid email address!' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters long!' })
		.max(56, { message: 'Password cannot be more than 56 characters!' }),
});

export const registerSchema = loginSchema.extend({
	name: z.string().min(1, { message: 'Name is required!' }),
});

export const userCreationSchema = registerSchema.extend({
	role: z.enum(['admin', 'user']).optional(),
	interests: z.array(z.string().min(1, { message: 'Interest is required!' })).optional(),
});

export const userUpdateSchema = z.object({
	name: z.string().min(1, { message: 'Name cannot be empty!' }).optional().or(z.literal('')),
	email: z.string().email({ message: 'Invalid email address!' }).optional().or(z.literal('')),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters long!' })
		.max(56, { message: 'Password cannot be more than 56 characters!' })
		.optional()
		.or(z.literal('')),
	role: z.enum(['admin', 'user']).optional(),
	interests: z.array(z.string().min(1, { message: 'Interest cannot be empty!' })).optional(),
});

export const noteCreationSchema = z.object({
	title: z
		.string()
		.min(1, { message: 'Title is required' })
		.max(255, { message: 'Title is too long' }),
	content: z.string().min(1, { message: 'Content/Body is required' }),
});

export const noteUpdateSchema = noteCreationSchema.partial();

export const postCreationSchema = noteCreationSchema.pick({ title: true }).extend({
	body: z.string().min(1, { message: 'Content/Body is required' }),
});

export const postUpdateSchema = postCreationSchema.partial();
