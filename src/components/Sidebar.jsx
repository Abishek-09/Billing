import React from 'react';
import {
  Receipt,
  CakeSlice,
  Tags,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import SidebarIllustration from './SidebarIllustration';

const NAV_ITEMS = [
  { id: 'billing', label: 'Billing', icon: Receipt },
  { id: 'products', label: 'Products', icon: CakeSlice },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
];

export const Sidebar = ({ activeTab, onSelectTab }) => {
  return (
    <aside className="w-[240px] bg-[#116D6E] text-white flex flex-col justify-between h-screen shrink-0 select-none shadow-[4px_0_24px_rgba(17,109,110,0.15)] relative z-20">
      {/* Top Header & Logo */}
      <div className="flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
                SweetBite
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-white/70 font-sans mt-1">
                Artisan Bakery POS
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left cursor-pointer group relative ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border-l-4 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'text-white hover:bg-white/5 border-l-4 border-transparent'
                }`}
              >
                {/* Inactive links have #4E3636 icons and white text. Active link has pure white icon and text */}
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

                {/* Subtle active glow dot indicator */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Illustration & Tagline */}
      <div className="p-4 pt-2 border-t border-white/10 text-center flex flex-col items-center">
        <SidebarIllustration />
        <p className="font-serif italic text-xs text-white/85 tracking-wide mt-1">
          &ldquo;Freshly Baked Happiness&rdquo;
        </p>
        <span className="text-[10px] text-white/50 tracking-wider uppercase mt-1">
          v2.4 &bull; Terminal 01
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
