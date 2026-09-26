import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const KpiCard = ({
  label,
  value,
  trend,
  isPositive = true,
  comparison = 'vs last week',
  icon: Icon,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-soft border border-[#4E3636]/10 flex flex-col justify-between hover:shadow-soft-lg transition-all duration-200">
      {/* Top Row: Label and Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#4E3636]">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#FDFBF7] border border-[#4E3636]/10 flex items-center justify-center text-[#116D6E]">
            <Icon className="w-4 h-4 text-[#116D6E]" />
          </div>
        )}
      </div>

      {/* Middle Row: Large Value in #321E1E bold */}
      <div className="text-2xl sm:text-3xl font-extrabold text-[#321E1E] tracking-tight mb-3">
        {value}
      </div>

      {/* Bottom Row: Trend in #116D6E (positive) or #CD1818 (negative) */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#4E3636]/10">
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
            isPositive
              ? 'bg-[#116D6E]/10 text-[#116D6E]'
              : 'bg-[#CD1818]/10 text-[#CD1818]'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
          <span>{trend}</span>
        </span>
        <span className="text-xs text-[#4E3636]/80 font-medium">
          {comparison}
        </span>
      </div>
    </div>
  );
};

export default KpiCard;
