import { api } from '@/lib/axios';
import type {
    IApiResponse,
    ICreateNotePayload,
    INote,
    INotesResponse,
    IPaginationParams,
    IUpdateNotePayload,
} from '@/types';

export const noteService = {
    getNotes: async (params?: IPaginationParams) => {
        const { data } = await api.get<IApiResponse<INotesResponse>>('/notes', {
            params,
        });
        return data;
    },

    getAdminNotes: async (params?: IPaginationParams) => {
        const { data } = await api.get<IApiResponse<INotesResponse>>('/notes/admin', {
            params,
        });
        return data;
    },

    createNote: async (payload: ICreateNotePayload) => {
        const { data } = await api.post<IApiResponse<INote>>('/notes', payload);
        return data;
    },

    updateNote: async (id: string, payload: IUpdateNotePayload) => {
        const { data } = await api.patch<IApiResponse<INote>>(`/notes/${id}`, payload);
        return data;
    },

    deleteNote: async (id: string) => {
        const { data } = await api.delete<IApiResponse<unknown>>(`/notes/${id}`);
        return data;
    },
};
