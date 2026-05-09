import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/QueryKeys';
import { noteService } from '@/services/note.service';
import type { ICreateNotePayload, IPaginationParams, IUpdateNotePayload } from '@/types';

class NotesQueryKeys extends QueryKeys<'notes'> {
	constructor() {
		super('notes');
	}

	get adminLists() {
		return [...this.all, 'admin'] as const;
	}

	adminList(params?: IPaginationParams) {
		return [...this.adminLists, params] as const;
	}
}

export const noteKeys = new NotesQueryKeys();

export function useNotes(params?: IPaginationParams) {
	return useQuery({
		queryKey: noteKeys.list(params),
		queryFn: () => noteService.getNotes(params),
		select: (data) => data.data,
	});
}

export function useAdminNotes(params?: IPaginationParams) {
	return useQuery({
		queryKey: noteKeys.adminList(params),
		queryFn: () => noteService.getAdminNotes(params),
		select: (data) => data.data,
	});
}

export function useCreateNote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: ICreateNotePayload) => noteService.createNote(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: noteKeys.all });
		},
	});
}

export function useUpdateNote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: IUpdateNotePayload }) =>
			noteService.updateNote(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: noteKeys.all });
		},
	});
}

export function useDeleteNote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => noteService.deleteNote(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: noteKeys.all });
		},
	});
}
