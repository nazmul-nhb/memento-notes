// ==================== API Response Types ====================

/** Standard API response wrapper */
export interface IApiResponse<T> {
	success: boolean;
	message: string;
	status: number;
	data: T;
}

/** Pagination metadata from backend */
export interface IPaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	prevPage?: number;
	nextPage?: number;
}

/** Paginated list response */
export interface IPaginatedData<T> {
	meta: IPaginationMeta;
	[key: string]: T[] | IPaginationMeta;
}

/** Query parameters for paginated endpoints */
export interface IPaginationParams {
	page?: number;
	limit?: number;
}

// ==================== Auth Types ====================

export type TUserRole = 'admin' | 'user';

export interface ILoginPayload {
	email: string;
	password: string;
}

export interface IRegisterPayload {
	name: string;
	email: string;
	password: string;
}

export interface ILoginResponse {
	user: ICurrentUser;
	token: string;
}

export interface IRefreshTokenResponse {
	token: string;
}

// ==================== User Types ====================

export interface ICurrentUser {
	_id: string;
	name: string;
	email: string;
	role: TUserRole;
	interests?: string[];
	created_at: string;
	updated_at: string;
}

export interface IUser {
	_id: string;
	name: string;
	email: string;
	role: TUserRole;
	interests: string[];
	created_at: string;
	updated_at: string;
}

export interface ICreateUserPayload {
	name: string;
	email: string;
	password: string;
	role?: TUserRole;
	interests?: string[];
}

export interface IUpdateUserPayload {
	name?: string;
	email?: string;
	password?: string;
	role?: TUserRole;
	interests?: string[];
}

export interface IUserGroup {
	_id: string;
	count: number;
	users: Omit<IUser, 'password'>[];
}

export interface IUserWithPosts extends Omit<IUser, 'password'> {
	posts: IPlainPost[];
}

export interface IUsersResponse {
	meta: IPaginationMeta;
	users: IUser[];
}

// ==================== Note Types ====================

export interface INote {
	_id: string;
	title: string;
	content: string;
	user_id: string | { _id: string; name: string; email: string };
	created_at: string;
	updated_at: string;
}

export interface ICreateNotePayload {
	title: string;
	content: string;
}

export interface IUpdateNotePayload {
	title?: string;
	content?: string;
}

export interface INotesResponse {
	meta: IPaginationMeta;
	notes: INote[];
}

// ==================== Post Types ====================

export interface IPost {
	_id: string;
	title: string;
	body: string;
	user_id: string | { _id: string; name: string; email: string };
	created_at: string;
	updated_at: string;
}

export interface IPlainPost {
	_id: string;
	title: string;
	body: string;
	created_at: string;
	updated_at: string;
}

export interface ICreatePostPayload {
	title: string;
	body: string;
}

export interface IUpdatePostPayload {
	title?: string;
	body?: string;
}

export interface IPostsResponse {
	meta: IPaginationMeta;
	posts: IPost[];
}

// ==================== Error Types ====================

export interface IErrorSource {
	path: string | number;
	message: string;
}

export interface IApiError {
	success: false;
	message: string;
	status: number;
	errorSource?: IErrorSource[];
}
