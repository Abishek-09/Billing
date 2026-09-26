import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Coins,
  Store,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Flame,
  CheckCircle2,
  PackageCheck,
  ChefHat,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import {
  HOURLY_RUSH_DATA,
  LIVE_SHIFT_KPI_DATA,
  LIVE_QUEUE_ORDERS,
  LOW_STOCK_ALERTS
} from '../../data/adminMockData';

// Custom Tooltip for Hourly Rush Bar Chart
const HourlyRushTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-xl shadow-soft-lg border border-[#4E3636]/15 text-xs">
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className="font-bold text-[#321E1E]">{label}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#116D6E]/10 text-[#116D6E]">
            {data.peak}
          </span>
        </div>
        <p className="text-[#116D6E] font-extrabold text-sm">
          {data.orders} orders processed
        </p>
        <p className="text-[11px] text-[#4E3636] mt-0.5">
          ₹{data.sales.toLocaleString('en-IN')} in counter revenue
        </p>
      </div>
    );
  }
  return null;
};

export const AdminOverview = () => {
  const kpis = LIVE_SHIFT_KPI_DATA;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Operational Command Header & Quick Register Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#4E3636]/15 shadow-soft">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-serif text-2xl font-bold text-[#321E1E]">
              Shift Operations Command
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Live Counter Active
            </span>
          </div>
          <p className="text-xs text-[#4E3636] mt-1">
            Real-time bakery heartbeat, shift cash drawer, hourly rush pace, and kitchen queue
          </p>
        </div>

        {/* Quick Operations Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] active:scale-95 text-white text-xs font-bold shadow-teal transition-all cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>Open POS Terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#4E3636]/20 hover:border-[#116D6E] text-[#321E1E] text-xs font-semibold shadow-xs transition-all"
          >
            <Calendar className="w-4 h-4 text-[#116D6E]" />
            <span>Fulfillment Orders</span>
          </Link>
        </div>
      </div>

      {/* 2. Today's Shift Operational KPIs (4 Distinct Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Counter Sales */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              Today's Net Sales
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#116D6E]/10 flex items-center justify-center text-[#116D6E]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-[#321E1E] tracking-tight">
              {kpis.todaySales.value}
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {kpis.todaySales.comparison}
              </span>
              <span className="text-[11px] text-[#4E3636]">
                Target: {kpis.todaySales.target}
              </span>
            </div>
          </div>
          <div className="w-full bg-[#FDFBF7] rounded-full h-1.5 overflow-hidden border border-[#4E3636]/10">
            <div
              className="bg-[#116D6E] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(kpis.todaySales.progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Bills Settled Today */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              Bills Settled Today
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#CD1818]/10 flex items-center justify-center text-[#CD1818]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-[#321E1E] tracking-tight">
              {kpis.billsSettled.count}
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {kpis.billsSettled.comparison}
              </span>
              <span className="text-[11px] text-[#4E3636]">
                Avg: {kpis.billsSettled.avgTicket}/bill
              </span>
            </div>
          </div>
          <span className="text-[11px] text-[#4E3636] font-medium">
            Terminal POS-01 continuous register flow
          </span>
        </div>

        {/* Card 3: Advance Orders Due Today */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              Advance Pickups Due
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-amber-800 tracking-tight">
              {kpis.advanceDueToday.count} Orders
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <span className="font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                {kpis.advanceDueToday.statusAlert}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#4E3636] flex justify-between border-t border-[#4E3636]/10 pt-1.5">
            <span>Pending Balance:</span>
            <span className="font-bold text-[#CD1818]">{kpis.advanceDueToday.pendingBalance}</span>
          </div>
        </div>

        {/* Card 4: Cash Drawer Till Status */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              Till &amp; Cash Drawer
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#4E3636]/10 flex items-center justify-center text-[#4E3636]">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-[#321E1E] tracking-tight">
              {kpis.cashDrawer.inTill}
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                {kpis.cashDrawer.status}
              </span>
              <span className="text-[11px] text-[#4E3636]">
                Float: {kpis.cashDrawer.openingFloat}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#4E3636] flex justify-between border-t border-[#4E3636]/10 pt-1.5">
            <span>Digital Total:</span>
            <span className="font-bold text-[#116D6E]">{kpis.cashDrawer.digitalTotal}</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Today's Hourly Rush Heatmap & Kitchen Urgent Replenishment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Hourly Rush & Counter Load Pace (Bar Chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                  Today&rsquo;s Hourly Rush Pace (08:00 AM &ndash; 10:00 PM)
                </h3>
              </div>
              <p className="text-xs text-[#4E3636] mt-0.5">
                Counter transaction traffic helping kitchen staff time fresh bakery batches
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#116D6E]/10 text-[#116D6E] self-start sm:self-auto">
              Peak: 06:00 PM (44 Orders)
            </span>
          </div>

          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_RUSH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#4E3636" strokeOpacity={0.08} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="hour"
                  stroke="#4E3636"
                  strokeOpacity={0.6}
                  tickLine={false}
                  axisLine={{ stroke: '#4E3636', strokeOpacity: 0.15 }}
                  tick={{ fontSize: 11, fill: '#4E3636', fontWeight: 600 }}
                  dy={4}
                />
                <YAxis
                  stroke="#4E3636"
                  strokeOpacity={0.6}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#4E3636' }}
                />
                <Tooltip content={<HourlyRushTooltip />} />
                <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
                  {HOURLY_RUSH_DATA.map((entry, index) => {
                    const isPeak = entry.orders >= 35;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isPeak ? '#116D6E' : '#116D6E'}
                        fillOpacity={isPeak ? 1 : 0.65}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-[#4E3636]/10 flex flex-wrap items-center justify-between text-xs text-[#4E3636] gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#116D6E]" />
              <span>Dark Bars: High Volume Rush Windows (Fresh bake batches required)</span>
            </span>
            <span className="font-semibold text-[#116D6E]">
              Total Volume: 206 Orders Today
            </span>
          </div>
        </div>

        {/* Right: Kitchen Urgent Stock & Prep Alerts */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-[#CD1818]" />
                <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                  Kitchen Prep &amp; Stock Alerts
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#CD1818]/10 text-[#CD1818]">
                {LOW_STOCK_ALERTS.length} Alerts
              </span>
            </div>
            <p className="text-xs text-[#4E3636] mb-4">
              Items approaching threshold requiring kitchen preparation
            </p>

            <div className="space-y-2.5">
              {LOW_STOCK_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="p-2.5 rounded-xl bg-[#FDFBF7] border border-[#4E3636]/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={alert.image}
                      alt={alert.name}
                      className="w-9 h-9 rounded-lg object-cover border border-[#4E3636]/15 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-[#321E1E] block truncate">
                        {alert.name}
                      </span>
                      <span className="text-[10px] text-[#4E3636] block">
                        Category: {alert.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#CD1818]/10 text-[#CD1818] block">
                      {alert.stockLeft} {alert.unit} left
                    </span>
                    <span className="text-[9px] text-[#4E3636] block mt-0.5">
                      Min: {alert.minThreshold}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/admin/inventory"
            className="mt-4 w-full py-2.5 px-3 rounded-xl border border-[#4E3636]/20 hover:border-[#116D6E] text-[#116D6E] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors bg-[#FDFBF7]"
          >
            <span>Manage Inventory &amp; Restock</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Bottom Section: Live Active Orders & Fulfillment Queue */}
      <div className="bg-white rounded-2xl border border-[#4E3636]/15 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-[#4E3636]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#116D6E]" />
              <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                Live Counter &amp; Fulfillment Queue
              </h3>
            </div>
            <p className="text-xs text-[#4E3636] mt-0.5">
              Live orders being prepped, packaged, or awaiting customer counter pickup
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#116D6E] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Store Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7]/70 text-[#4E3636]">
                <th className="py-3 px-5 font-bold uppercase tracking-wider">Order ID</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Customer &amp; Contact</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Order Type</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Items Summary</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Due / Pickup Time</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Bill &amp; Balance</th>
                <th className="py-3 px-5 font-bold uppercase tracking-wider text-right">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4E3636]/10">
              {LIVE_QUEUE_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-[#FDFBF7]/60 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-[#116D6E]">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#321E1E] block">{order.customer}</span>
                    <span className="text-[10px] text-[#4E3636] block">{order.phone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      order.type === 'Advance Order'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : order.type === 'Dine-in'
                        ? 'bg-purple-50 text-purple-800 border border-purple-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#321E1E] max-w-[240px] truncate">
                    {order.items}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#4E3636]">
                    {order.dueTime}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#321E1E] block">₹{order.amount}</span>
                    {order.balanceDue > 0 ? (
                      <span className="text-[10px] font-bold text-[#CD1818] block">
                        Due: ₹{order.balanceDue}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Fully Paid
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      order.statusColor === 'emerald'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.statusColor === 'amber'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-[#116D6E]/10 text-[#116D6E]'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{order.status}</span>
                    </span>
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

export default AdminOverview;
