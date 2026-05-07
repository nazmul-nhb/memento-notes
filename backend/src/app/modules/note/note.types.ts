import type { Document, Model, Types } from 'mongoose';
import type z from 'zod';
import type { noteValidations } from '@/modules/note/note.validation';

export interface INote extends z.infer<typeof noteValidations.creationSchema> {
	user_id: Types.ObjectId;
}

export interface INoteDoc extends INote, Document {
	_id: Types.ObjectId;
	created_at: string;
	updated_at: string;
}

export type TUpdateNote = Omit<Partial<INote>, 'user_id'>;

export interface INoteModel extends Model<INoteDoc> {
	findNoteById: (id: string) => Promise<INoteDoc>;
}
