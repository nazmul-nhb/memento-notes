import { model, Schema } from 'mongoose';
import { STATUS_CODES } from 'nhb-toolbox/constants';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import type { INoteDoc, INoteModel } from '@/modules/note/note.types';
import { validateObjectId } from '@/utilities/validateObjectId';

const noteSchema = new Schema<INoteDoc>(
	{
		user_id: {
			type: Schema.Types.ObjectId,
			ref: 'Users',
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
		versionKey: false,
	}
);

// * User notes listing (pagination)
noteSchema.index({ user_id: 'asc', created_at: 'desc' });

// * Direct fetch by user + note
noteSchema.index({ _id: 'asc', user_id: 'asc' });

noteSchema.statics.findNoteById = async function (id: string, path?: string) {
	validateObjectId(id, 'note', path || 'GET: /notes/:id');

	const note = await this.findById(id);

	if (!note) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No note found with ID ${id}!`,
			STATUS_CODES.NOT_FOUND,
			path || 'GET: /notes/:id'
		);
	}

	return note;
};

export const Note = model<INoteDoc, INoteModel>('Notes', noteSchema);
