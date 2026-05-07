import { pickFields } from 'nhb-toolbox';
import { STATUS_CODES } from 'nhb-toolbox/constants';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import configs from '@/configs';
import type { IUserDoc } from '@/modules/user/user.types';
import { safeUser } from '@/modules/user/user.utils';
import { comparePassword, generateToken } from '@/utilities/authUtilities';
import type { DecodedUser } from '@/types/interfaces';
import type { Maybe } from 'nhb-toolbox/types';

/**
 * Process user login.
 * @param password Password to compare with the stored password.
 * @param user User document from the database.
 * @returns Access and refresh tokens along with user information.
 */
export const processLogin = async <T extends IUserDoc>(password: string, user: T) => {
	// * Check if password matches with the saved password in DB.
	const passwordMatched = await comparePassword(password, user?.password);

	if (!passwordMatched) {
		throw new ErrorWithStatus(
			'Authorization Error',
			`Invalid credentials!`,
			STATUS_CODES.UNAUTHORIZED,
			'auth'
		);
	}

	// * Create tokens and send to the client.
	const jwtPayload = pickFields(user, ['_id', 'email', 'role']);

	const accessToken = generateToken(
		jwtPayload,
		configs.accessSecret,
		configs.accessExpireTime
	);

	const refreshToken = generateToken(
		jwtPayload,
		configs.refreshSecret,
		configs.refreshExpireTime
	);

	return {
		access_token: accessToken,
		refresh_token: refreshToken,
		user: safeUser(user),
	};
};

export function isAdmin<T extends DecodedUser>(user: Maybe<T>): user is T & { role: 'admin' } {
	return user?.role === 'admin';
}
