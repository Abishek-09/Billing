import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  ShoppingBag,
  History,
  TrendingUp,
  Tag,
  CornerDownLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../data/mockData';

export const TopBar = ({
  searchQuery,
  setSearchQuery,
  onOpenMobileNav,
  onOpenMobileCart,
  cartItemsCount = 0,
  onSelectCategory,
  onAddToCart,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const itemRefs = useRef([]);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Recent Searches for POS
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('sweetbite_pos_recent_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ['Croissant', 'Sourdough', 'Cheesecake', 'Flat White'];
  });

  const saveSearchTerm = (term) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const next = [clean, ...prev.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem('sweetbite_pos_recent_searches', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const removeRecentSearch = (term, e) => {
    e?.stopPropagation();
    setRecentSearches((prev) => {
      const next = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      try {
        localStorage.setItem('sweetbite_pos_recent_searches', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const clearAllRecentSearches = (e) => {
    e?.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('sweetbite_pos_recent_searches');
    } catch (e) {}
  };

  // Popular bakery searches
  const POPULAR_SEARCHES = ['Croissant', 'Sourdough', 'Tart', 'Baguette', 'Cheesecake', 'Flat White'];

  // Live product search suggestions with barcode, ID, and text matching
  const liveSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) => {
      const matchesId = p.id.toLowerCase() === q;
      const matchesBarcode = p.barcode ? p.barcode.toLowerCase() === q : false;
      const matchesName = p.name.toLowerCase().includes(q);
      const matchesCategory = p.category.toLowerCase().includes(q);
      const matchesDesc = p.description?.toLowerCase().includes(q);
      return matchesId || matchesBarcode || matchesName || matchesCategory || matchesDesc;
    }).slice(0, 8);
  }, [searchQuery]);

  // Reset selectedIndex whenever search query or liveSuggestions change
  useEffect(() => {
    setSelectedIndex(liveSuggestions.length > 0 ? 0 : -1);
  }, [searchQuery, liveSuggestions.length]);

  // Auto-scroll highlighted suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  // Global shortcut (Ctrl+K or Cmd+K) to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchDropdownOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Shared Add to Bill execution for both Click and Enter
  const handleSelectProduct = (product) => {
    if (!product) return;

    // Out of stock guard
    if (product.stock !== undefined && product.stock <= 0) {
      return;
    }

    if (onAddToCart) {
      onAddToCart(product);
    }

    saveSearchTerm(product.name);
    setSearchQuery('');
    setSearchDropdownOpen(false);
    setSelectedIndex(-1);

    // Keep focus on input for continuous scanning or keyboard entry
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 10);
  };

  const handleSelectSearch = (term) => {
    setSearchQuery(term);
    saveSearchTerm(term);
    setSearchDropdownOpen(false);
    onSelectCategory?.('All');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (liveSuggestions.length === 0) return;
      setSearchDropdownOpen(true);
      setSelectedIndex((prev) => (prev + 1) % liveSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (liveSuggestions.length === 0) return;
      setSearchDropdownOpen(true);
      setSelectedIndex((prev) => (prev <= 0 ? liveSuggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault(); // Prevent accidental form submit or page reload
      if (!searchQuery.trim() || liveSuggestions.length === 0) {
        return; // Empty search or no results: do nothing safely
      }
      const targetIndex = selectedIndex >= 0 && selectedIndex < liveSuggestions.length ? selectedIndex : 0;
      const targetProduct = liveSuggestions[targetIndex];
      if (targetProduct) {
        handleSelectProduct(targetProduct);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSearchDropdownOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Similar searches / Fuzzy suggestions
  const similarSearches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    if (liveSuggestions.length > 0) {
      const matchedCats = new Set(liveSuggestions.map((p) => p.category));
      return PRODUCTS.filter(
        (p) => matchedCats.has(p.category) && !p.name.toLowerCase().includes(q)
      )
        .slice(0, 4)
        .map((p) => p.name);
    }

    const candidates = [];
    PRODUCTS.forEach((p) => {
      const pName = p.name.toLowerCase();
      let score = 0;
      if (pName.startsWith(q.slice(0, 3))) score += 3;
      let matches = 0;
      for (const char of q) {
        if (pName.includes(char)) matches++;
      }
      score += matches / Math.max(q.length, pName.length);
      if (score >= 1.4) {
        candidates.push({ name: p.name, score });
      }
    });

    return candidates
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((c) => c.name);
  }, [searchQuery, liveSuggestions]);

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
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-[72px] bg-[#FDFBF7] border-b border-[#4E3636]/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 shrink-0 relative z-30">
      {/* Mobile Menu Hamburger Button */}
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="lg:hidden p-2 rounded-xl bg-white border border-[#4E3636]/15 text-[#321E1E] hover:bg-[#116D6E]/10 hover:text-[#116D6E] transition-colors cursor-pointer shrink-0"
        title="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search bar with dropdown (Recent, Suggestions, Similar) */}
      <div className="relative flex-1 max-w-lg min-w-0" ref={searchContainerRef}>
        <Search className="w-4 h-4 text-[#4E3636] absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={searchDropdownOpen && liveSuggestions.length > 0}
          aria-controls="pos-search-suggestions-list"
          aria-activedescendant={
            selectedIndex >= 0 && liveSuggestions[selectedIndex]
              ? `suggestion-${liveSuggestions[selectedIndex].id}`
              : undefined
          }
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchDropdownOpen(true);
          }}
          onFocus={() => setSearchDropdownOpen(true)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search artisan cakes, sourdough, pastries..."
          className="w-full bg-white text-[#321E1E] text-xs sm:text-sm pl-9 sm:pl-11 pr-8 sm:pr-10 py-2 sm:py-2.5 rounded-xl border border-[#4E3636]/20 placeholder-[#4E3636]/60 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 shadow-sm transition-all duration-200"
        />
        {searchQuery ? (
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchDropdownOpen(true);
            }}
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#4E3636]/60 hover:text-[#321E1E] p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-[11px] font-medium text-[#4E3636]/50 bg-[#FDFBF7] px-1.5 py-0.5 rounded border border-[#4E3636]/15 pointer-events-none">
            ⌘K
          </div>
        )}

        {/* Enhanced Search Dropdown for POS */}
        {searchDropdownOpen && (
          <div className="absolute left-0 top-full mt-2 w-full sm:w-[460px] bg-white rounded-2xl shadow-soft-lg border border-[#4E3636]/15 z-50 p-3.5 max-h-[420px] overflow-y-auto space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            {/* 1. Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-[#4E3636]/10 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#321E1E]">
                    <History className="w-3.5 h-3.5 text-[#116D6E]" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearAllRecentSearches}
                    className="text-[10px] font-semibold text-[#CD1818] hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      onClick={() => handleSelectSearch(term)}
                      className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FDFBF7] border border-[#4E3636]/15 hover:border-[#116D6E] hover:bg-[#116D6E]/5 text-xs text-[#321E1E] transition-all cursor-pointer"
                    >
                      <History className="w-3 h-3 text-[#4E3636]/50 group-hover:text-[#116D6E]" />
                      <span>{term}</span>
                      <button
                        type="button"
                        onClick={(e) => removeRecentSearch(term, e)}
                        className="text-[#4E3636]/40 hover:text-[#CD1818] p-0.5 rounded transition-colors ml-0.5"
                        title="Remove"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Live Search Suggestions */}
            {searchQuery.trim() ? (
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-[#4E3636]/10 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#321E1E]">
                    <Search className="w-3.5 h-3.5 text-[#116D6E]" />
                    <span>Search Suggestions</span>
                  </div>
                  <span className="text-[10px] text-[#4E3636]/60 font-medium">
                    {liveSuggestions.length} found &bull; Use &uarr;&darr; + Enter
                  </span>
                </div>

                {liveSuggestions.length > 0 ? (
                  <div
                    id="pos-search-suggestions-list"
                    role="listbox"
                    aria-label="Product suggestions"
                    className="space-y-1"
                  >
                    {liveSuggestions.map((prod, index) => {
                      const isSelected = index === selectedIndex;
                      const isOutOfStock = prod.stock !== undefined && prod.stock <= 0;

                      return (
                        <div
                          key={prod.id}
                          id={`suggestion-${prod.id}`}
                          role="option"
                          aria-selected={isSelected}
                          ref={(el) => (itemRefs.current[index] = el)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          onClick={() => !isOutOfStock && handleSelectProduct(prod)}
                          className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#116D6E]/10 border-[#116D6E]/40 ring-1 ring-[#116D6E]/20 text-[#116D6E] shadow-xs'
                              : 'hover:bg-[#FDFBF7] border-transparent text-[#321E1E] hover:border-[#4E3636]/10'
                          } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-8 h-8 rounded-lg object-cover border border-[#4E3636]/10 shrink-0"
                            />
                            <div className="min-w-0">
                              <div
                                className={`text-xs font-bold truncate ${
                                  isSelected ? 'text-[#116D6E]' : 'text-[#321E1E]'
                                }`}
                              >
                                {prod.name}
                              </div>
                              <div className="text-[10px] text-[#4E3636]/70 flex items-center gap-1.5">
                                <span>{prod.category}</span>
                                <span>&bull;</span>
                                <span className="font-semibold text-[#116D6E]">
                                  ₹{prod.sellingPrice || prod.price}{prod.sellingType === 'WEIGHT' ? ' / kg' : ''}
                                </span>
                                {prod.sellingType === 'WEIGHT' && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#116D6E]/10 text-[#116D6E]">
                                    By Weight
                                  </span>
                                )}
                                {isOutOfStock && (
                                  <>
                                    <span>&bull;</span>
                                    <span className="text-[#CD1818] font-semibold">Out of Stock</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isSelected ? (
                              <span className="text-[10px] font-semibold bg-[#116D6E] text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs animate-in fade-in duration-100">
                                {prod.sellingType === 'WEIGHT' ? '↵ Enter to weigh' : '↵ Enter to add'}
                              </span>
                            ) : (
                              <CornerDownLeft className="w-3.5 h-3.5 text-[#4E3636]/30" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-2.5 text-center text-xs text-[#4E3636]/70 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10">
                    No direct match for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            ) : null}

            {/* 3. Similar Searches / Popular Searches */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#321E1E] pb-1.5 border-b border-[#4E3636]/10 mb-2">
                {searchQuery.trim() ? (
                  liveSuggestions.length > 0 ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Similar &amp; Related Delicacies</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#116D6E]" />
                      <span>Did you mean? (Similar Searches)</span>
                    </>
                  )
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-[#116D6E]" />
                    <span>Popular Bakery Delicacies</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(searchQuery.trim()
                  ? similarSearches.length > 0
                    ? similarSearches
                    : POPULAR_SEARCHES.slice(0, 4)
                  : POPULAR_SEARCHES
                ).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectSearch(term)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#116D6E]/5 hover:bg-[#116D6E] text-[#116D6E] hover:text-white border border-[#116D6E]/20 text-xs font-medium transition-all cursor-pointer"
                  >
                    <Tag className="w-3 h-3 opacity-60" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
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
