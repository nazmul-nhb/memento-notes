import { z } from 'zod';

const creationSchema = z
	.object({
		title: z
			.string('Title should be a string')
			.min(1, 'Title is required')
			.max(255, 'Title is too long')
			.trim(),
		content: z
			.string('Content/Body should be a string')
			.min(1, 'Content/Body is required')
			.trim(),
	})
	.strict();

const updateSchema = creationSchema.partial();

export const noteValidations = { creationSchema, updateSchema };
