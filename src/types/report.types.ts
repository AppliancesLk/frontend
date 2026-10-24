export interface ReportPoint { date: string; count?: number; total?: number }
export interface TopProductReport { productId: string; name: string; quantity: number; revenue: number }
export interface AdminReportOverview {
  period: 'day' | 'month';
  registrations: ReportPoint[];
  revenue: ReportPoint[];
  repairs: ReportPoint[];
  topProducts: TopProductReport[];
}
