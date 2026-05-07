import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { STATUS_CODES } from 'nhb-toolbox/constants';
import type { Maybe } from 'nhb-toolbox/types';
import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import configs from '@/configs';
import type { IPlainUser } from '@/modules/user/user.types';
import type { DecodedUser } from '@/types/interfaces';

/**
 * * Utility function to hash password using `bcrypt`.
 * @param password Password to hash.
 * @returns Hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
	try {
		return await bcrypt.hash(password, configs.saltRounds);
	} catch (_error) {
		throw new ErrorWithStatus(
			'Internal Server Error',
			'Error hashing password!',
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'password'
		);
	}
};

/**
 * * Utility function to compare incoming password with hashed password.
 * @param rawPassword Incoming password from client.
 * @param hashedPassword Password from DB to be compared with.
 * @returns Boolean
 */
export const comparePassword = async (
	rawPassword: string,
	hashedPassword: string
): Promise<boolean> => {
	try {
		return await bcrypt.compare(rawPassword, hashedPassword);
	} catch (_error) {
		throw new ErrorWithStatus(
			'Internal Server Error',
			'Error comparing password!',
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'password'
		);
	}
};

/**
 * * Utility function to generate `jsonwebtoken`.
 * @param payload Payload to be encoded in token.
 * @param secret Secret key for generating token.
 * @param expiresIn Expiry time.
 * @returns
 */
export const generateToken = (
	payload: Pick<IPlainUser, '_id' | 'email' | 'role'>,
	secret: string,
	expiresIn: StringValue
): string => {
	try {
		return jwt.sign(payload, secret, { expiresIn });
	} catch (_error) {
		throw new ErrorWithStatus(
			'Internal Server Error',
			'Cannot generate token!',
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'auth'
		);
	}
};

/**
 * * Utility function to check if token is valid.
 * @param secret Secret key from `env` used for token generation.
 * @param token Token from client.
 * @returns Decoded token payload.
 */
export const verifyToken = (secret: string, token: Maybe<string>): DecodedUser => {
	if (!token) {
		throw new ErrorWithStatus(
			'Authorization Error',
			'Bad or Invalid token!',
			STATUS_CODES.UNAUTHORIZED,
			'auth'
		);
	}

	try {
		return jwt.verify(token, secret) as DecodedUser;
	} catch (_error) {
		throw new ErrorWithStatus(
			'Authorization Error',
			'Your token is invalid or expired!',
			STATUS_CODES.UNAUTHORIZED,
			'auth'
		);
	}
};

/**
 * * Decode a token. it does not verify the token, uses `jwt.decode.`
 * @param token Token to decode.
 * @returns Decoded token.
 */
export function decodeToken(token: string) {
	if (!token) {
		throw new ErrorWithStatus(
			'Authorization Error',
			'Bad or Invalid token!',
			STATUS_CODES.UNAUTHORIZED,
			'auth'
		);
	}

	try {
		return jwt.decode(token, { json: true }) as DecodedUser | null;
	} catch (_error) {
		throw new ErrorWithStatus(
			'Authorization Error',
			'Your token is invalid or expired!',
			STATUS_CODES.UNAUTHORIZED,
			'auth'
		);
	}
}
