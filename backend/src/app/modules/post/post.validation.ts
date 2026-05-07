import { noteValidations } from '@/modules/note/note.validation';

const creationSchema = noteValidations.creationSchema
	.pick({ title: true })
	.extend({
		body: noteValidations.creationSchema.shape.content,
	})
	.strict();

const updateSchema = creationSchema.partial();

export const postValidations = { creationSchema, updateSchema };
