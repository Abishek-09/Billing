import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { REVENUE_CHART_DATA } from '../../data/adminMockData';

const getTimeframeMeta = (tf) => {
  switch (tf) {
    case 'Today':
      return {
        currentLabel: 'Today',
        previousLabel: 'Yesterday',
        subtitle: 'Hourly sales velocity today vs yesterday benchmarks',
      };
    case 'Yesterday':
      return {
        currentLabel: 'Yesterday',
        previousLabel: 'Prior Day',
        subtitle: 'Hourly sales velocity yesterday vs day before',
      };
    case 'This Month':
      return {
        currentLabel: 'This Month',
        previousLabel: 'Last Month',
        subtitle: 'Weekly sales progression this month vs last month',
      };
    case 'Last 30 Days':
      return {
        currentLabel: 'Last 30 Days',
        previousLabel: 'Prior 30 Days',
        subtitle: 'Rolling 30-day revenue vs previous window',
      };
    case 'Year to Date':
      return {
        currentLabel: '2026 (YTD)',
        previousLabel: '2025',
        subtitle: 'Monthly revenue growth vs previous year benchmarks',
      };
    case 'This Week':
    default:
      return {
        currentLabel: 'Current Week',
        previousLabel: 'Previous Week',
        subtitle: 'Weekly sales flow vs prior period benchmarks',
      };
  }
};

const CustomTooltip = ({ active, payload, label, currentLabel, previousLabel }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-soft-lg border border-[#4E3636]/15 text-xs">
        <p className="font-bold text-[#321E1E] mb-1">{label} Summary</p>
        <div className="space-y-1">
          <p className="text-[#116D6E] font-semibold flex items-center justify-between gap-4">
            <span>{currentLabel}:</span>
            <span className="font-extrabold text-sm">₹{payload[0].value.toLocaleString('en-IN')}</span>
          </p>
          {payload[1] && (
            <p className="text-[#4E3636]/70 flex items-center justify-between gap-4 text-[11px]">
              <span>{previousLabel}:</span>
              <span>₹{payload[1].value.toLocaleString('en-IN')}</span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueChart = ({ data, timeframe = 'This Week' }) => {
  const chartData = data && data.length > 0 ? data : REVENUE_CHART_DATA;
  const meta = getTimeframeMeta(timeframe);

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-[#4E3636]/10 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#321E1E]">
            Revenue Performance
          </h2>
          <p className="text-xs text-[#4E3636] mt-0.5">
            {meta.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#116D6E] font-semibold bg-[#116D6E]/10 px-2.5 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#116D6E]" />
            <span>{meta.currentLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#4E3636]/70 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#4E3636]/30" />
            <span>{meta.previousLabel}</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              {/* Soft teal gradient fill below primary line */}
              <linearGradient id="tealAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#116D6E" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#116D6E" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Grid lines: very faint #4E3636 */}
            <CartesianGrid
              stroke="#4E3636"
              strokeOpacity={0.08}
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              stroke="#4E3636"
              strokeOpacity={0.6}
              tickLine={false}
              axisLine={{ stroke: '#4E3636', strokeOpacity: 0.15 }}
              tick={{ fontSize: 11, fill: '#4E3636', fontWeight: 500 }}
              dy={6}
            />
            <YAxis
              stroke="#4E3636"
              strokeOpacity={0.6}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#4E3636', fontWeight: 500 }}
              tickFormatter={(val) => {
                if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                if (val >= 1000) return `₹${Math.round(val / 1000)}k`;
                return `₹${val}`;
              }}
              dx={-4}
            />

            <Tooltip
              content={
                <CustomTooltip
                  currentLabel={meta.currentLabel}
                  previousLabel={meta.previousLabel}
                />
              }
            />

            {/* Baseline comparison area (dashed line) */}
            <Area
              type="monotone"
              dataKey="previousWeek"
              stroke="#4E3636"
              strokeOpacity={0.3}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="transparent"
            />

            {/* Primary line in #116D6E with soft teal gradient fill below */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#116D6E"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#tealAreaGradient)"
              activeDot={{
                r: 6,
                fill: '#116D6E',
                stroke: '#FFFFFF',
                strokeWidth: 2,
                boxShadow: '0 0 10px rgba(17, 109, 110, 0.5)',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
