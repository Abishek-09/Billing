import React, { useState, useMemo, useEffect } from 'react';
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
  AlertCircle,
  ShoppingBag,
  Utensils,
  CreditCard
} from 'lucide-react';
import { ALL_ORDERS_DATA, getOrdersByRange } from '../../data/adminMockData';

export const AdminOrders = () => {
  const outletContext = useOutletContext();
  const selectedDateRange = outletContext?.selectedDateRange || 'This Week';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [collectModalOrder, setCollectModalOrder] = useState(null);
  const [ordersOverride, setOrdersOverride] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [exportNotice, setExportNotice] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const handleStorage = () => setRefreshTrigger((prev) => prev + 1);
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Filter tabs: 'All', 'Takeaway', 'Dine-in', 'Orders', 'Pending Payments'
  const FILTER_TABS = ['All', 'Takeaway', 'Dine-in', 'Orders', 'Pending Payments'];

  // Base range orders
  const baseRangeOrders = useMemo(() => {
    return getOrdersByRange(selectedDateRange);
  }, [selectedDateRange, refreshTrigger]);

  // Apply overrides if any balance was collected in session
  const rangeOrders = useMemo(() => {
    return baseRangeOrders.map((order) => {
      if (ordersOverride[order.id]) {
        return { ...order, ...ordersOverride[order.id] };
      }
      return order;
    });
  }, [baseRangeOrders, ordersOverride]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return rangeOrders.filter((order) => {
      // 1. Tab Filter
      let matchesTab = true;
      if (activeTab === 'Takeaway') {
        matchesTab = order.type === 'Takeaway';
      } else if (activeTab === 'Dine-in') {
        matchesTab = order.type === 'Dine-in';
      } else if (activeTab === 'Orders') {
        matchesTab = order.type === 'Order';
      } else if (activeTab === 'Pending Payments') {
        matchesTab = order.pendingAmount > 0 || order.status === 'Pending Payment';
      }

      // 2. Search Query
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        (order.customerPhone && order.customerPhone.toLowerCase().includes(query)) ||
        (order.type && order.type.toLowerCase().includes(query));

      return matchesTab && matchesSearch;
    });
  }, [rangeOrders, searchQuery, activeTab]);

  // Tab Count Helper
  const getTabCount = (tab) => {
    if (tab === 'All') return rangeOrders.length;
    if (tab === 'Takeaway') return rangeOrders.filter((o) => o.type === 'Takeaway').length;
    if (tab === 'Dine-in') return rangeOrders.filter((o) => o.type === 'Dine-in').length;
    if (tab === 'Orders') return rangeOrders.filter((o) => o.type === 'Order').length;
    if (tab === 'Pending Payments') {
      return rangeOrders.filter((o) => o.pendingAmount > 0 || o.status === 'Pending Payment').length;
    }
    return 0;
  };

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
    const headers = 'Order ID,Customer,Type,Date & Time,Items,Total Amount,Advance Paid,Pending Amount,Status\n';
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.id}","${o.customer}","${o.type}","${o.date}","${o.items}","₹${o.totalAmount}","${o.advancePaid}","₹${o.pendingAmount}","${o.status}"`
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

  // Settle / Collect Balance Handler
  const handleConfirmCollection = (method) => {
    if (!collectModalOrder) return;
    const settledAmount = collectModalOrder.pendingAmount;
    const orderId = collectModalOrder.id;

    // Update in-memory override
    const updatedProps = {
      advancePaid: collectModalOrder.totalAmount,
      pendingAmount: 0,
      status: 'Completed',
    };

    setOrdersOverride((prev) => ({
      ...prev,
      [orderId]: updatedProps,
    }));

    // Update global ALL_ORDERS_DATA reference
    const found = ALL_ORDERS_DATA.find((o) => o.id === orderId);
    if (found) {
      found.advancePaid = found.totalAmount;
      found.pendingAmount = 0;
      found.status = 'Completed';
    }

    setToastMessage(`Collected remaining balance of ₹${settledAmount.toLocaleString('en-IN')} for ${orderId} via ${method}. Order Completed!`);
    setCollectModalOrder(null);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Top Toolbar: Search bar on left, Date Range Indicator & Export CSV on right */}
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

      {/* Notifications / Toast alerts */}
      {toastMessage && (
        <div className="p-3 bg-[#116D6E]/10 border border-[#116D6E]/20 text-[#116D6E] rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#116D6E]" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage('')}
            className="text-xs font-bold text-[#116D6E] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {exportNotice && (
        <div className="p-3 bg-[#116D6E]/10 border border-[#116D6E]/20 text-[#116D6E] rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Orders CSV exported successfully with {filteredOrders.length} records!</span>
          </div>
        </div>
      )}

      {/* Filter Tabs: Pills for "All", "Takeaway", "Dine-in", "Orders", "Pending Payments" */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab;
          const count = getTabCount(tab);

          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
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
                  Customer Name
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Type
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Total Amount (₹)
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Advance Paid (₹)
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Pending Amount (₹)
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
                    {/* 1. Order ID */}
                    <td className="py-3.5 px-5 font-bold font-mono text-[#321E1E]">
                      {order.id}
                    </td>

                    {/* 2. Customer Name */}
                    <td className="py-3.5 px-4 text-[#321E1E]">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={order.avatar}
                          alt={order.customer}
                          className="w-7 h-7 rounded-full object-cover border border-[#4E3636]/15"
                        />
                        <div>
                          <span className="font-semibold block">{order.customer}</span>
                          {order.customerPhone && (
                            <span className="text-[10px] text-[#4E3636]/70 block font-mono">{order.customerPhone}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 3. Type (Takeaway, Dine-in, Order) - Elegant Badge */}
                    <td className="py-3.5 px-4">
                      {order.type === 'Takeaway' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20">
                          <ShoppingBag className="w-3 h-3 text-[#116D6E]" />
                          <span>Takeaway</span>
                        </span>
                      )}
                      {order.type === 'Dine-in' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300/60">
                          <Utensils className="w-3 h-3 text-amber-700" />
                          <span>Dine-in</span>
                        </span>
                      )}
                      {order.type === 'Order' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#4E3636]/10 text-[#4E3636] border border-[#4E3636]/20">
                          <Calendar className="w-3 h-3 text-[#4E3636]" />
                          <span>Order</span>
                        </span>
                      )}
                    </td>

                    {/* 4. Total Amount (₹) */}
                    <td className="py-3.5 px-4 font-bold text-[#321E1E]">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>

                    {/* 5. Advance Paid (₹) - Displays "-" for Takeaway/Dine-in */}
                    <td className="py-3.5 px-4 font-medium text-[#4E3636]">
                      {order.advancePaid === '-'
                        ? '—'
                        : `₹${Number(order.advancePaid).toLocaleString('en-IN')}`}
                    </td>

                    {/* 6. Pending Amount (₹) - If > 0, bold #CD1818. If 0, #4E3636 */}
                    <td className="py-3.5 px-4">
                      {order.pendingAmount > 0 ? (
                        <span className="font-extrabold text-[#CD1818]">
                          ₹{order.pendingAmount.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="font-medium text-[#4E3636]">
                          ₹0
                        </span>
                      )}
                    </td>

                    {/* 7. Status: "Completed" (Teal text), "Pending Payment" (Crimson text) */}
                    <td className="py-3.5 px-4">
                      {order.status === 'Completed' ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#CD1818]/10 text-[#CD1818] border border-[#CD1818]/20">
                          Pending Payment
                        </span>
                      )}
                    </td>

                    {/* 8. Action Column:
                        If Pending Amount > 0: Show "Collect Balance" button (Outline #CD1818, hover fill #CD1818)
                        If Pending Amount = 0: Show "Print Receipt" icon/button (Text #4E3636) */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {order.pendingAmount > 0 ? (
                          <button
                            type="button"
                            onClick={() => setCollectModalOrder(order)}
                            className="px-3 py-1 rounded-lg border border-[#CD1818] text-[#CD1818] hover:bg-[#CD1818] hover:text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Collect Balance</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg text-[#4E3636] hover:text-[#321E1E] hover:bg-[#FDFBF7] transition-colors cursor-pointer"
                            title="Print Receipt"
                          >
                            <Printer className="w-4 h-4 text-[#4E3636]" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-semibold text-[#116D6E] hover:underline cursor-pointer"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#4E3636]/60">
                    No orders found matching &quot;{activeTab}&quot; filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 px-5 bg-[#FDFBF7]/40 border-t border-[#4E3636]/10 flex items-center justify-between text-xs text-[#4E3636]">
          <div>
            Showing {filteredOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
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

      {/* Collect Balance Modal */}
      {collectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="bg-[#CD1818] p-4 px-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-white" />
                <h3 className="font-serif font-bold text-base">Collect Pending Balance</h3>
              </div>
              <button
                onClick={() => setCollectModalOrder(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Order Info Summary */}
              <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 space-y-2">
                <div className="flex items-center justify-between text-[#4E3636]">
                  <span>Order ID:</span>
                  <span className="font-bold text-[#321E1E] font-mono">{collectModalOrder.id}</span>
                </div>
                <div className="flex items-center justify-between text-[#4E3636]">
                  <span>Customer:</span>
                  <span className="font-semibold text-[#321E1E]">{collectModalOrder.customer}</span>
                </div>
                <div className="flex items-center justify-between text-[#4E3636]">
                  <span>Total Bill Amount:</span>
                  <span className="font-bold text-[#321E1E]">₹{collectModalOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-[#4E3636]">
                  <span>Advance Received:</span>
                  <span className="font-semibold text-[#116D6E]">
                    {collectModalOrder.advancePaid === '-' ? '₹0' : `₹${Number(collectModalOrder.advancePaid).toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              {/* Amount to collect */}
              <div className="p-4 bg-[#CD1818]/10 rounded-xl border border-[#CD1818]/20 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#CD1818] text-sm block">Balance Due to Settle</span>
                  <span className="text-[10px] text-[#4E3636]">Customer is picking up order</span>
                </div>
                <span className="text-2xl font-extrabold text-[#CD1818]">
                  ₹{collectModalOrder.pendingAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-[#4E3636] block mb-2">
                  Select Settlement Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'UPI / QR', 'Card'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => handleConfirmCollection(method)}
                      className="py-2.5 px-3 rounded-xl border border-[#116D6E] bg-[#116D6E]/10 hover:bg-[#116D6E] hover:text-white text-[#116D6E] font-bold text-xs text-center transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCollectModalOrder(null)}
                className="w-full py-2 bg-white text-[#4E3636] border border-[#4E3636]/20 rounded-xl hover:bg-[#FDFBF7] font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#4E3636]/10">
                <div>
                  <span className="text-[#4E3636]">Customer:</span>
                  <p className="font-bold text-[#321E1E] text-sm mt-0.5">{selectedOrder.customer}</p>
                  {selectedOrder.customerPhone && (
                    <p className="text-xs text-[#4E3636]/70 font-mono mt-0.5">{selectedOrder.customerPhone}</p>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedOrder.status === 'Completed'
                        ? 'bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20'
                        : 'bg-[#CD1818]/10 text-[#CD1818] border border-[#CD1818]/20'
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                  <div className="text-[10px] text-[#4E3636]">Type: {selectedOrder.type}</div>
                </div>
              </div>

              <div>
                <span className="font-semibold text-[#4E3636] uppercase tracking-wider text-[11px]">
                  Ordered Items ({selectedOrder.items})
                </span>
                <ul className="mt-2 space-y-1.5">
                  {selectedOrder.itemsList?.map((item, idx) => (
                    <li
                      key={idx}
                      className="p-2 bg-[#FDFBF7] rounded-lg border border-[#4E3636]/10 flex items-center justify-between text-[#321E1E]"
                    >
                      <span>{item}</span>
                      <span className="font-semibold text-[#116D6E]">Confirmed</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Financial Breakdown */}
              <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 space-y-2">
                <div className="flex items-center justify-between text-[#4E3636]">
                  <span>Total Amount:</span>
                  <span className="font-bold text-[#321E1E]">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-[#4E3636]">
                  <span>Advance Paid:</span>
                  <span className="font-medium text-[#116D6E]">
                    {selectedOrder.advancePaid === '-' ? '—' : `₹${Number(selectedOrder.advancePaid).toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#4E3636]/10">
                  <span className="font-bold text-[#321E1E]">Pending Balance:</span>
                  <span
                    className={`font-extrabold ${
                      selectedOrder.pendingAmount > 0 ? 'text-[#CD1818] text-sm' : 'text-[#4E3636]'
                    }`}
                  >
                    ₹{selectedOrder.pendingAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action buttons in modal */}
              <div className="pt-2 flex items-center gap-2">
                {selectedOrder.pendingAmount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const ord = selectedOrder;
                      setSelectedOrder(null);
                      setCollectModalOrder(ord);
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#CD1818] text-white font-bold flex items-center justify-center gap-1.5 hover:bg-[#b51414] transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Collect ₹{selectedOrder.pendingAmount.toLocaleString('en-IN')}</span>
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 rounded-xl bg-white border border-[#321E1E] text-[#321E1E] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#FDFBF7] cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2 rounded-xl bg-[#116D6E] text-white font-semibold hover:bg-[#0e5859] cursor-pointer"
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
