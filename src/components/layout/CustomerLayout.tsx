import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
export function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader />
      <div
        id="main-content"
        tabIndex={-1}
        className="min-w-0 flex-1 outline-none"
      >
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
