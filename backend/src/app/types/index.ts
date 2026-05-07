import type { Types } from 'mongoose';
import type { HttpStatusCode, StatusCode } from 'nhb-toolbox/http-status/types';
import type { LooseLiteral, Prettify } from 'nhb-toolbox/utils/types';
import type { COLLECTIONS, USER_ROLES } from '@/constants';
import type { TLoginCredentials } from '@/modules/user/user.types';

export type ExceptionSignal = NodeJS.UncaughtExceptionOrigin | NodeJS.Signals;

export type TCollection = (typeof COLLECTIONS)[number];

export type TMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type TResponseDetails = { message: string; statusCode: StatusCode };

export type TStatusCode = HttpStatusCode<'clientError' | 'serverError'>;

export type TUserRole = (typeof USER_ROLES)[number];

export type TEmail = TLoginCredentials['email'];

/**
 * Makes selected properties optional while keeping the rest required
 * @remarks By default all properties are optional
 */
export type PropertyOptional<O, K extends keyof O = keyof O> = Prettify<
	Omit<O, K> & Partial<Pick<O, K>>
>;

/**
 * Makes selected properties required while keeping the rest unchanged
 * @remarks By default all properties are required
 */
export type PropertyRequired<O, K extends keyof O = keyof O> = Prettify<
	Omit<O, K> & Required<Pick<O, K>>
>;

export type SearchField<T> = {
	[K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T];

export type NumericKeys<T> = {
	[K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

export type ExcludeField<T> = `-${Extract<ExcludeVirtuals<FilterKeys<T>>, string>}`;

/** * Utility type to extract keys from `T` where the value is `string`, `number`, `boolean`, `Date` or `ObjectId`. */
type FilterKeys<T> = {
	[K in keyof T]: T[K] extends string | number | boolean | Date | Types.ObjectId ? K : never;
}[keyof T];

/** * Utility type to exclude Mongoose virtual properties (e.g., isNew). */
type ExcludeVirtuals<T> = Exclude<T, 'isNew' | 'id'>;

type ApiPath = `${Lowercase<Exclude<TCollection, 'N/A'>>}s`;
type PathWithId = `${Exclude<TMethod, 'POST'>}: /${ApiPath}/:id`;
type PathWithoutId = `${Exclude<TMethod, 'PATCH' | 'PUT' | 'DELETE'>}: /${ApiPath}`;

export type ErrorPath = LooseLiteral<PathWithoutId | PathWithId>;
