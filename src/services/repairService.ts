import apiClient from '../api/apiClient';
import type {
  CreateRepairTicketRequest,
  RepairTicket,
  AdminRepairTicket,
  RejectRepairRequest,
} from '../types/repair.types';

export const createRepairTicket = async (
  input: CreateRepairTicketRequest,
): Promise<RepairTicket> =>
  (await apiClient.post<RepairTicket>('/repairs', input)).data;

// Admin repair functions
export const getAdminRepairs = async (
  signal?: AbortSignal,
): Promise<AdminRepairTicket[]> =>
  (await apiClient.get<AdminRepairTicket[]>('/repairs/admin', { signal })).data;

export const getAdminRepair = async (
  id: string,
  signal?: AbortSignal,
): Promise<AdminRepairTicket> =>
  (await apiClient.get<AdminRepairTicket>(`/repairs/admin/${id}`, { signal }))
    .data;

export const approveRepair = async (id: string): Promise<AdminRepairTicket> =>
  (await apiClient.patch<AdminRepairTicket>(`/repairs/admin/${id}/approve`))
    .data;

export const rejectRepair = async (
  id: string,
  request?: RejectRepairRequest,
): Promise<AdminRepairTicket> =>
  (
    await apiClient.patch<AdminRepairTicket>(
      `/repairs/admin/${id}/reject`,
      request,
    )
  ).data;
