import { api } from '@/lib/axios';
import type {
	IApiResponse,
	ICurrentUser,
	ILoginPayload,
	ILoginResponse,
	IRefreshTokenResponse,
	IRegisterPayload,
} from '@/types';

export const authService = {
	login: async (payload: ILoginPayload) => {
		const { data } = await api.post<IApiResponse<ILoginResponse>>('/auth/login', payload);
		return data;
	},

	register: async (payload: IRegisterPayload) => {
		const { data } = await api.post<IApiResponse<ICurrentUser>>('/auth/register', payload);
		return data;
	},

	refreshToken: async () => {
		const { data } =
			await api.get<IApiResponse<IRefreshTokenResponse>>('/auth/refresh-token');
		return data;
	},
};
