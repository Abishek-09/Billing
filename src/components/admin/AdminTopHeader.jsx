import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  Coffee,
  Check,
  SlidersHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminTopHeader = ({
  selectedDateRange = 'This Week',
  onSelectDateRange,
  unreadNotifications = 3,
}) => {
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

  // Outside click handlers
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
    <header className="h-[76px] bg-[#FDFBF7] border-b border-[#4E3636]/10 px-8 flex items-center justify-between shrink-0 relative z-10">
      {/* Left: Page Title "Dashboard Overview" (Serif font, #321E1E) */}
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#321E1E]">
          Dashboard Overview
        </h1>
        <p className="text-xs text-[#4E3636] font-medium mt-0.5">
          Welcome back, Chef Marie &bull; Live Bakery SaaS Analytics
        </p>
      </div>

      {/* Right: Date Range Picker, Notification Bell, Admin Profile Dropdown */}
      <div className="flex items-center gap-3.5">
        {/* Date Range Picker Dropdown */}
        <div className="relative" ref={dateRef}>
          <button
            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#4E3636]/20 hover:border-[#116D6E] text-xs font-semibold text-[#321E1E] shadow-sm transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#4E3636]" />
            <span>{selectedDateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#4E3636] transition-transform duration-200" />
          </button>

          {dateDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-soft-lg border border-[#4E3636]/15 py-1 z-30 animate-in fade-in zoom-in-95">
              {DATE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onSelectDateRange && onSelectDateRange(opt);
                    setDateDropdownOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-xs flex items-center justify-between text-left transition-colors ${
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

        {/* Notification Bell Icon */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 rounded-xl bg-white border border-[#4E3636]/20 hover:border-[#116D6E] flex items-center justify-center text-[#4E3636] hover:text-[#321E1E] shadow-sm transition-all cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#4E3636]" />
            {unreadNotifications > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#CD1818] ring-2 ring-white" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-lg border border-[#4E3636]/15 p-3 z-30 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#4E3636]/10 mb-2">
                <span className="text-xs font-bold text-[#321E1E]">Store Notifications</span>
                <span className="text-[10px] text-[#116D6E] font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#CD1818]/5 rounded-xl border border-[#CD1818]/15">
                  <p className="font-bold text-[#CD1818] text-[11px]">Low Stock Warning</p>
                  <p className="text-[#321E1E] mt-0.5 text-[11px]">Vanilla Cake is down to 2 units left in display chiller.</p>
                  <span className="text-[10px] text-[#4E3636]/70 mt-1 block">10 mins ago</span>
                </div>
                <div className="p-2.5 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10">
                  <p className="font-bold text-[#116D6E] text-[11px]">High Value Sale</p>
                  <p className="text-[#321E1E] mt-0.5 text-[11px]">Cafe Bistro completed an order for ₹4,850.</p>
                  <span className="text-[10px] text-[#4E3636]/70 mt-1 block">45 mins ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white border border-[#4E3636]/20 hover:border-[#116D6E] shadow-sm transition-all cursor-pointer select-none"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80"
                alt="Chef Marie"
                className="w-9 h-9 rounded-lg object-cover border border-[#116D6E]/30"
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
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-[#4E3636]/15 py-2 animate-in fade-in zoom-in-95 z-30">
              <div className="px-4 py-2 border-b border-[#4E3636]/10 mb-1">
                <p className="text-xs font-bold text-[#321E1E]">SweetBite HQ</p>
                <p className="text-[11px] text-[#4E3636]">admin@sweetbite.com</p>
              </div>

              <div className="px-1.5 space-y-0.5 text-xs">
                <Link
                  to="/"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#321E1E] hover:bg-[#FDFBF7] hover:text-[#116D6E] rounded-lg transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5 text-[#4E3636]" />
                  <span>Switch to POS Terminal</span>
                </Link>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#321E1E] hover:bg-[#FDFBF7] hover:text-[#116D6E] rounded-lg transition-colors text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4E3636]" />
                  <span>Branch Permissions</span>
                </button>
              </div>

              <div className="border-t border-[#4E3636]/10 mt-1.5 pt-1.5 px-1.5">
                <button
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

export default AdminTopHeader;
