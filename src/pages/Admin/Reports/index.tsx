import { useEffect, useState } from 'react';
import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { formatCurrency } from '../../../utils/currency';
import { getAdminReportOverview } from '../../../services/reportService';
import type { AdminReportOverview, ReportPoint } from '../../../types/report.types';

function BarChart({ points, value, color = 'bg-primary' }: { points: ReportPoint[]; value: 'count' | 'total'; color?: string }) {
  const max = Math.max(...points.map((point) => Number(point[value] ?? 0)), 1);
  if (points.length === 0) return <p className="text-sm text-fg-muted">No data for this period.</p>;
  return <div className="flex h-48 items-end gap-2 overflow-x-auto pt-4">{points.map((point) => {
    const amount = Number(point[value] ?? 0);
    return <div key={point.date} className="flex min-w-8 flex-1 flex-col items-center gap-2" title={`${point.date}: ${amount}`}>
      <div className={`w-full rounded-t ${color}`} style={{ height: `${Math.max((amount / max) * 100, 4)}%` }} />
      <span className="text-[10px] text-fg-muted">{new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
    </div>;
  })}</div>;
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<'day' | 'month'>('day');
  const [data, setData] = useState<AdminReportOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; getAdminReportOverview(period).then((result) => { if (active) setData(result); }).catch(() => { if (active) setError('Unable to load reports.'); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [period]);
  const changePeriod = (next: 'day' | 'month') => { setLoading(true); setError(''); setPeriod(next); };
  return <section className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="ui-page-title text-fg">Reports</h1><p className="mt-2 text-sm text-fg-muted">Sales, customer and repair performance.</p></div><div className="flex rounded-md border border-line bg-surface p-1"><button className={`ui-button ${period === 'day' ? 'ui-button-primary' : 'ui-button-ghost'}`} onClick={() => changePeriod('day')}>Daily</button><button className={`ui-button ${period === 'month' ? 'ui-button-primary' : 'ui-button-ghost'}`} onClick={() => changePeriod('month')}>Monthly</button></div></header>
    <CatalogFeedback loading={loading} error={error} retry={() => setPeriod(period)} />
    {data && !loading && !error && <div className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-md border border-line bg-surface p-5"><h2 className="font-semibold text-fg">New user registrations</h2><BarChart points={data.registrations} value="count" color="bg-primary" /></article>
      <article className="rounded-md border border-line bg-surface p-5"><h2 className="font-semibold text-fg">Revenue</h2><BarChart points={data.revenue} value="total" color="bg-success" /></article>
      <article className="rounded-md border border-line bg-surface p-5"><h2 className="font-semibold text-fg">Repair requests</h2><BarChart points={data.repairs} value="count" color="bg-warning" /></article>
      <article className="rounded-md border border-line bg-surface p-5"><h2 className="font-semibold text-fg">Best-selling products</h2><div className="mt-4 space-y-3">{data.topProducts.length === 0 ? <p className="text-sm text-fg-muted">No sales for this period.</p> : data.topProducts.map((product, index) => <div key={product.productId} className="flex items-center justify-between gap-3 border-b border-line pb-3 text-sm"><span className="font-medium text-fg">{index + 1}. {product.name}</span><span className="text-fg-muted">{product.quantity} sold · {formatCurrency(product.revenue)}</span></div>)}</div></article>
    </div>}
  </section>;
}
