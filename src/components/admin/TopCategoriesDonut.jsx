import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { CATEGORY_DONUT_DATA } from '../../data/adminMockData';

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

export const TopCategoriesDonut = ({ data, timeframe = 'This Week' }) => {
  const chartData = data && data.length > 0 ? data : CATEGORY_DONUT_DATA;
  const totalCategorySales = chartData.reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  const formattedTotal =
    totalCategorySales >= 100000
      ? `₹${(totalCategorySales / 100000).toFixed(1)}L`
      : `₹${(totalCategorySales / 1000).toFixed(1)}k`;

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-[#4E3636]/10 flex flex-col justify-between">
      {/* Header */}
      <div>
        <h2 className="font-serif text-lg font-bold text-[#321E1E]">
          Top Categories
        </h2>
        <p className="text-xs text-[#4E3636] mt-0.5">
          Sales volume distribution &bull; <span className="font-semibold text-[#116D6E]">{timeframe}</span>
        </p>
      </div>

      {/* Donut Chart with Center Summary */}
      <div className="relative h-52 w-full my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomDonutTooltip />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="#FFFFFF"
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text inside Donut */}
        <div className="absolute text-center pointer-events-none">
          <div className="text-[11px] font-semibold text-[#4E3636] uppercase tracking-wider">
            Total
          </div>
          <div className="text-lg font-extrabold text-[#321E1E]">
            {formattedTotal}
          </div>
        </div>
      </div>

      {/* Category Legend & Breakdown List */}
      <div className="space-y-2 pt-2 border-t border-[#4E3636]/10">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-xs py-0.5"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-semibold text-[#321E1E]">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#4E3636] font-medium">
                ₹{item.value.toLocaleString('en-IN')}
              </span>
              <span
                className="text-[11px] font-bold px-1.5 py-0.2 rounded-md"
                style={{
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                }}
              >
                {item.percentage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategoriesDonut;
