import React from 'react';
import { Calendar, Download, Printer, ShieldCheck, Clock } from 'lucide-react';

export const DailyProfitHeader = ({
  dateType,
  setDateType,
  customDate,
  setCustomDate,
  onExportCSV,
  onPrintReport,
  totalTransactionsCount,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#4E3636]/15 shadow-soft">
      {/* Title & Metadata */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#116D6E] animate-pulse" />
          <h2 className="font-serif text-2xl font-bold text-[#321E1E]">
            Product Daily Profit Report
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20 inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#116D6E]" />
            <span>Tax-Exempt Margin Audit</span>
          </span>
        </div>
        <p className="text-xs text-[#4E3636] mt-1 flex items-center gap-1.5 flex-wrap">
          <span>Item-level profitability analysis. Statutory GST is treated strictly as tax liability and isolated from operational gross profit.</span>
          {totalTransactionsCount > 0 && (
            <span className="text-[#116D6E] font-semibold bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#4E3636]/10 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#116D6E]" />
              <span>{totalTransactionsCount} line settlements</span>
            </span>
          )}
        </p>
      </div>

      {/* Date Selector & Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Selector Segmented Control */}
        <div className="bg-[#FDFBF7] p-1 rounded-xl border border-[#4E3636]/15 flex items-center gap-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setDateType('Today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              dateType === 'Today'
                ? 'bg-[#116D6E] text-white shadow-xs'
                : 'text-[#4E3636] hover:text-[#321E1E]'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setDateType('Yesterday')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              dateType === 'Yesterday'
                ? 'bg-[#116D6E] text-white shadow-xs'
                : 'text-[#4E3636] hover:text-[#321E1E]'
            }`}
          >
            Yesterday
          </button>
          <button
            type="button"
            onClick={() => setDateType('Custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              dateType === 'Custom'
                ? 'bg-[#116D6E] text-white shadow-xs'
                : 'text-[#4E3636] hover:text-[#321E1E]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Custom</span>
          </button>
        </div>

        {/* Custom Date Picker (Rendered if 'Custom' is selected) */}
        {dateType === 'Custom' && (
          <div className="flex items-center gap-1.5 bg-white border border-[#116D6E] px-2.5 py-1 rounded-xl shadow-xs animate-in fade-in duration-150">
            <span className="text-[11px] font-semibold text-[#4E3636]">Date:</span>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="text-xs font-semibold text-[#321E1E] bg-transparent outline-none cursor-pointer"
            />
          </div>
        )}

        {/* Export to CSV Action */}
        <button
          type="button"
          onClick={onExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#4E3636]/20 hover:border-[#116D6E] text-[#116D6E] text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          title="Export Filtered & Sorted Profit Report to CSV"
        >
          <Download className="w-3.5 h-3.5 text-[#116D6E]" />
          <span>Export CSV</span>
        </button>

        {/* Browser Print Report Action */}
        <button
          type="button"
          onClick={onPrintReport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] active:scale-95 text-white text-xs font-bold shadow-teal transition-all cursor-pointer"
          title="Print official audit report"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Report</span>
        </button>
      </div>
    </div>
  );
};

export default DailyProfitHeader;
