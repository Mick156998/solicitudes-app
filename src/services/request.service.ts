import { api } from "./api";
import { Request } from "@/interfaces/interface";

export const requestService = {
  getAll: async (): Promise<Request[]> => {
    return api.get<Request[]>("/requests");
  },

  getById: async (id: string): Promise<Request> => {
    return api.get<Request>(`/requests/${id}`);
  },

  create: async (data: Partial<Request>): Promise<Request> => {
    return api.post<Request, Partial<Request>>('/requests', data);
  },

  update: async (id: string, data: Partial<Request>): Promise<Request> => {
    return api.put<Request, Partial<Request>>(`/requests/${id}`, data);
  },

  patch: async (id: string, data: Partial<Request>): Promise<Request> => {
    return api.patch<Request, Partial<Request>>(`/requests/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete(`/requests/${id}`);
  },
};
