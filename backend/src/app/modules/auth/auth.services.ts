import { pickFields } from 'nhb-toolbox';
import configs from '@/configs';
import { processLogin } from '@/modules/auth/auth.utils';
import { User } from '@/modules/user/user.model';
import type {
	IPlainUser,
	TLoginCredentials,
	TUserRegisterInput,
} from '@/modules/user/user.types';
import { generateToken, verifyToken } from '@/utilities/authUtilities';

/**
 * Create a new user in MongoDB `user` collection.
 * @param payload User data from `req.body`.
 * @returns User object from MongoDB.
 */
const registerUserInDB = async (payload: TUserRegisterInput) => {
	const newUser = await User.create(payload);

	return pickFields(newUser, ['_id', 'name', 'email', 'role', 'created_at']);
};

/**
 * * Login user.
 * @param payload Login credentials (`email` and `password`).
 * @returns Tokens (access and refresh) along with the user info.
 */
const loginUser = async (payload: TLoginCredentials) => {
	// * Validate and extract user from DB.
	const user = await User.validateUser(payload.email);

	return await processLogin(payload?.password, user);
};

/**
 * Refresh access token.
 * @param token Refresh token from client.
 * @returns New access token.
 */
const refreshToken = async (token: string): Promise<{ token: string }> => {
	// * Verify and decode token
	const decodedToken = verifyToken(configs.refreshSecret, token);

	// * Validate and extract user from DB.
	const user = await User.validateUser(decodedToken.email);

	// * Create token and send to the client.
	const accessToken = generateToken(
		pickFields(user as unknown as IPlainUser, ['_id', 'email', 'role']),
		configs.accessSecret,
		configs.accessExpireTime
	);

	return { token: accessToken };
};

export const authServices = {
	registerUserInDB,
	loginUser,
	refreshToken,
};
