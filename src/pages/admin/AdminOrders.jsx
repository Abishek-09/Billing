import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Download,
  Calendar,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ALL_ORDERS_DATA, getOrdersByRange } from '../../data/adminMockData';

export const AdminOrders = () => {
  const outletContext = useOutletContext();
  const selectedDateRange = outletContext?.selectedDateRange || 'This Week';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [exportNotice, setExportNotice] = useState(false);
  const itemsPerPage = 6;

  // Filter tabs
  const FILTER_TABS = ['All', 'Pending', 'Completed', 'Cancelled'];
  const CATEGORY_TABS = ['All', 'Takeaway', 'Dine In', 'Order'];

  // Base range orders
  const rangeOrders = useMemo(() => {
    return getOrdersByRange(selectedDateRange);
  }, [selectedDateRange]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return rangeOrders.filter((order) => {
      const matchesStatus =
        statusFilter === 'All' || order.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'All' || order.category === categoryFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [rangeOrders, searchQuery, statusFilter, categoryFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2500);

    // Generate CSV content
    const headers = 'Order ID,Customer,Date & Time,Items,Total Amount,Status\n';
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.id}","${o.customer}","${o.date}","${o.items}","${o.amount}","${o.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SweetBite_Orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
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
    <div className="space-y-5">
      {/* Top Toolbar: Search bar on left, Date Picker & Export CSV on right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#4E3636] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Order ID (e.g. ORD-8942) or Customer..."
            className="w-full bg-white text-[#321E1E] text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#4E3636]/20 placeholder-[#4E3636]/50 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 shadow-xs"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#4E3636]/20 text-xs font-semibold text-[#321E1E] shadow-xs">
            <Calendar className="w-4 h-4 text-[#4E3636]" />
            <span>{selectedDateRange} &bull; {rangeOrders.length} orders</span>
          </div>

          {/* Export CSV button: Outline style: #116D6E border and text */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-[#116D6E] text-[#116D6E] hover:bg-[#116D6E] hover:text-white transition-all shadow-xs cursor-pointer select-none"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Export notification toast */}
      {exportNotice && (
        <div className="p-3 bg-[#116D6E]/10 border border-[#116D6E]/20 text-[#116D6E] rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Orders CSV exported successfully with {filteredOrders.length} records!</span>
          </div>
        </div>
      )}

      {/* Filter Tabs: Status on left, Category on right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {FILTER_TABS.map((tab) => {
            const isActive = statusFilter === tab;
            const count =
              tab === 'All'
                ? rangeOrders.length
                : rangeOrders.filter((o) => o.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => {
                  setStatusFilter(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#116D6E] text-white shadow-teal'
                    : 'bg-white text-[#321E1E] border border-[#4E3636]/15 hover:border-[#116D6E]/40'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FDFBF7] text-[#4E3636]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Tabs: All, Takeaway, Dine In, Order */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#4E3636]/15 shadow-xs shrink-0">
          <span className="text-[11px] font-bold text-[#4E3636] px-2">Category:</span>
          {CATEGORY_TABS.map((cat) => {
            const isActive = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#116D6E] text-white shadow-xs'
                    : 'text-[#4E3636] hover:text-[#321E1E] hover:bg-[#FDFBF7]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Table: White background, rounded-xl, soft shadow */}
      <div className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 overflow-hidden">
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
                  Category
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Date &amp; Time
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Items
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#4E3636] uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4E3636]/10 text-xs">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FDFBF7]/70 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="py-3.5 px-5 font-bold font-mono text-[#321E1E]">
                      {order.id}
                    </td>

                    {/* Customer Name */}
                    <td className="py-3.5 px-4 text-[#321E1E]">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={order.avatar}
                          alt={order.customer}
                          className="w-7 h-7 rounded-full object-cover border border-[#4E3636]/15"
                        />
                        <span className="font-semibold">{order.customer}</span>
                      </div>
                    </td>

                    {/* Order Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          order.category === 'Dine In'
                            ? 'bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20'
                            : order.category === 'Order'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-[#4E3636]/10 text-[#4E3636] border border-[#4E3636]/20'
                        }`}
                      >
                        {order.category || 'Takeaway'}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4 text-[#321E1E]/80">
                      {order.date}
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4 text-[#4E3636] font-medium">
                      {order.items}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-bold text-[#321E1E]">
                      {order.amount}
                    </td>

                    {/* Status Badges */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Action Column: "View" button (Text #116D6E, hover underline) and a "Print" icon */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="text-[#116D6E] hover:underline font-semibold text-xs cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="p-1 rounded text-[#4E3636]/70 hover:text-[#321E1E] hover:bg-[#FDFBF7] transition-colors cursor-pointer"
                          title="Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#4E3636]/60">
                    No orders found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination: Bottom right, simple previous/next buttons with page numbers */}
        <div className="p-4 px-5 bg-[#FDFBF7]/40 border-t border-[#4E3636]/10 flex items-center justify-between text-xs text-[#4E3636]">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{' '}
            {filteredOrders.length} orders
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-[#4E3636]/20 bg-white text-[#321E1E] hover:bg-[#FDFBF7] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#116D6E] text-white'
                    : 'bg-white border border-[#4E3636]/20 text-[#321E1E] hover:bg-[#FDFBF7]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-[#4E3636]/20 bg-white text-[#321E1E] hover:bg-[#FDFBF7] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#116D6E] p-4 px-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base">
                  Order Details &bull; {selectedOrder.id}
                </h3>
                <p className="text-xs text-white/80">{selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#4E3636]/10">
                <div>
                  <span className="text-[#4E3636]">Customer &amp; Category:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="font-bold text-[#321E1E] text-sm">{selectedOrder.customer}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#116D6E]/10 text-[#116D6E]">
                      {selectedOrder.category || 'Takeaway'}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div>
                <span className="font-semibold text-[#4E3636] uppercase tracking-wider text-[11px]">
                  Ordered Items ({selectedOrder.items})
                </span>
                <ul className="mt-2 space-y-1.5">
                  {selectedOrder.itemsList?.map((item, idx) => (
                    <li key={idx} className="p-2 bg-[#FDFBF7] rounded-lg border border-[#4E3636]/10 flex items-center justify-between text-[#321E1E]">
                      <span>{item}</span>
                      <span className="font-semibold text-[#116D6E]">Confirmed</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[#4E3636]/10 flex items-baseline justify-between">
                <span className="font-bold text-[#321E1E]">Gross Total:</span>
                <span className="text-xl font-extrabold text-[#CD1818]">{selectedOrder.amount}</span>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 rounded-xl bg-white border border-[#321E1E] text-[#321E1E] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#FDFBF7]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2 rounded-xl bg-[#116D6E] text-white font-semibold hover:bg-[#0e5859]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
