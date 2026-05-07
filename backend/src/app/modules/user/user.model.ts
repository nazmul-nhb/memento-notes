import { model, Schema } from 'mongoose';
import { STATUS_CODES } from 'nhb-toolbox/constants';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { USER_ROLES } from '@/constants';
import type { IUserDoc, IUserModel } from '@/modules/user/user.types';
import type { TEmail } from '@/types';
import { hashPassword } from '@/utilities/authUtilities';

const userSchema = new Schema<IUserDoc>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
			select: false,
		},
		interests: {
			type: [String],
			required: false,
			default: [],
		},
		role: {
			type: String,
			enum: USER_ROLES,
			default: 'user',
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

// * Unique login + fast lookup
userSchema.index({ email: 'asc' }, { unique: true });

// * Admin listing users with pagination (sorted by created_at)
userSchema.index({ created_at: 'desc' });

// * Aggregation: group by interests
userSchema.index({ interests: 'asc' });

// * Hash password before saving the user in DB.
userSchema.pre('save', async function () {
	this.password = await hashPassword(this.password);
});

/** Static method to check if user exists */
userSchema.statics.validateUser = async function (email?: TEmail) {
	if (!email) {
		throw new ErrorWithStatus(
			'Authentication Error',
			'Please provide a valid email!',
			STATUS_CODES.BAD_REQUEST,
			'user'
		);
	}

	const user: IUserDoc = await this.findOne({ email }).select('+password -interests');

	if (!user) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No user found with email: ${email}!`,
			STATUS_CODES.NOT_FOUND,
			'user'
		);
	}

	return user;
};

export const User = model<IUserDoc, IUserModel>('Users', userSchema);
