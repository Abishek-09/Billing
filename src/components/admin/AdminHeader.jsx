import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  Check,
  ArrowLeftRight
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const ROUTE_TITLES = {
  '/admin': {
    title: 'Dashboard Overview',
    subtitle: 'Welcome back, Chef Marie &bull; Real-time executive metrics',
  },
  '/admin/orders': {
    title: 'Orders',
    subtitle: 'Real-time order management, fulfillments, and transaction ledger',
  },
  '/admin/inventory': {
    title: 'Product Inventory',
    subtitle: 'Menu management, live stock counters, and restock alerts',
  },
  '/admin/customers': {
    title: 'Customers',
    subtitle: 'Customer relationship profiles and Sweet Club loyalty tracking',
  },
  '/admin/reports': {
    title: 'Analytics & Reports',
    subtitle: 'Revenue curves, product category distribution, and top sellers',
  },
  '/admin/settings': {
    title: 'System Settings',
    subtitle: 'Store details, billing parameters, thermal printers, and taxes',
  },
};

export const AdminHeader = ({ selectedDateRange = 'This Week', onSelectDateRange }) => {
  const location = useLocation();
  const currentRouteMeta = ROUTE_TITLES[location.pathname] || {
    title: 'Dashboard Overview',
    subtitle: 'Welcome back, Chef Marie',
  };

  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dateRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const DATE_OPTIONS = [
    'Today',
    'Yesterday',
    'This Week',
    'This Month',
    'Last 30 Days',
    'Year to Date',
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDateDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-[76px] bg-white border-b border-[#4E3636]/10 px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-[0_4px_20px_-4px_rgba(50,30,30,0.03)]">
      {/* Left: Dynamic Page Title in large Serif font (#321E1E) */}
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#321E1E] leading-none">
          {currentRouteMeta.title}
        </h1>
        <p
          className="text-xs text-[#4E3636] font-medium mt-1"
          dangerouslySetInnerHTML={{ __html: currentRouteMeta.subtitle }}
        />
      </div>

      {/* Right Controls: Date Range Picker, Notification Bell, Admin Profile */}
      <div className="flex items-center gap-3.5">
        {/* Date Range Picker Dropdown */}
        <div className="relative" ref={dateRef}>
          <button
            type="button"
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-[#4E3636]/20 hover:border-[#116D6E] text-xs font-semibold text-[#321E1E] shadow-xs transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#4E3636]" />
            <span>{selectedDateRange}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#4E3636] transition-transform duration-200 ${dateDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-soft-lg border border-[#4E3636]/15 py-1 z-40 animate-in fade-in zoom-in-95">
              {DATE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (onSelectDateRange) {
                      onSelectDateRange(opt);
                    }
                    setDateDropdownOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-xs flex items-center justify-between text-left transition-colors cursor-pointer ${
                    selectedDateRange === opt
                      ? 'bg-[#116D6E]/10 text-[#116D6E] font-semibold'
                      : 'text-[#321E1E] hover:bg-[#FDFBF7]'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedDateRange === opt && <Check className="w-3.5 h-3.5 text-[#116D6E]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#4E3636]/20 hover:border-[#116D6E] flex items-center justify-center text-[#4E3636] hover:text-[#321E1E] shadow-xs transition-all cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#4E3636]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#CD1818] ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-lg border border-[#4E3636]/15 p-3.5 z-40 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#4E3636]/10 mb-2">
                <span className="text-xs font-bold text-[#321E1E]">Store Notifications</span>
                <span className="text-[10px] text-[#116D6E] font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#CD1818]/5 rounded-xl border border-[#CD1818]/15">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#CD1818] text-[11px]">Low Stock Warning</span>
                    <span className="text-[10px] text-[#4E3636]/60">12 mins ago</span>
                  </div>
                  <p className="text-[#321E1E] mt-0.5 text-[11px]">Vanilla Cake is down to 2 units left in display chiller.</p>
                </div>
                <div className="p-2.5 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#116D6E] text-[11px]">Bulk Order Completed</span>
                    <span className="text-[10px] text-[#4E3636]/60">40 mins ago</span>
                  </div>
                  <p className="text-[#321E1E] mt-0.5 text-[11px]">Cafe Bistro completed an order for ₹4,850.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-[#FDFBF7] border border-[#4E3636]/20 hover:border-[#116D6E] shadow-xs transition-all cursor-pointer select-none"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80"
                alt="Chef Marie"
                className="w-8 h-8 rounded-lg object-cover border border-[#116D6E]/30"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-[#321E1E] leading-tight">
                Chef Marie Laurent
              </div>
              <div className="text-[10px] font-medium text-[#4E3636]">
                General Manager
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#4E3636] transition-transform duration-200" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-[#4E3636]/15 py-2 animate-in fade-in zoom-in-95 z-40">
              <div className="px-4 py-2 border-b border-[#4E3636]/10 mb-1">
                <p className="text-xs font-bold text-[#321E1E]">SweetBite HQ</p>
                <p className="text-[11px] text-[#4E3636]">admin@sweetbite.com</p>
              </div>

              <div className="px-1.5 space-y-0.5 text-xs">
                <Link
                  to="/"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#321E1E] hover:bg-[#FDFBF7] hover:text-[#116D6E] rounded-lg transition-colors text-left"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#116D6E]" />
                  <span>Switch to POS Terminal</span>
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#321E1E] hover:bg-[#FDFBF7] hover:text-[#116D6E] rounded-lg transition-colors text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4E3636]" />
                  <span>Store Permissions</span>
                </Link>
              </div>

              <div className="border-t border-[#4E3636]/10 mt-1.5 pt-1.5 px-1.5">
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#CD1818] hover:bg-[#CD1818]/5 rounded-lg transition-colors text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
