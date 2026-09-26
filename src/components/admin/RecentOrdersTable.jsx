import React from 'react';
import { RECENT_ORDERS_DATA } from '../../data/adminMockData';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

export const RecentOrdersTable = () => {
  return (
    <div className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 overflow-hidden flex flex-col justify-between">
      {/* Table Header Section */}
      <div className="p-5 pb-3 border-b border-[#4E3636]/10 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#321E1E]">
            Recent Transactions
          </h2>
          <p className="text-xs text-[#4E3636] mt-0.5">
            Latest store POS orders, invoices, and fulfillment statuses
          </p>
        </div>
        <button className="text-xs font-semibold text-[#116D6E] hover:text-[#0e5859] flex items-center gap-1 transition-colors cursor-pointer">
          <span>View All Orders</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7]/60">
              <th className="py-3 px-5 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                Order ID
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                Customer
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                Date &amp; Time
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-[#4E3636] uppercase tracking-wider text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4E3636]/10 text-xs">
            {RECENT_ORDERS_DATA.map((order) => {
              // Status Badge Mapping:
              // Completed: Teal background #116D6E with 10% opacity, #116D6E text
              // Pending: Warm Brown background #4E3636 with 10% opacity, #4E3636 text
              // Cancelled: Crimson background #CD1818 with 10% opacity, #CD1818 text
              const getBadgeClasses = (status) => {
                switch (status) {
                  case 'Completed':
                    return 'bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20';
                  case 'Pending':
                    return 'bg-[#4E3636]/10 text-[#4E3636] border border-[#4E3636]/20';
                  case 'Cancelled':
                    return 'bg-[#CD1818]/10 text-[#CD1818] border border-[#CD1818]/20';
                  default:
                    return 'bg-[#4E3636]/10 text-[#4E3636]';
                }
              };

              return (
                <tr
                  key={order.id}
                  className="hover:bg-[#FDFBF7]/70 transition-colors group cursor-pointer"
                >
                  {/* Order ID */}
                  <td className="py-3 px-5 font-bold font-mono text-[#321E1E]">
                    {order.id}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4 text-[#321E1E]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={order.avatar}
                        alt={order.customer}
                        className="w-6 h-6 rounded-full object-cover border border-[#4E3636]/15"
                      />
                      <span className="font-semibold">{order.customer}</span>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3 px-4 text-[#321E1E]/85">
                    {order.date}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 font-bold text-[#321E1E]">
                    {order.amount}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-5 text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide select-none ${getBadgeClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Subtle Table Footer */}
      <div className="p-3 px-5 bg-[#FDFBF7]/40 border-t border-[#4E3636]/10 flex items-center justify-between text-xs text-[#4E3636]">
        <span>Showing 6 of 1,240 orders</span>
        <span className="font-medium text-[#116D6E]">Updated 2 mins ago</span>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
