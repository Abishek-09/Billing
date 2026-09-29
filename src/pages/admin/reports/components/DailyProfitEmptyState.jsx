import React from 'react';
import { CalendarX2, RotateCcw, PackageX } from 'lucide-react';

export const DailyProfitEmptyState = ({
  isFilterMismatch,
  onResetFilters,
  onSwitchToToday,
  activeDateLabel,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#4E3636]/15 p-12 text-center shadow-soft flex flex-col items-center justify-center animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-2xl bg-[#FDFBF7] border border-[#4E3636]/15 flex items-center justify-center text-[#116D6E] mb-4 shadow-inner">
        {isFilterMismatch ? (
          <PackageX className="w-8 h-8 text-[#CD1818]" />
        ) : (
          <CalendarX2 className="w-8 h-8 text-[#116D6E]" />
        )}
      </div>

      <h3 className="font-serif text-xl font-bold text-[#321E1E] mb-1">
        {isFilterMismatch ? 'No Products Match Filters' : 'No Sales Recorded for This Date'}
      </h3>

      <p className="text-xs text-[#4E3636] max-w-md mx-auto mb-6">
        {isFilterMismatch
          ? 'No bakery products match your search query or selected category. Try loosening your filters or resetting them.'
          : `There were no settlement transactions recorded for ${activeDateLabel}. You can select another date or toggle "Show Unsold" to analyze standard product margins.`}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isFilterMismatch ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] text-white text-xs font-bold shadow-teal transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onSwitchToToday}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] text-white text-xs font-bold shadow-teal transition-all cursor-pointer active:scale-95"
          >
            <span>Switch to Today&apos;s Sales</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyProfitEmptyState;
