import { translations } from '../../utils/translations';
export function Rating({average,count}:{average:string|number;count:number}) {
  return <span className="inline-flex flex-wrap items-center gap-1.5 text-sm"><span aria-hidden="true" className="text-lg text-yellow-500">★</span>{count>0?<><span className="font-semibold text-slate-900">{Number(average).toFixed(1)}</span><span className="text-xs text-slate-500">({count.toLocaleString()} {translations.experience.reviewCount})</span></>:<span className="text-xs text-slate-500">{translations.experience.noRatings}</span>}</span>;
}
