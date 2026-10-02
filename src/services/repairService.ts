import apiClient from '../api/apiClient';
import type {
  CreateRepairTicketRequest,
  RepairTicket,
} from '../types/repair.types';

export const createRepairTicket = async (
  input: CreateRepairTicketRequest,
): Promise<RepairTicket> =>
  (await apiClient.post<RepairTicket>('/repairs', input)).data;
