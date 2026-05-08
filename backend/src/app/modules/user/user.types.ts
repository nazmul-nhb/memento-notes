import type { Document, Model, Types } from 'mongoose';
import type { z } from 'zod';
import type { authValidations } from '@/modules/auth/auth.validation';
import type { IPlainPost } from '@/modules/post/post.types';
import type { userValidations } from '@/modules/user/user.validation';
import type { TEmail } from '@/types';

export type TUser = z.infer<typeof userValidations.creationSchema>;

export type TUserRegisterInput = z.infer<typeof authValidations.registerSchema>;

export type TLoginCredentials = z.infer<typeof authValidations.loginSchema>;

export interface ITokens {
	access_token: string;
	refresh_token: string;
	user: ICurrentUser;
}

export interface IPlainUser extends Required<TUser> {
	_id: string;
	created_at: string;
	updated_at: string;
}

export type TUserGroup = {
	_id: string;
	interest: string;
	count: number;
	users: Omit<IPlainUser, 'password'>[];
};

export interface TUserWithPosts extends Omit<IPlainUser, 'password'> {
	posts: IPlainPost[];
}

export interface IUserDoc extends Omit<IPlainUser, '_id'>, Document {
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
