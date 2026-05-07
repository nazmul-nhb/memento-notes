import dotenv from 'dotenv';
import type { StringValue } from 'ms';
import { normalizeNumber } from 'nhb-toolbox';
import type { LooseLiteral } from 'nhb-toolbox/utils/types';
import path from 'path';
import type { TEmail } from '@/types';

dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

export default {
	/** * Environment name, e.g. `development`, `production` etc. */
	NODE_ENV: (process.env.NODE_ENV ?? 'development') as LooseLiteral<
		'development' | 'production'
	>,
	/** * Port number on which the server runs. Defaults to `4242` if not specified. */
	port: normalizeNumber(process.env.PORT) ?? 4242,
	/** * MongoDB connection URI for Mongoose. */
	mongoUri: process.env.MONGO_URI,
	/** * Number of salt rounds for hashing passwords. Default to `12` if not specified. */
	saltRounds: normalizeNumber(process.env.SALT_ROUNDS) ?? 12,
	/** * JWT Access Token secret. */
	accessSecret: process.env.JWT_ACCESS_SECRET as string,
	/** * JWT Access expiry time. */
	accessExpireTime: process.env.JWT_ACCESS_EXPIRES_IN as StringValue,
	/** * JWT Refresh Token secret. */
	refreshSecret: process.env.JWT_REFRESH_SECRET as string,
	/** * JWT Refresh Token expiry time. */
	refreshExpireTime: process.env.JWT_REFRESH_EXPIRES_IN as StringValue,

	/** * Email for the admin user to be seeded. */
	seedAdminEMail: process.env.SEED_ADMIN_EMAIL as TEmail,
	/** * Password for the admin user to be seeded. */
	seedAdminPassword: process.env.SEED_ADMIN_PASS as string,
};
