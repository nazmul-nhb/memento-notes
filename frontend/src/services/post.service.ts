import { api } from '@/lib/axios';
import type {
	IApiResponse,
	ICreatePostPayload,
	IPaginationParams,
	IPost,
	IPostsResponse,
	IUpdatePostPayload,
} from '@/types';

export const postService = {
	getPosts: async (params?: IPaginationParams) => {
		const { data } = await api.get<IApiResponse<IPostsResponse>>('/posts', {
			params,
		});
		return data;
	},

	getSinglePost: async (id: string) => {
		const { data } = await api.get<IApiResponse<IPost>>(`/posts/${id}`);
		return data;
	},

	createPost: async (payload: ICreatePostPayload) => {
		const { data } = await api.post<IApiResponse<IPost>>('/posts', payload);
		return data;
	},

	updatePost: async (id: string, payload: IUpdatePostPayload) => {
		const { data } = await api.patch<IApiResponse<IPost>>(`/posts/${id}`, payload);
		return data;
	},

	deletePost: async (id: string) => {
		const { data } = await api.delete<IApiResponse<unknown>>(`/posts/${id}`);
		return data;
	},
};
