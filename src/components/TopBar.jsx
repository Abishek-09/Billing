import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  Coffee,
  Sparkles,
  Clock,
  X,
  Bell,
  Menu,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TopBar = ({
  searchQuery,
  setSearchQuery,
  onOpenMobileNav,
  onOpenMobileCart,
  cartItemsCount = 0,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-[72px] bg-[#FDFBF7] border-b border-[#4E3636]/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 shrink-0 relative z-10">
      {/* Mobile Menu Hamburger Button */}
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="lg:hidden p-2 rounded-xl bg-white border border-[#4E3636]/15 text-[#321E1E] hover:bg-[#116D6E]/10 hover:text-[#116D6E] transition-colors cursor-pointer shrink-0"
        title="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search bar with soft border (#4E3636 20% opacity) */}
      <div className="relative flex-1 max-w-lg min-w-0">
        <Search className="w-4 h-4 text-[#4E3636] absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search artisan cakes, sourdough, pastries..."
          className="w-full bg-white text-[#321E1E] text-xs sm:text-sm pl-9 sm:pl-11 pr-8 sm:pr-10 py-2 sm:py-2.5 rounded-xl border border-[#4E3636]/20 placeholder-[#4E3636]/60 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 shadow-sm transition-all duration-200"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#4E3636]/60 hover:text-[#321E1E] p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-[11px] font-medium text-[#4E3636]/50 bg-[#FDFBF7] px-1.5 py-0.5 rounded border border-[#4E3636]/15 pointer-events-none">
            ⌘K
          </div>
        )}
      </div>

      {/* Right side: Live Time, Mobile Cart Trigger, & Admin profile dropdown */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Mobile Cart Trigger Button */}
        {onOpenMobileCart && (
          <button
            type="button"
            onClick={onOpenMobileCart}
            className="lg:hidden relative p-2 rounded-xl bg-white border border-[#4E3636]/15 text-[#116D6E] hover:bg-[#116D6E]/10 transition-colors cursor-pointer shrink-0"
            title="View current bill"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#CD1818] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {cartItemsCount}
              </span>
            )}
          </button>
        )}

        {/* Subtle Live Clock */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-[#4E3636] bg-white px-3 py-1.5 rounded-lg border border-[#4E3636]/15 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-[#116D6E]" />
          <span className="font-medium text-[#321E1E]">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[#4E3636]/40">&bull;</span>
          <span>{currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 sm:pr-3 rounded-xl hover:bg-white border border-transparent hover:border-[#4E3636]/15 transition-all cursor-pointer select-none"
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser?.name || 'Staff User'}
                className="w-10 h-10 rounded-xl object-cover border-2 border-[#116D6E]/30 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-[#321E1E] leading-tight">
                {currentUser?.name || 'Chef Marie Laurent'}
              </div>
              <div className="text-[11px] font-medium text-[#4E3636]">
                {currentUser?.roleLabel || 'Head Baker • Admin'}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#4E3636] transition-transform duration-200" />
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-[#4E3636]/15 py-2 animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-4 py-2.5 border-b border-[#4E3636]/10 mb-1">
                <p className="text-xs font-bold text-[#321E1E]">{currentUser?.branch || 'SweetBite Downtown Store'}</p>
                <p className="text-[11px] text-[#4E3636]">{currentUser?.terminal || 'Register #POS-01 (Active)'}</p>
              </div>

              <div className="px-1.5 space-y-0.5">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#321E1E] hover:bg-[#FDFBF7] hover:text-[#116D6E] rounded-lg transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5 text-[#4E3636]" />
                  <span>My Profile & Schedule</span>
                </button>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#321E1E] hover:bg-[#FDFBF7] hover:text-[#116D6E] rounded-lg transition-colors text-left"
                >
                  <Coffee className="w-3.5 h-3.5 text-[#4E3636]" />
                  <span>Take Cashier Break</span>
                </button>
              </div>

              <div className="border-t border-[#4E3636]/10 mt-1.5 pt-1.5 px-1.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#CD1818] hover:bg-[#CD1818]/10 rounded-lg transition-colors text-left font-bold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Terminal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
