import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Download,
  TrendingUp,
  Award,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { REPORTS_DATA, getDashboardDataByRange } from '../../data/adminMockData';

const CustomAreaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-soft border border-[#4E3636]/15 text-xs">
        <p className="font-bold text-[#321E1E] mb-1">{label}</p>
        <p className="text-[#116D6E] font-extrabold text-sm">
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
        <p className="text-[10px] text-[#4E3636] mt-0.5">
          {payload[0].payload.orders} orders processed
        </p>
      </div>
    );
  }
  return null;
};

const CustomDonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2.5 rounded-xl shadow-soft border border-[#4E3636]/15 text-xs">
        <p className="font-bold text-[#321E1E]">{data.name}</p>
        <p className="font-semibold text-sm mt-0.5" style={{ color: data.color }}>
          ₹{data.value.toLocaleString('en-IN')}{' '}
          <span className="text-xs font-normal text-[#4E3636]">({data.percentage})</span>
        </p>
      </div>
    );
  }
  return null;
};

export const AdminReports = () => {
  const outletContext = useOutletContext();
  const selectedRange = outletContext?.selectedDateRange || 'Last 30 Days';
  const rangeData = getDashboardDataByRange(selectedRange);
  const kpis = rangeData.kpis.slice(0, 3);
  const chartData = rangeData.revenueData.map((d) => ({
    ...d,
    date: d.day,
  }));
  const categoryData = rangeData.categoryData;
  const totalCategorySales = categoryData.reduce((acc, c) => acc + c.value, 0);
  const formattedCategoryTotal =
    totalCategorySales >= 100000
      ? `₹${(totalCategorySales / 100000).toFixed(1)}L`
      : `₹${(totalCategorySales / 1000).toFixed(1)}k`;

  const [pdfGenerating, setPdfGenerating] = useState(false);

  const handleExportPDF = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      setPdfGenerating(false);
      window.print();
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Title "Analytics & Reports" & Date Range Picker & "Export PDF" button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#321E1E]">
            Analytics &amp; Reports
          </h2>
          <p className="text-xs text-[#4E3636] mt-0.5">
            Deep sales performance analytics, category share, and top item profitability
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#4E3636]/20 text-xs font-semibold text-[#321E1E] shadow-xs">
            <Calendar className="w-4 h-4 text-[#4E3636]" />
            <span>{selectedRange}</span>
          </div>

          {/* Primary button: #116D6E background, white text */}
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] active:scale-95 text-white text-xs font-bold shadow-teal transition-all cursor-pointer select-none"
          >
            <Download className="w-4 h-4" />
            <span>{pdfGenerating ? 'Generating...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* KPI Row: 3 cards (Total Revenue, Total Orders, Avg Order Value) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-5 shadow-soft border border-[#4E3636]/10 flex flex-col justify-between"
          >
            <span className="text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
              {kpi.label}
            </span>
            {/* Large bold #321E1E numbers */}
            <div className="text-3xl font-extrabold text-[#321E1E] tracking-tight my-2">
              {kpi.value}
            </div>
            <div className="flex items-center gap-2 text-xs pt-1 border-t border-[#4E3636]/10">
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#116D6E] bg-[#116D6E]/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{kpi.trend}</span>
              </span>
              <span className="text-[#4E3636]/80">{kpi.comparison}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section: Left (Revenue Trend) and Right (Category Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (Revenue Trend): Area Chart showing revenue over time */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-soft border border-[#4E3636]/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                Revenue Trend &bull; {selectedRange}
              </h3>
              <p className="text-xs text-[#4E3636]">
                Aggregate sales flow and volume progression
              </p>
            </div>
            <span className="text-xs font-semibold text-[#116D6E] bg-[#116D6E]/10 px-2.5 py-1 rounded-lg">
              Live Synced
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  {/* Soft teal gradient fill */}
                  <linearGradient id="reportsTealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#116D6E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#116D6E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                {/* Grid lines faint #4E3636 */}
                <CartesianGrid
                  stroke="#4E3636"
                  strokeOpacity={0.08}
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  stroke="#4E3636"
                  strokeOpacity={0.6}
                  tickLine={false}
                  axisLine={{ stroke: '#4E3636', strokeOpacity: 0.15 }}
                  tick={{ fontSize: 11, fill: '#4E3636' }}
                  dy={5}
                />
                <YAxis
                  stroke="#4E3636"
                  strokeOpacity={0.6}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#4E3636' }}
                  tickFormatter={(val) => {
                    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                    if (val >= 1000) return `₹${Math.round(val / 1000)}k`;
                    return `₹${val}`;
                  }}
                />

                <Tooltip content={<CustomAreaTooltip />} />

                {/* Primary Line: #116D6E with soft teal gradient fill */}
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#116D6E"
                  strokeWidth={3}
                  fill="url(#reportsTealGrad)"
                  activeDot={{ r: 6, fill: '#116D6E', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (Category Breakdown): Donut Chart showing sales by category (Cakes, Bread, Pastries) */}
        <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-soft border border-[#4E3636]/10 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#321E1E]">
              Category Breakdown
            </h3>
            <p className="text-xs text-[#4E3636]">
              Net share &bull; {selectedRange}
            </p>
          </div>

          <div className="relative h-52 w-full my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomDonutTooltip />} />
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                >
                  {/* Use #116D6E (Cakes), #CD1818 (Pastries), #4E3636 (Bread) */}
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute text-center pointer-events-none">
              <span className="text-[10px] text-[#4E3636] font-semibold uppercase tracking-wider">
                Total
              </span>
              <div className="text-lg font-extrabold text-[#321E1E]">
                {formattedCategoryTotal}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#4E3636]/10">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-[#321E1E]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#4E3636]">₹{(item.value / 1000).toFixed(1)}k</span>
                  <span className="font-bold" style={{ color: item.color }}>{item.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Products List: Table below charts showing Top 5 products, quantity sold, total revenue */}
      <div className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 overflow-hidden">
        <div className="p-5 pb-3 border-b border-[#4E3636]/10 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#321E1E]">
              Top 5 Selling Delicacies
            </h3>
            <p className="text-xs text-[#4E3636]">
              Highest grossing products across all bakery registers
            </p>
          </div>
          <span className="text-xs text-[#116D6E] font-semibold flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>Best Seller Leaderboard</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7]/60">
                <th className="py-3 px-5 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Rank
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Product
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Quantity Sold
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#4E3636] uppercase tracking-wider text-right">
                  Total Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4E3636]/10 text-xs">
              {REPORTS_DATA.topSellingProducts.map((prod) => (
                <tr key={prod.rank} className="hover:bg-[#FDFBF7]/70 transition-colors">
                  <td className="py-3 px-5">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                      prod.rank === 1
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : prod.rank === 2
                        ? 'bg-slate-100 text-slate-800'
                        : 'bg-[#FDFBF7] text-[#4E3636]'
                    }`}>
                      #{prod.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-9 h-9 rounded-lg object-cover border border-[#4E3636]/15 bg-white" />
                      <span className="font-bold text-[#321E1E]">{prod.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#4E3636] font-medium">
                    {prod.category}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#321E1E]">
                    {prod.qtySold.toLocaleString('en-IN')} pcs
                  </td>
                  <td className="py-3 px-5 text-right font-extrabold text-[#116D6E] text-sm">
                    {prod.revenue}
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
