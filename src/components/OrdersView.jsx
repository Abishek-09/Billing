import React, { useState, useMemo } from 'react';
import {
  Search,
  Printer,
  ShoppingBag,
  Utensils,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  User,
  CreditCard,
  X,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { ALL_ORDERS_DATA } from '../data/adminMockData';

export const OrdersView = ({
  orders: propOrders,
  onBackToBilling,
  onPrintReceipt,
  onCollectBalance,
}) => {
  // Local state initialized with propOrders or saved orders
  const [ordersList, setOrdersList] = useState(() => {
    if (propOrders && propOrders.length > 0) return propOrders;
    try {
      const saved = localStorage.getItem('sweetbite_pos_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [...ALL_ORDERS_DATA];
  });

  // Sync if propOrders changes
  React.useEffect(() => {
    if (propOrders && propOrders.length > 0) {
      setOrdersList(propOrders);
    }
  }, [propOrders]);

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [collectOrder, setCollectOrder] = useState(null);
  const [collectMethod, setCollectMethod] = useState('Cash');

  const FILTER_TABS = [
    { id: 'All', label: 'All Orders' },
    { id: 'Order', label: 'Pre-Orders' },
    { id: 'Takeaway', label: 'Takeaway' },
    { id: 'Dine-in', label: 'Dine-in' },
    { id: 'Pending', label: 'Pending Balance' },
  ];

  // Filtered orders calculation
  const filteredOrders = useMemo(() => {
    return ordersList.filter((ord) => {
      // 1. Tab filter
      let matchesTab = true;
      if (activeTab === 'Order') {
        matchesTab = ord.type === 'Order';
      } else if (activeTab === 'Takeaway') {
        matchesTab = ord.type === 'Takeaway';
      } else if (activeTab === 'Dine-in') {
        matchesTab = ord.type === 'Dine-in';
      } else if (activeTab === 'Pending') {
        matchesTab = ord.pendingAmount > 0 || ord.status === 'Pending Payment';
      }

      // 2. Search query filter (Order ID, Bill #, Customer Name, Mobile Number)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        (ord.id && ord.id.toLowerCase().includes(q)) ||
        (ord.billNumber && ord.billNumber.toLowerCase().includes(q)) ||
        (ord.customer && ord.customer.toLowerCase().includes(q)) ||
        (ord.customerPhone && ord.customerPhone.toLowerCase().includes(q)) ||
        (ord.type && ord.type.toLowerCase().includes(q));

      return matchesTab && matchesSearch;
    });
  }, [ordersList, activeTab, searchQuery]);

  // Tab count helper
  const getTabCount = (tabId) => {
    if (tabId === 'All') return ordersList.length;
    if (tabId === 'Order') return ordersList.filter((o) => o.type === 'Order').length;
    if (tabId === 'Takeaway') return ordersList.filter((o) => o.type === 'Takeaway').length;
    if (tabId === 'Dine-in') return ordersList.filter((o) => o.type === 'Dine-in').length;
    if (tabId === 'Pending') {
      return ordersList.filter((o) => o.pendingAmount > 0 || o.status === 'Pending Payment').length;
    }
    return 0;
  };

  // KPIs
  const totalRevenueToday = useMemo(() => {
    return ordersList.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [ordersList]);

  const pendingCount = useMemo(() => {
    return ordersList.filter((o) => o.pendingAmount > 0 || o.status === 'Pending Payment').length;
  }, [ordersList]);

  const preOrdersCount = useMemo(() => {
    return ordersList.filter((o) => o.type === 'Order').length;
  }, [ordersList]);

  const handleConfirmCollect = (method) => {
    if (!collectOrder) return;
    if (onCollectBalance) {
      onCollectBalance(collectOrder.id || collectOrder.billNumber, method);
    } else {
      // Local fallback
      setOrdersList((prev) =>
        prev.map((ord) => {
          if (ord.id === collectOrder.id || ord.billNumber === collectOrder.billNumber) {
            return {
              ...ord,
              advancePaid: ord.totalAmount,
              pendingAmount: 0,
              status: 'Completed',
              paymentMethod: `${ord.paymentMethod} + ${method}`,
            };
          }
          return ord;
        })
      );
    }
    setCollectOrder(null);
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#FDFBF7]">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#321E1E]">
              Orders Management &amp; Live Queue
            </h2>
          </div>
          <p className="text-xs text-[#4E3636] mt-1">
            Real-time bakery orders, customer contact info, advance balances, and instant receipt reprints
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToBilling}
            className="px-4 py-2.5 bg-[#116D6E] hover:bg-[#0e5859] text-white rounded-xl text-xs font-bold transition-all shadow-teal flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Bill</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4E3636]">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#116D6E]/10 flex items-center justify-center text-[#116D6E]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#321E1E] mt-2">{ordersList.length}</div>
          <span className="text-[10px] font-medium text-emerald-700 mt-0.5 block">POS &amp; Pre-Orders</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4E3636]">Pre-Orders Booked</span>
            <div className="w-8 h-8 rounded-lg bg-[#4E3636]/10 flex items-center justify-center text-[#4E3636]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#116D6E] mt-2">{preOrdersCount}</div>
          <span className="text-[10px] font-medium text-[#4E3636] mt-0.5 block">Advance Payment Orders</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4E3636]">Pending Balances</span>
            <div className="w-8 h-8 rounded-lg bg-[#CD1818]/10 flex items-center justify-center text-[#CD1818]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#CD1818] mt-2">{pendingCount}</div>
          <span className="text-[10px] font-medium text-[#CD1818] mt-0.5 block">Awaiting Pickup Settle</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4E3636]">Total Volume</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#321E1E] mt-2">
            ₹{totalRevenueToday.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] font-medium text-emerald-700 mt-0.5 block">Active Session Sales</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#4E3636]/15 shadow-soft mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tab Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = getTabCount(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#116D6E] text-white shadow-teal'
                      : 'bg-[#FDFBF7] text-[#321E1E] border border-[#4E3636]/15 hover:border-[#116D6E]/40'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-[#4E3636]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#4E3636]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Bill #, Customer or Mobile..."
              className="w-full bg-[#FDFBF7] text-xs text-[#321E1E] font-medium pl-9 pr-8 py-2 rounded-xl border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 placeholder-[#4E3636]/40 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4E3636]/60 hover:text-[#321E1E]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Placed Orders Table */}
      <div className="bg-white rounded-2xl border border-[#4E3636]/15 shadow-soft overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-[#4E3636]/10 flex items-center justify-between bg-[#FDFBF7]/60">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#116D6E]" />
            <h3 className="font-serif font-bold text-sm text-[#321E1E]">
              Orders Ledger ({filteredOrders.length})
            </h3>
          </div>
          <span className="text-[11px] text-[#4E3636]">
            Showing real-time records including recent POS checkouts
          </span>
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-[#FDFBF7] shadow-xs">
              <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7] text-[#4E3636] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5 bg-[#FDFBF7]">Bill / Order ID</th>
                <th className="py-3.5 px-4 bg-[#FDFBF7]">Date &amp; Time</th>
                <th className="py-3.5 px-4 bg-[#FDFBF7]">Customer Details</th>
                <th className="py-3.5 px-4 bg-[#FDFBF7]">Type</th>
                <th className="py-3.5 px-4 bg-[#FDFBF7]">Items Summary</th>
                <th className="py-3.5 px-4 bg-[#FDFBF7]">Total Amount</th>
                <th className="py-3.5 px-4 bg-[#FDFBF7]">Advance Paid</th>
                <th className="py-3.5 px-4 bg-[#FDFBF7]">Pending Balance</th>
                <th className="py-3.5 px-4 bg-[#FDFBF7]">Status</th>
                <th className="py-3.5 px-5 text-right bg-[#FDFBF7]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4E3636]/10">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord, idx) => {
                  const isPreOrder = ord.type === 'Order';
                  const hasPending = (ord.pendingAmount || 0) > 0 || ord.status === 'Pending Payment';

                  return (
                    <tr
                      key={ord.id || ord.billNumber || idx}
                      className="hover:bg-[#FDFBF7]/80 transition-colors group"
                    >
                      {/* 1. Bill / Order ID */}
                      <td className="py-3.5 px-5 font-bold font-mono text-[#321E1E]">
                        <span className="px-2 py-0.5 rounded-md bg-[#116D6E]/10 text-[#116D6E] font-bold">
                          {ord.billNumber || ord.id}
                        </span>
                      </td>

                      {/* 2. Date & Time */}
                      <td className="py-3.5 px-4 text-[#4E3636] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#4E3636]/60 shrink-0" />
                          <span>{ord.date}</span>
                        </div>
                      </td>

                      {/* 3. Customer Name & Mobile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#116D6E]/10 border border-[#116D6E]/20 flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5 text-[#116D6E]" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#321E1E] leading-tight">
                              {ord.customer || 'Walk-in Customer'}
                            </div>
                            {ord.customerPhone ? (
                              <div className="text-[10px] text-[#4E3636]/80 font-mono flex items-center gap-1 mt-0.5">
                                <Phone className="w-2.5 h-2.5 text-[#116D6E]" />
                                <span>{ord.customerPhone}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-[#4E3636]/40 italic">No phone recorded</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 4. Type Badge */}
                      <td className="py-3.5 px-4">
                        {ord.type === 'Takeaway' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20">
                            <ShoppingBag className="w-3 h-3 text-[#116D6E]" />
                            <span>Takeaway</span>
                          </span>
                        )}
                        {ord.type === 'Dine-in' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300/60">
                            <Utensils className="w-3 h-3 text-amber-700" />
                            <span>Dine-in</span>
                          </span>
                        )}
                        {ord.type === 'Order' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#4E3636]/10 text-[#4E3636] border border-[#4E3636]/20">
                            <Calendar className="w-3 h-3 text-[#4E3636]" />
                            <span>Pre-Order</span>
                          </span>
                        )}
                      </td>

                      {/* 5. Items Summary */}
                      <td className="py-3.5 px-4 text-[#321E1E]">
                        <div className="max-w-[180px]">
                          <span className="font-semibold text-xs block text-[#321E1E]">
                            {ord.items || `${ord.itemsList?.length || 1} items`}
                          </span>
                          <span className="text-[10px] text-[#4E3636] line-clamp-1 block">
                            {ord.itemsList ? ord.itemsList.join(', ') : 'Bakery Delicacies'}
                          </span>
                        </div>
                      </td>

                      {/* 6. Total Amount */}
                      <td className="py-3.5 px-4 font-bold text-[#321E1E]">
                        ₹{ord.totalAmount?.toLocaleString('en-IN')}
                      </td>

                      {/* 7. Advance Paid */}
                      <td className="py-3.5 px-4 text-[#116D6E] font-medium">
                        {ord.advancePaid === '-' ? '-' : `₹${Number(ord.advancePaid).toLocaleString('en-IN')}`}
                      </td>

                      {/* 8. Pending Balance */}
                      <td className="py-3.5 px-4 font-bold">
                        {hasPending ? (
                          <span className="text-[#CD1818]">
                            ₹{Number(ord.pendingAmount).toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">Settled</span>
                        )}
                      </td>

                      {/* 9. Status */}
                      <td className="py-3.5 px-4">
                        {hasPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#CD1818]/10 text-[#CD1818] border border-[#CD1818]/20">
                            <AlertCircle className="w-3 h-3 text-[#CD1818]" />
                            <span>Pending Payment</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Completed</span>
                          </span>
                        )}
                      </td>

                      {/* 10. Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print Receipt Button */}
                          <button
                            onClick={() => onPrintReceipt && onPrintReceipt(ord)}
                            title="Print Thermal Receipt"
                            className="p-1.5 text-[#116D6E] hover:bg-[#116D6E]/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Collect Balance Button if Pending */}
                          {hasPending && (
                            <button
                              onClick={() => setCollectOrder(ord)}
                              className="px-2 py-1 bg-[#CD1818] hover:bg-[#b01414] text-white rounded-lg text-[10px] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <CreditCard className="w-3 h-3" />
                              <span>Settle</span>
                            </button>
                          )}

                          {/* View Detail Modal */}
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            title="View Order Details"
                            className="p-1.5 text-[#4E3636] hover:bg-[#4E3636]/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#4E3636]">
                    <ShoppingBag className="w-8 h-8 text-[#4E3636]/40 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-[#321E1E]">No orders found</p>
                    <p className="text-xs text-[#4E3636]/70 mt-1">
                      No records matching your search or &quot;{activeTab}&quot; filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kitchen Queue Status Columns */}
      <div className="mb-6">
        <h3 className="font-serif font-bold text-lg text-[#321E1E] mb-3">
          Active Kitchen &amp; Preparation Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: 'In Oven / Prep Queue',
              count: ordersList.filter((o) => o.kitchenStatus === 'In Oven / Prep').length || 2,
              color: 'border-amber-400',
              badgeColor: 'bg-amber-100 text-amber-800',
              items: ordersList.slice(0, 2).map((o) => `${o.billNumber || o.id} • ${o.customer} (${o.items || '2 items'})`),
            },
            {
              title: 'Ready for Packing / Dispatch',
              count: ordersList.filter((o) => o.kitchenStatus === 'Ready for Packing').length || 3,
              color: 'border-blue-400',
              badgeColor: 'bg-blue-100 text-blue-800',
              items: ordersList.slice(2, 4).map((o) => `${o.billNumber || o.id} • ${o.customer}`),
            },
            {
              title: 'Delivered / Completed Today',
              count: ordersList.filter((o) => o.status === 'Completed').length,
              color: 'border-emerald-400',
              badgeColor: 'bg-emerald-100 text-emerald-800',
              items: ordersList.filter((o) => o.status === 'Completed').slice(0, 2).map((o) => `${o.billNumber || o.id} • ${o.customer} - ₹${o.totalAmount}`),
            },
          ].map((col, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-5 border-t-4 ${col.color} border border-[#4E3636]/15 shadow-soft`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm text-[#321E1E]">{col.title}</h4>
                <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${col.badgeColor}`}>
                  {col.count}
                </span>
              </div>
              <div className="space-y-2">
                {col.items.length > 0 ? (
                  col.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 text-xs"
                    >
                      <p className="font-semibold text-[#321E1E]">{item}</p>
                      <span className="text-[10px] text-[#4E3636] block mt-0.5">
                        SweetBite Terminal 01 &bull; Active
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#4E3636]/60 italic p-3 text-center">No queue items</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collect Balance Modal */}
      {collectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#CD1818] p-4 px-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-white" />
                <h3 className="font-serif font-bold text-base">Collect Pending Balance</h3>
              </div>
              <button
                onClick={() => setCollectOrder(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 space-y-2">
                <div className="flex justify-between text-[#4E3636]">
                  <span>Bill / Order:</span>
                  <span className="font-bold text-[#321E1E] font-mono">{collectOrder.billNumber || collectOrder.id}</span>
                </div>
                <div className="flex justify-between text-[#4E3636]">
                  <span>Customer:</span>
                  <span className="font-semibold text-[#321E1E]">{collectOrder.customer}</span>
                </div>
                {collectOrder.customerPhone && (
                  <div className="flex justify-between text-[#4E3636]">
                    <span>Mobile:</span>
                    <span className="font-medium text-[#321E1E] font-mono">{collectOrder.customerPhone}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#4E3636]">
                  <span>Total Amount:</span>
                  <span className="font-bold text-[#321E1E]">₹{collectOrder.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#4E3636]">
                  <span>Advance Already Paid:</span>
                  <span className="font-semibold text-[#116D6E]">
                    ₹{Number(collectOrder.advancePaid || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Amount Due */}
              <div className="p-4 bg-[#CD1818]/10 rounded-xl border border-[#CD1818]/20 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#CD1818] text-sm block">Amount to Settle Now</span>
                  <span className="text-[10px] text-[#4E3636]">Pickup balance collection</span>
                </div>
                <span className="text-2xl font-extrabold text-[#CD1818]">
                  ₹{Number(collectOrder.pendingAmount).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-[#4E3636] block mb-2">
                  Select Settlement Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'UPI / QR', 'Card'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleConfirmCollect(m)}
                      className="py-2.5 px-3 rounded-xl border border-[#116D6E] bg-[#116D6E]/10 hover:bg-[#116D6E] hover:text-white text-[#116D6E] font-bold text-xs text-center transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCollectOrder(null)}
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
                  Order Details &bull; {selectedOrder.billNumber || selectedOrder.id}
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
                    <p className="text-xs text-[#4E3636]/80 font-mono flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-[#116D6E]" />
                      <span>{selectedOrder.customerPhone}</span>
                    </p>
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
                  Ordered Items ({selectedOrder.items || 'Items'})
                </span>
                <ul className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.itemsList?.map((it, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#4E3636]/10 flex items-center justify-between text-[#321E1E]"
                    >
                      <span className="font-medium">{it}</span>
                      <span className="font-semibold text-[#116D6E]">Ready</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Financial Breakdown */}
              <div className="p-3.5 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 space-y-2">
                <div className="flex justify-between text-[#4E3636]">
                  <span>Total Bill Amount:</span>
                  <span className="font-bold text-[#321E1E]">₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#4E3636]">
                  <span>Advance Received:</span>
                  <span className="font-semibold text-[#116D6E]">
                    {selectedOrder.advancePaid === '-' ? '-' : `₹${Number(selectedOrder.advancePaid).toLocaleString('en-IN')}`}
                  </span>
                </div>
                {selectedOrder.pendingAmount > 0 && (
                  <div className="flex justify-between text-[#CD1818] font-bold pt-1 border-t border-[#4E3636]/10">
                    <span>Balance Due on Pickup:</span>
                    <span>₹{Number(selectedOrder.pendingAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#4E3636] text-[11px] pt-1 border-t border-[#4E3636]/10">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-[#321E1E]">{selectedOrder.paymentMethod || 'CASH'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onPrintReceipt) onPrintReceipt(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 py-2 bg-[#116D6E] text-white rounded-xl hover:bg-[#0e5859] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="py-2 px-4 bg-white text-[#4E3636] border border-[#4E3636]/20 rounded-xl hover:bg-[#FDFBF7] font-semibold transition-colors cursor-pointer text-xs"
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

export default OrdersView;
