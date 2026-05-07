import { model, Schema } from 'mongoose';
import { STATUS_CODES } from 'nhb-toolbox/constants';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import type { INoteDoc, INoteModel } from '@/modules/note/note.types';

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

noteSchema.statics.findNoteById = async function (id: string) {
	if (!id) {
		throw new ErrorWithStatus(
			'Bad Request',
			'Please provide a valid ID!',
			STATUS_CODES.BAD_REQUEST,
			'note'
		);
	}

	const note = await this.findById(id);

	if (!note) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No note found with ID ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'note'
		);
	}

	return note;
};

export const Note = model<INoteDoc, INoteModel>('Notes', noteSchema);
