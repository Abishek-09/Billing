import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle, TrendingDown } from 'lucide-react';
import { formatINR } from '../../../../services/productProfitService';

export const DailyProfitTable = ({
  rows,
  summary,
  sortBy,
  sortDirection,
  onSortChange,
}) => {
  const getSortIcon = (columnKey) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown className="w-3 h-3 text-[#4E3636]/40 group-hover:text-[#116D6E]" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#116D6E]" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#116D6E]" />
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#4E3636]/15 shadow-soft overflow-hidden">
      <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          {/* Sticky Table Header */}
          <thead className="sticky top-0 z-20 bg-[#FDFBF7] shadow-xs">
            <tr className="border-b border-[#4E3636]/10 text-[#4E3636] font-bold uppercase tracking-wider text-[11px]">
              {/* 1. Product (Sticky Column) */}
              <th
                onClick={() => onSortChange('name')}
                className="py-3 px-4 bg-[#FDFBF7] sticky left-0 z-30 shadow-[2px_0_5px_rgba(0,0,0,0.03)] cursor-pointer group hover:text-[#116D6E] transition-colors whitespace-nowrap min-w-[200px]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Product</span>
                  {getSortIcon('name')}
                </div>
              </th>

              {/* 2. POS Code */}
              <th
                onClick={() => onSortChange('posCode')}
                className="py-3 px-3 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors text-center whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>POS Code</span>
                  {getSortIcon('posCode')}
                </div>
              </th>

              {/* 3. Category */}
              <th
                onClick={() => onSortChange('category')}
                className="py-3 px-3 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Category</span>
                  {getSortIcon('category')}
                </div>
              </th>

              {/* 4. Buy Price (Purchase Price / COGS) */}
              <th
                onClick={() => onSortChange('buyPrice')}
                className="py-3 px-3 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Buy Price</span>
                  {getSortIcon('buyPrice')}
                </div>
              </th>

              {/* 5. Selling Price (Base price before tax) */}
              <th
                onClick={() => onSortChange('sellingPrice')}
                className="py-3 px-3 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Selling Price</span>
                  {getSortIcon('sellingPrice')}
                </div>
              </th>

              {/* 6. GST % */}
              <th
                onClick={() => onSortChange('gstRate')}
                className="py-3 px-2.5 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors text-center whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>GST %</span>
                  {getSortIcon('gstRate')}
                </div>
              </th>

              {/* 7. GST/Unit */}
              <th
                onClick={() => onSortChange('gstPerUnit')}
                className="py-3 px-3 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>GST/Unit</span>
                  {getSortIcon('gstPerUnit')}
                </div>
              </th>

              {/* 8. Selling + GST */}
              <th
                onClick={() => onSortChange('sellingPlusGst')}
                className="py-3 px-3 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Selling + GST</span>
                  {getSortIcon('sellingPlusGst')}
                </div>
              </th>

              {/* 9. Qty Sold */}
              <th
                onClick={() => onSortChange('quantitySold')}
                className="py-3 px-3 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Qty Sold</span>
                  {getSortIcon('quantitySold')}
                </div>
              </th>

              {/* 10. Sales Before GST */}
              <th
                onClick={() => onSortChange('salesBeforeGst')}
                className="py-3 px-3.5 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Sales Pre-GST</span>
                  {getSortIcon('salesBeforeGst')}
                </div>
              </th>

              {/* 11. Total GST */}
              <th
                onClick={() => onSortChange('totalGst')}
                className="py-3 px-3.5 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total GST</span>
                  {getSortIcon('totalGst')}
                </div>
              </th>

              {/* 12. Profit/Unit */}
              <th
                onClick={() => onSortChange('profitPerUnit')}
                className="py-3 px-3 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Profit/Unit</span>
                  {getSortIcon('profitPerUnit')}
                </div>
              </th>

              {/* 13. Total Profit */}
              <th
                onClick={() => onSortChange('totalProfit')}
                className="py-3 px-4 bg-[#FDFBF7] cursor-pointer group hover:text-[#116D6E] transition-colors text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total Profit</span>
                  {getSortIcon('totalProfit')}
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#4E3636]/10 text-xs font-medium">
            {rows.map((item) => {
              const isNegative = item.isNegativeProfit || item.profitPerUnit < 0;
              const isZero = item.isZeroProfit;

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-[#FDFBF7]/70 transition-colors ${
                    isNegative ? 'bg-[#CD1818]/5' : ''
                  }`}
                >
                  {/* 1. Product (Sticky Column) */}
                  <td className="py-3 px-4 sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-2.5">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover border border-[#4E3636]/15 shrink-0"
                        />
                      )}
                      <div>
                        <div className="font-bold text-[#321E1E] flex items-center gap-1.5 flex-wrap">
                          <span>{item.name}</span>
                          {item.sellingType === 'WEIGHT' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20">
                              By Weight
                            </span>
                          )}
                          {isNegative && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#CD1818]/15 text-[#CD1818] border border-[#CD1818]/30 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              <span>Loss Leader</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#4E3636]/70 flex items-center gap-1.5 mt-0.5">
                          <span>Unit: {item.unit || (item.sellingType === 'WEIGHT' ? 'kg' : '1 pc')}</span>
                          <span>&bull;</span>
                          <span>Rank #{item.rank}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. POS Code */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FDFBF7] text-[#116D6E] border border-[#116D6E]/20">
                      {item.posCode || '—'}
                    </span>
                  </td>

                  {/* 3. Category */}
                  <td className="py-3 px-3 text-[#4E3636]">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#4E3636]/10 text-[#321E1E]">
                      {item.category}
                    </span>
                  </td>

                  {/* 4. Buy Price (Purchase Price) */}
                  <td className="py-3 px-3 text-right text-[#4E3636]">
                    {formatINR(item.buyPrice)}
                    {item.sellingType === 'WEIGHT' && <span className="text-[10px] text-[#4E3636]/60">/kg</span>}
                  </td>

                  {/* 5. Selling Price (Base) */}
                  <td className="py-3 px-3 text-right font-bold text-[#321E1E]">
                    {formatINR(item.sellingPrice)}
                    {item.sellingType === 'WEIGHT' && <span className="text-[10px] text-[#4E3636]/60 font-normal">/kg</span>}
                  </td>

                  {/* 6. GST % */}
                  <td className="py-3 px-2.5 text-center">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.gstRate === 0
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-[#CD1818]/10 text-[#CD1818]'
                      }`}
                    >
                      {item.gstRate}%
                    </span>
                  </td>

                  {/* 7. GST/Unit */}
                  <td className="py-3 px-3 text-right text-[#CD1818] font-semibold">
                    {formatINR(item.gstPerUnit)}
                  </td>

                  {/* 8. Selling + GST */}
                  <td className="py-3 px-3 text-right font-bold text-[#321E1E]">
                    {formatINR(item.sellingPlusGst)}
                  </td>

                  {/* 9. Qty Sold */}
                  <td className="py-3 px-3 text-right font-bold text-[#116D6E]">
                    {item.sellingType === 'WEIGHT' ? (item.displayQuantity || `${item.quantitySold} kg`) : item.quantitySold}
                  </td>

                  {/* 10. Sales Before GST */}
                  <td className="py-3 px-3.5 text-right font-semibold text-[#321E1E]">
                    {formatINR(item.salesBeforeGst)}
                  </td>

                  {/* 11. Total GST */}
                  <td className="py-3 px-3.5 text-right font-bold text-[#CD1818]">
                    {formatINR(item.totalGst)}
                  </td>

                  {/* 12. Profit/Unit */}
                  <td
                    className={`py-3 px-3 text-right font-bold ${
                      isNegative
                        ? 'text-[#CD1818]'
                        : isZero
                        ? 'text-slate-500'
                        : 'text-emerald-700'
                    }`}
                  >
                    {formatINR(item.profitPerUnit)}
                  </td>

                  {/* 13. Total Profit */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                          isNegative
                            ? 'bg-[#CD1818]/15 text-[#CD1818]'
                            : isZero
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {formatINR(item.totalProfit)}
                      </span>
                      <span className="text-[10px] text-[#4E3636] font-semibold mt-0.5">
                        {item.marginPercent}% margin
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Sticky Total Audit Summary Footer Row */}
          <tfoot className="sticky bottom-0 z-20 bg-[#FDFBF7] border-t-2 border-[#116D6E]/30 font-bold text-[#321E1E] text-xs shadow-md">
            <tr>
              {/* 1. Product (Sticky) */}
              <td className="py-3 px-4 sticky left-0 z-30 bg-[#FDFBF7] shadow-[2px_0_5px_rgba(0,0,0,0.03)] text-[#116D6E] uppercase tracking-wider font-extrabold">
                TOTAL AUDIT ({rows.length} ITEMS)
              </td>

              {/* 2. POS Code */}
              <td className="py-3 px-3 text-center text-[#4E3636]">
                —
              </td>

              {/* 3. Category */}
              <td className="py-3 px-3 text-[#4E3636]">
                —
              </td>

              {/* 4. Buy Price */}
              <td className="py-3 px-3 text-right text-[#4E3636]">
                —
              </td>

              {/* 5. Selling Price */}
              <td className="py-3 px-3 text-right text-[#4E3636]">
                —
              </td>

              {/* 6. GST % */}
              <td className="py-3 px-2.5 text-center text-[#4E3636]">
                —
              </td>

              {/* 7. GST/Unit */}
              <td className="py-3 px-3 text-right text-[#4E3636]">
                —
              </td>

              {/* 8. Selling + GST */}
              <td className="py-3 px-3 text-right text-[#4E3636]">
                —
              </td>

              {/* 9. Qty Sold */}
              <td className="py-3 px-3 text-right text-[#116D6E] font-extrabold text-sm">
                {summary.totalQuantity} pcs
              </td>

              {/* 10. Sales Before GST */}
              <td className="py-3 px-3.5 text-right font-extrabold text-[#321E1E] text-sm">
                {formatINR(summary.salesBeforeGst)}
              </td>

              {/* 11. Total GST */}
              <td className="py-3 px-3.5 text-right text-[#CD1818] font-extrabold text-sm">
                {formatINR(summary.totalGst)}
              </td>

              {/* 12. Profit/Unit */}
              <td className="py-3 px-3 text-right text-[#4E3636]">
                —
              </td>

              {/* 13. Total Profit */}
              <td className="py-3 px-4 text-right">
                <div className="flex flex-col items-end">
                  <span
                    className={`text-sm font-extrabold px-2.5 py-0.5 rounded-lg ${
                      summary.isNetLoss
                        ? 'bg-[#CD1818]/20 text-[#CD1818]'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {formatINR(summary.totalProfit)}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold mt-0.5">
                    {summary.overallMarginPercent}% Net Margin
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DailyProfitTable;
