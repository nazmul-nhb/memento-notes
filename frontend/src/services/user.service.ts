import { api } from '@/lib/axios';
import type {
    IApiResponse,
    ICreateUserPayload,
    ICurrentUser,
    IPaginationParams,
    IUpdateUserPayload,
    IUser,
    IUserGroup,
    IUsersResponse,
    IUserWithPosts,
} from '@/types';

export const userService = {
    getCurrentUser: async () => {
        const { data } = await api.get<IApiResponse<ICurrentUser>>('/users/me');
        return data;
    },

    getAllUsers: async (params?: IPaginationParams) => {
        const { data } = await api.get<IApiResponse<IUsersResponse>>('/users', {
            params,
        });
        return data;
    },

    createUser: async (payload: ICreateUserPayload) => {
        const { data } = await api.post<IApiResponse<IUser>>('/users', payload);
        return data;
    },

    updateUser: async (id: string, payload: IUpdateUserPayload) => {
        const { data } = await api.patch<IApiResponse<IUser>>(`/users/${id}`, payload);
        return data;
    },

    deleteUser: async (id: string) => {
        const { data } = await api.delete<IApiResponse<unknown>>(`/users/${id}`);
        return data;
    },

    getUsersByInterest: async (interest?: string) => {
        const { data } = await api.get<IApiResponse<IUserGroup[] | Omit<IUser, 'password'>[]>>(
            '/users/group-by-interest',
            {
                params: interest ? { interest } : undefined,
            }
        );
        return data;
    },

    getUserPosts: async (userId: string) => {
        const { data } = await api.get<IApiResponse<IUserWithPosts>>(`/users/${userId}/posts`);
        return data;
    },
};
