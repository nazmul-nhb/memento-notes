import type { Document, Model, Types } from 'mongoose';
import type { z } from 'zod';
import type { authValidations } from '@/modules/auth/auth.validation';
import { userValidations } from '@/modules/user/user.validation';
import type { TEmail } from '@/types';

export type TUser = z.infer<typeof userValidations.creationSchema>;

export type TUserRegisterInput = z.infer<typeof authValidations.registerSchema>;

export type TLoginCredentials = z.infer<typeof authValidations.loginSchema>;

export interface ITokens {
	access_token: string;
	refresh_token: string;
	user: ICurrentUser;
}

export interface IPlainUser extends TUser {
	_id: Types.ObjectId;
	created_at: string;
	updated_at: string;
}

export interface IUserDoc extends IPlainUser, Document {
	_id: Types.ObjectId;
}

export interface IUserModel extends Model<IUserDoc> {
	validateUser(email?: TEmail): Promise<IUserDoc>;
}

export interface ICurrentUser extends Omit<TUser, 'password'> {
	_id: Types.ObjectId;
	created_at: string;
	updated_at: string;
}
