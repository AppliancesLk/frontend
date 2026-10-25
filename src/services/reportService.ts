import apiClient from '../api/apiClient';
import type { AdminReportOverview } from '../types/report.types';
export const getAdminReportOverview = async (period: 'day' | 'month'): Promise<AdminReportOverview> =>
  (await apiClient.get<AdminReportOverview>('/admin/reports/overview', { params: { period } })).data;
