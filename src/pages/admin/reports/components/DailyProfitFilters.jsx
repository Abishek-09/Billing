import React from 'react';
import { Search, Filter, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../../../../data/mockData';

export const DailyProfitFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  includeZeroSales,
  setIncludeZeroSales,
  onResetFilters,
  resultCount,
}) => {
  const SORT_OPTIONS = [
    { value: 'totalProfit', label: 'Total Profit' },
    { value: 'name', label: 'Product Name' },
    { value: 'quantitySold', label: 'Quantity Sold' },
    { value: 'salesBeforeGst', label: 'Sales Value (Pre-GST)' },
    { value: 'totalGst', label: 'GST Tax Liability' },
    { value: 'marginPercent', label: 'Profit Margin %' },
  ];

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    sortBy !== 'totalProfit' ||
    sortDirection !== 'desc' ||
    includeZeroSales;

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#4E3636]/15 shadow-soft space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input: Matches Product Name, POS Code, or Category */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4E3636]/60">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Product Name, POS Code (e.g. POS-CK01)..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#FDFBF7] border border-[#4E3636]/20 focus:border-[#116D6E] focus:bg-white text-xs font-medium text-[#321E1E] outline-none transition-all placeholder:text-[#4E3636]/50 shadow-inner-soft"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#4E3636]/60 hover:text-[#321E1E]"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#FDFBF7] border border-[#4E3636]/20 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-[#116D6E]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#321E1E] outline-none cursor-pointer pr-1"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.filter((c) => c.name !== 'All').map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#FDFBF7] border border-[#4E3636]/20 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <span className="text-[11px] text-[#4E3636] font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#321E1E] outline-none cursor-pointer pr-1"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Sort Direction Toggle Button */}
            <button
              type="button"
              onClick={() =>
                setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'))
              }
              className="p-1 rounded-lg hover:bg-white text-[#116D6E] transition-all cursor-pointer"
              title={
                sortDirection === 'desc'
                  ? 'Descending (Highest first)'
                  : 'Ascending (Lowest first)'
              }
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Include Zero Sales Toggle */}
          <label className="flex items-center gap-1.5 text-xs text-[#4E3636] font-semibold bg-[#FDFBF7] border border-[#4E3636]/15 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-white transition-all select-none">
            <input
              type="checkbox"
              checked={includeZeroSales}
              onChange={(e) => setIncludeZeroSales(e.target.checked)}
              className="rounded accent-[#116D6E] cursor-pointer"
            />
            <span>Show Unsold (0 Qty)</span>
          </label>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="p-2 rounded-xl bg-white border border-[#4E3636]/20 hover:border-[#CD1818] text-[#CD1818] text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              title="Reset all filters to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Quick Filter Badges */}
      <div className="flex items-center justify-between text-[11px] text-[#4E3636] pt-1 border-t border-[#4E3636]/10">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-[#116D6E]">{resultCount}</strong> items in report
          </span>
          {selectedCategory !== 'All' && (
            <span className="px-2 py-0.5 rounded-md bg-[#116D6E]/10 text-[#116D6E] font-semibold">
              Category: {selectedCategory}
            </span>
          )}
          {searchQuery && (
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold">
              Query: &quot;{searchQuery}&quot;
            </span>
          )}
        </div>

        <div className="text-[10px] text-[#4E3636]/70 hidden sm:block">
          Sorted by: <span className="font-semibold text-[#321E1E]">{SORT_OPTIONS.find((s) => s.value === sortBy)?.label}</span> ({sortDirection === 'desc' ? 'High to Low' : 'Low to High'})
        </div>
      </div>
    </div>
  );
};

export default DailyProfitFilters;
