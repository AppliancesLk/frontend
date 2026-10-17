import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { translations } from '../../utils/translations';
export function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
        {translations.common.storeName}
      </footer>
    </div>
  );
}
