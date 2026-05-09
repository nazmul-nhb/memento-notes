import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/QueryKeys';
import { userService } from '@/services/user.service';
import type { ICreateUserPayload, IPaginationParams, IUpdateUserPayload } from '@/types';

class UsersQueryKeys extends QueryKeys<'users'> {
	constructor() {
		super('users');
	}

	get me() {
		return [...this.all, 'me'] as const;
	}

	interests(interest?: string) {
		return [...this.all, 'interests', interest] as const;
	}

	userPosts(userId: string) {
		return [...this.all, 'posts', userId] as const;
	}
}

export const userKeys = new UsersQueryKeys();

export function useCurrentUser() {
	return useQuery({
		queryKey: userKeys.me,
		queryFn: () => userService.getCurrentUser(),
		select: (data) => data.data,
	});
}

export function useUsers(params?: IPaginationParams) {
	return useQuery({
		queryKey: userKeys.list(params),
		queryFn: () => userService.getAllUsers(params),
		select: (data) => data.data,
	});
}

export function useCreateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: ICreateUserPayload) => userService.createUser(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.all });
		},
	});
}

export function useUpdateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: IUpdateUserPayload }) =>
			userService.updateUser(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.all });
		},
	});
}

export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => userService.deleteUser(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.all });
		},
	});
}

export function useUsersByInterest(interest?: string) {
	return useQuery({
		queryKey: userKeys.interests(interest),
		queryFn: () => userService.getUsersByInterest(interest),
		select: (data) => data.data,
	});
}

export function useUserPosts(userId: string) {
	return useQuery({
		queryKey: userKeys.userPosts(userId),
		queryFn: () => userService.getUserPosts(userId),
		select: (data) => data.data,
		enabled: !!userId,
	});
}
