import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  ArrowLeftRight,
  ShieldCheck,
  Store
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

const ADMIN_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin', end: true },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
  { id: 'inventory', label: 'Inventory', icon: Boxes, path: '/admin/inventory' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/admin/customers' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/admin/reports' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export const AdminSidebar = () => {
  return (
    <aside className="w-[240px] bg-[#116D6E] text-white flex flex-col justify-between h-screen shrink-0 select-none shadow-[4px_0_24px_rgba(17,109,110,0.18)] relative z-20">
      {/* Top Header & Branding */}
      <div>
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
                SweetBite
              </h1>
              {/* Subtle badge reading "Admin Portal" in #FDFBF7 */}
              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 border border-white/20 text-[#FDFBF7] text-[10px] font-semibold tracking-wider uppercase">
                <ShieldCheck className="w-3 h-3 text-[#FDFBF7]" />
                <span>Admin Portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-5 space-y-1.5">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left cursor-pointer group relative ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold border-l-4 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                      : 'text-white hover:bg-white/5 border-l-4 border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Inactive links have #4E3636 icons and white text. Active link has pure white icon */}
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                        isActive
                          ? 'text-white bg-white/15'
                          : 'text-[#4E3636] bg-[#FDFBF7]/90 group-hover:bg-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    </div>
                    <span className={isActive ? 'text-white font-semibold' : 'text-white/95'}>
                      {item.label}
                    </span>

                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switcher: Quick Link back to POS Terminal */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <Link
          to="/"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-semibold transition-all group"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#FDFBF7]" />
            <span>Launch POS Terminal</span>
          </div>
          <ArrowLeftRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
        </Link>

        <div className="px-1 text-center">
          <p className="font-serif italic text-xs text-white/80">
            &ldquo;Freshly Baked Happiness&rdquo;
          </p>
          <span className="text-[10px] text-white/50 uppercase tracking-wider block mt-0.5">
            Admin Suite &bull; v2.4
          </span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
