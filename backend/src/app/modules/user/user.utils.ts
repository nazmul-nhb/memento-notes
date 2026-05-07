import type { IPlainUser, IUserDoc } from '@/modules/user/user.types';

/**
 * Remove sensitive fields from user object.
 * @param user User document.
 * @returns User object without password and version key.
 */
export function safeUser(user: IUserDoc) {
	const { password: _, __v, ...userInfo } = user.toObject<IPlainUser>();

	return userInfo;
}
