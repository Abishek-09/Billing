import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  CreditCard,
  Percent,
  Receipt,
  CheckCircle2,
  DollarSign,
  PieChart as PieIcon,
  ChevronDown,
  ArrowUpRight,
  ShieldCheck,
  Scale
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import {
  REPORTS_FINANCIAL_SUMMARY,
  PAYMENT_TENDER_AUDIT,
  GST_SLAB_AUDIT_DATA,
  PRODUCT_PROFITABILITY_DATA
} from '../../data/adminMockData';

// Custom Tooltip for Payment Tender Donut
const PaymentTenderTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-xl shadow-soft-lg border border-[#4E3636]/15 text-xs">
        <p className="font-bold text-[#321E1E]">{data.method}</p>
        <p className="font-extrabold text-sm mt-0.5" style={{ color: data.color }}>
          ₹{data.amount.toLocaleString('en-IN')}{' '}
          <span className="text-xs font-normal text-[#4E3636]">({data.percentage})</span>
        </p>
        <p className="text-[10px] text-[#4E3636] mt-0.5">
          {data.count} settlements reconciled
        </p>
      </div>
    );
  }
  return null;
};

export const AdminReports = () => {
  const outletContext = useOutletContext();
  const selectedRange = outletContext?.selectedDateRange || 'This Week';
  const setSelectedDateRange = outletContext?.setSelectedDateRange;

  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview' | 'GST' | 'Profitability'

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Pull financial data dynamically based on selectedRange
  const financialData =
    REPORTS_FINANCIAL_SUMMARY[selectedRange] || REPORTS_FINANCIAL_SUMMARY['This Week'];

  const totalGSTTax = GST_SLAB_AUDIT_DATA.reduce((acc, curr) => acc + curr.totalTax, 0);
  const totalTaxableTurnover = GST_SLAB_AUDIT_DATA.reduce(
    (acc, curr) => acc + curr.taxableValue,
    0
  );

  // 1. Download Profit & Loss Statement (CSV)
  const handleDownloadPL = () => {
    const headers = ['Financial Metric', 'Value', 'Reporting Timeframe'];
    const rows = [
      ['Gross Counter Sales', `"${financialData.grossSales}"`, selectedRange],
      ['Promotions & Bill Discounts', `"${financialData.discounts}"`, selectedRange],
      ['Net Realized Revenue', `"${financialData.netRevenue}"`, selectedRange],
      ['Cost of Goods Sold (COGS)', `"${financialData.cogs}"`, selectedRange],
      ['Gross Operating Profit', `"${financialData.grossProfit}"`, selectedRange],
      ['Gross Profit Margin (%)', `"${financialData.marginPercent}"`, selectedRange],
      ['Total GST Collected (Liability)', `"${financialData.gstCollected}"`, selectedRange],
      ['Pending Advance Receivables', `"${financialData.pendingReceivables}"`, selectedRange],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `# SweetBite Artisan Bakery - Profit & Loss Statement (${selectedRange})`,
        headers.join(','),
        ...rows.map((r) => r.join(',')),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `SweetBite_PL_Statement_${selectedRange.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`P&L Statement for "${selectedRange}" downloaded successfully.`);
  };

  // 2. Download GST Tax Ledger (CSV - GSTR-1 format)
  const handleDownloadGST = () => {
    const headers = [
      'GST Tax Slab',
      'HSN Code',
      'Taxable Turnover (INR)',
      'CGST 50% (INR)',
      'SGST 50% (INR)',
      'Total Output Tax (INR)',
    ];

    const rows = GST_SLAB_AUDIT_DATA.map((row) => [
      `"${row.slab}"`,
      row.hsn,
      row.taxableValue,
      row.cgst,
      row.sgst,
      row.totalTax,
    ]);

    rows.push([
      '"TOTAL LIABILITY"',
      '"—"',
      totalTaxableTurnover,
      totalGSTTax / 2,
      totalGSTTax / 2,
      totalGSTTax,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `# SweetBite Bakery - GSTR-1 Statutory Tax Liability Ledger (${selectedRange})`,
        headers.join(','),
        ...rows.map((r) => r.join(',')),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `SweetBite_GST_Tax_Ledger_${selectedRange.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`GST Tax Ledger for "${selectedRange}" downloaded.`);
  };

  // 3. Print Complete Audit Report
  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#116D6E]/10 border border-[#116D6E]/20 text-[#116D6E] rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#116D6E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Export Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#4E3636]/15 shadow-soft">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#116D6E]" />
            <h2 className="font-serif text-2xl font-bold text-[#321E1E]">
              Financial Auditing &amp; Profitability Reports
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20">
              Tax &amp; P&amp;L Suite
            </span>
          </div>
          <p className="text-xs text-[#4E3636] mt-1">
            GSTR-1 tax compliance, Cost of Goods Sold (COGS), payment tender reconciliation, and item margins
          </p>
        </div>

        {/* Action Buttons: Export P&L, Export GST, Print */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadPL}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#4E3636]/20 hover:border-[#116D6E] text-[#321E1E] text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            title="Download Profit & Loss CSV"
          >
            <Download className="w-4 h-4 text-[#116D6E]" />
            <span>P&amp;L Report (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadGST}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#4E3636]/20 hover:border-[#116D6E] text-[#321E1E] text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            title="Download GST Liability CSV"
          >
            <FileText className="w-4 h-4 text-[#CD1818]" />
            <span>GST Ledger (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handlePrintAudit}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] active:scale-95 text-white text-xs font-bold shadow-teal transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Audit Report</span>
          </button>
        </div>
      </div>

      {/* 1. Executive P&L Financial Ledger (4 Distinct Auditing Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Gross Sales vs Discounts */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              Net Billed Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#116D6E]/10 flex items-center justify-center text-[#116D6E]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-[#321E1E] tracking-tight">
              {financialData.netRevenue}
            </div>
            <div className="text-xs text-[#4E3636] mt-1">
              Gross: <strong className="text-[#321E1E]">{financialData.grossSales}</strong> &bull; Disc:{' '}
              <span className="text-[#CD1818] font-semibold">{financialData.discounts}</span>
            </div>
          </div>
          <div className="text-[11px] text-[#4E3636] pt-2 border-t border-[#4E3636]/10 flex justify-between">
            <span>Period:</span>
            <span className="font-semibold text-[#116D6E]">{selectedRange}</span>
          </div>
        </div>

        {/* Card 2: Cost of Goods Sold (COGS) & Profit Margin */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              Gross Profit &amp; Margin
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-emerald-800 tracking-tight">
              {financialData.grossProfit}
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                {financialData.marginPercent} Margin
              </span>
              <span className="text-[11px] text-[#4E3636]">
                COGS: {financialData.cogs}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#4E3636] pt-2 border-t border-[#4E3636]/10 flex justify-between">
            <span>Ingredient Cost Ratio:</span>
            <span className="font-semibold text-[#321E1E]">32.0%</span>
          </div>
        </div>

        {/* Card 3: Total GST Tax Liability */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              GST Tax Collected
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#CD1818]/10 flex items-center justify-center text-[#CD1818]">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-[#CD1818] tracking-tight">
              {financialData.gstCollected}
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <span className="font-bold text-[#CD1818] bg-[#CD1818]/10 px-2 py-0.5 rounded-md">
                Output Tax Payable
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#4E3636] pt-2 border-t border-[#4E3636]/10 flex justify-between">
            <span>Filing Status:</span>
            <span className="font-bold text-emerald-700">GSTR-1 Balanced</span>
          </div>
        </div>

        {/* Card 4: Advance Receivables Due */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              Pending Receivables
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-amber-800 tracking-tight">
              {financialData.pendingReceivables}
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <span className="font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                Uncollected Balances
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#4E3636] pt-2 border-t border-[#4E3636]/10 flex justify-between">
            <span>Collection Point:</span>
            <span className="font-semibold text-[#321E1E]">Counter Handover</span>
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Payment Tender Reconciliation (Left) & GSTR-1 Tax Ledger (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 cols): Payment Tender Audit & Bank Reconciliation */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#116D6E]" />
                <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                  Payment Tender Reconciliation
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                100% Audited
              </span>
            </div>
            <p className="text-xs text-[#4E3636] mb-4">
              Electronic UPI vs. Counter Cash vs. Card settlement distribution
            </p>

            {/* Donut Chart */}
            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<PaymentTenderTooltip />} />
                  <Pie
                    data={PAYMENT_TENDER_AUDIT}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {PAYMENT_TENDER_AUDIT.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-[10px] text-[#4E3636] uppercase font-bold block">Net Tender</span>
                <span className="text-base font-extrabold text-[#321E1E]">₹2,54,200</span>
              </div>
            </div>

            {/* Tender Breakdown List */}
            <div className="space-y-2 mt-3 pt-3 border-t border-[#4E3636]/10 text-xs">
              {PAYMENT_TENDER_AUDIT.map((item) => (
                <div key={item.method} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-[#321E1E]">{item.method}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#321E1E]">₹{item.amount.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-[#4E3636] ml-1.5 font-semibold">({item.percentage})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#4E3636]/10 text-[11px] text-[#4E3636] flex items-center justify-between">
            <span>Bank Deposit Status:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Matched with Bank Account</span>
            </span>
          </div>
        </div>

        {/* Right (7 cols): GSTR-1 Tax Liability Summary Ledger */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#CD1818]" />
                <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                  GSTR-1 Tax Liability Summary Ledger
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#CD1818]/10 text-[#CD1818] border border-[#CD1818]/20">
                GST Ready
              </span>
            </div>
            <p className="text-xs text-[#4E3636] mb-4">
              Slab-wise taxable turnover and CGST/SGST collected for government tax filing
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7] text-[#4E3636]">
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">GST Slab</th>
                    <th className="py-2.5 px-2 font-bold uppercase tracking-wider">HSN</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Taxable Sales</th>
                    <th className="py-2.5 px-2.5 font-bold uppercase tracking-wider text-right">CGST</th>
                    <th className="py-2.5 px-2.5 font-bold uppercase tracking-wider text-right">SGST</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Total Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4E3636]/10">
                  {GST_SLAB_AUDIT_DATA.map((row) => (
                    <tr key={row.slab} className="hover:bg-[#FDFBF7]/60">
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#321E1E] block">{row.slab}</span>
                        <span className="text-[10px] text-[#4E3636] block line-clamp-1">{row.description}</span>
                      </td>
                      <td className="py-3 px-2 font-mono text-[11px] text-[#4E3636]">{row.hsn}</td>
                      <td className="py-3 px-3 text-right font-semibold text-[#321E1E]">
                        ₹{row.taxableValue.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2.5 text-right text-[#4E3636]">
                        ₹{row.cgst.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2.5 text-right text-[#4E3636]">
                        ₹{row.sgst.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-[#CD1818]">
                        ₹{row.totalTax.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-[#116D6E]/5 font-bold text-[#116D6E] border-t-2 border-[#116D6E]/30">
                    <td className="py-3 px-3" colSpan={2}>
                      TOTAL LIABILITY PAYABLE
                    </td>
                    <td className="py-3 px-3 text-right">
                      ₹{totalTaxableTurnover.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2.5 text-right">
                      ₹{(totalGSTTax / 2).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2.5 text-right">
                      ₹{(totalGSTTax / 2).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-[#CD1818] font-extrabold text-sm">
                      ₹{totalGSTTax.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#4E3636]/10 flex flex-wrap items-center justify-between text-[11px] text-[#4E3636] gap-2">
            <span>Prepared according to Indian GST Composite and Regular Scheme</span>
            <button
              onClick={handleDownloadGST}
              className="text-[#116D6E] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Export GSTR-1 File (CSV)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Menu Engineering & Product Profitability Matrix */}
      <div className="bg-white rounded-2xl border border-[#4E3636]/15 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-[#4E3636]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#116D6E]" />
              <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                Menu Engineering &amp; Product Profitability Matrix
              </h3>
            </div>
            <p className="text-xs text-[#4E3636] mt-0.5">
              Selling price vs. recipe ingredient cost (COGS), profit margin %, and gross profit contribution
            </p>
          </div>
          <span className="text-xs text-[#116D6E] font-bold bg-[#116D6E]/10 px-3 py-1 rounded-lg self-start sm:self-auto">
            Strategic Margin Analysis
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7] text-[#4E3636]">
                <th className="py-3 px-5 font-bold uppercase tracking-wider">Rank</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Product Name</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Selling Price</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Unit Cost (COGS)</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Margin %</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Volume Sold</th>
                <th className="py-3 px-5 font-bold uppercase tracking-wider text-right">Gross Profit Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4E3636]/10">
              {PRODUCT_PROFITABILITY_DATA.map((item) => (
                <tr key={item.name} className="hover:bg-[#FDFBF7]/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                      item.rank === 1
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : item.rank === 2
                        ? 'bg-slate-100 text-slate-800'
                        : 'bg-[#FDFBF7] text-[#4E3636]'
                    }`}>
                      #{item.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#321E1E] block">{item.name}</span>
                    <span className="text-[10px] text-[#116D6E] font-medium block">
                      {item.classification}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#4E3636] font-medium">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#321E1E]">
                    ₹{item.sellingPrice}
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#4E3636]">
                    ₹{item.unitCost}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-emerald-100 text-emerald-800">
                      {item.margin}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-[#321E1E]">
                    {item.qtySold.toLocaleString('en-IN')} pcs
                  </td>
                  <td className="py-3.5 px-5 text-right font-extrabold text-[#116D6E] text-sm">
                    ₹{item.grossProfit.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
