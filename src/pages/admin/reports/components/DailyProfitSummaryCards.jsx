import React from 'react';
import {
  PackageCheck,
  Layers,
  Receipt,
  Percent,
  Coins,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { formatINR } from '../../../../services/productProfitService';

export const DailyProfitSummaryCards = ({ summary }) => {
  const isLoss = summary.isNetLoss;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Products Sold */}
      <div className="bg-white rounded-2xl p-4 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#4E3636] uppercase tracking-wider">
            Products Sold
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#116D6E]/10 flex items-center justify-center text-[#116D6E]">
            <PackageCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold text-[#321E1E] tracking-tight">
            {summary.productsSold}
          </div>
          <div className="text-[11px] text-[#4E3636] mt-0.5">
            Distinct SKUs billed
          </div>
        </div>
        <div className="pt-2 border-t border-[#4E3636]/10 text-[10px] text-[#116D6E] font-semibold flex items-center gap-1">
          <span>Active catalog sellers</span>
        </div>
      </div>

      {/* 2. Total Quantity */}
      <div className="bg-white rounded-2xl p-4 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#4E3636] uppercase tracking-wider">
            Total Quantity
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold text-[#321E1E] tracking-tight">
            {summary.totalQuantity} <span className="text-sm font-semibold text-[#4E3636]">pcs</span>
          </div>
          <div className="text-[11px] text-[#4E3636] mt-0.5">
            Volume across orders
          </div>
        </div>
        <div className="pt-2 border-t border-[#4E3636]/10 text-[10px] text-amber-800 font-semibold">
          Daily sales throughput
        </div>
      </div>

      {/* 3. Sales Before GST */}
      <div className="bg-white rounded-2xl p-4 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#4E3636] uppercase tracking-wider">
            Sales Before GST
          </span>
          <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-700">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold text-[#321E1E] tracking-tight">
            {formatINR(summary.salesBeforeGst)}
          </div>
          <div className="text-[11px] text-[#4E3636] mt-0.5">
            Base taxable turnover
          </div>
        </div>
        <div className="pt-2 border-t border-[#4E3636]/10 text-[10px] text-sky-800 font-semibold">
          Excludes GST collections
        </div>
      </div>

      {/* 4. Total GST */}
      <div className="bg-white rounded-2xl p-4 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#4E3636] uppercase tracking-wider">
            Total GST
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#CD1818]/10 flex items-center justify-center text-[#CD1818]">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold text-[#CD1818] tracking-tight">
            {formatINR(summary.totalGst)}
          </div>
          <div className="text-[11px] text-[#4E3636] mt-0.5">
            Output tax liability
          </div>
        </div>
        <div className="pt-2 border-t border-[#4E3636]/10 text-[10px] text-[#CD1818] font-bold flex items-center gap-1">
          <span>GSTR-1 Payable</span>
        </div>
      </div>

      {/* 5. Customer Collection */}
      <div className="bg-white rounded-2xl p-4 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#4E3636] uppercase tracking-wider">
            Customer Collection
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold text-[#321E1E] tracking-tight">
            {formatINR(summary.customerCollection)}
          </div>
          <div className="text-[11px] text-[#4E3636] mt-0.5">
            Sales + Total GST Billed
          </div>
        </div>
        <div className="pt-2 border-t border-[#4E3636]/10 text-[10px] text-purple-800 font-semibold">
          Till &amp; tender settlement
        </div>
      </div>

      {/* 6. Total Profit */}
      <div
        className={`rounded-2xl p-4 border shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all ${
          isLoss
            ? 'bg-[#CD1818]/5 border-[#CD1818]/30'
            : 'bg-emerald-50/50 border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider ${
              isLoss ? 'text-[#CD1818]' : 'text-emerald-900'
            }`}
          >
            Total Profit
          </span>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isLoss
                ? 'bg-[#CD1818]/15 text-[#CD1818]'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {isLoss ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
          </div>
        </div>
        <div className="my-2">
          <div
            className={`text-2xl font-extrabold tracking-tight ${
              isLoss ? 'text-[#CD1818]' : 'text-emerald-800'
            }`}
          >
            {formatINR(summary.totalProfit)}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                isLoss
                  ? 'bg-[#CD1818]/20 text-[#CD1818]'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {summary.overallMarginPercent}% Margin
            </span>
          </div>
        </div>
        <div
          className={`pt-2 border-t text-[10px] font-bold flex items-center justify-between ${
            isLoss
              ? 'border-[#CD1818]/20 text-[#CD1818]'
              : 'border-emerald-200 text-emerald-800'
          }`}
        >
          <span>Net Profit (Pre-GST)</span>
          {isLoss && <AlertTriangle className="w-3.5 h-3.5" />}
        </div>
      </div>
    </div>
  );
};

export default DailyProfitSummaryCards;
