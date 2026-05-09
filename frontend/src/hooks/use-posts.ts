import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/QueryKeys';
import { postService } from '@/services/post.service';
import type { ICreatePostPayload, IPaginationParams, IUpdatePostPayload } from '@/types';

class PostsQueryKeys extends QueryKeys<'posts'> {
	constructor() {
		super('posts');
	}

	get details() {
		return [...this.all, 'details'] as const;
	}

	detail(id: string) {
		return [...this.details, id] as const;
	}
}

const postKeys = new PostsQueryKeys();

export function usePosts(params?: IPaginationParams) {
	return useQuery({
		queryKey: postKeys.list(params),
		queryFn: () => postService.getPosts(params),
		select: (data) => data.data,
	});
}

export function useSinglePost(id: string) {
	return useQuery({
		queryKey: postKeys.detail(id),
		queryFn: () => postService.getSinglePost(id),
		select: (data) => data.data,
		enabled: !!id,
	});
}

export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: ICreatePostPayload) => postService.createPost(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
	});
}

export function useUpdatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: IUpdatePostPayload }) =>
			postService.updatePost(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
	});
}

export function useDeletePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => postService.deletePost(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postKeys.all });
		},
	});
}
