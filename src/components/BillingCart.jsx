import React, { useState, useRef, useEffect } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  Printer,
  ChevronDown,
  ShoppingBag,
  Utensils,
  Percent,
  Check,
  AlertCircle,
  CreditCard,
  User,
  Calendar,
  Sparkles,
  X
} from 'lucide-react';
import { CUSTOMERS } from '../data/mockData';

export const BillingCart = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  billNumber,
  selectedCustomer,
  onSelectCustomer,
  discountPercent,
  setDiscountPercent,
  onPayNow,
  onPrintBill,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [orderType, setOrderType] = useState('takeaway'); // 'takeaway' | 'dinein' | 'order'
  const [advancePayment, setAdvancePayment] = useState(0);
  const customerDropdownRef = useRef(null);

  // Close customer dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(e.target)
      ) {
        setCustomerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live Calculations
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = Math.round((subTotal * (discountPercent || 0)) / 100);
  const taxableAmount = Math.max(0, subTotal - discountAmount);
  const taxRate = 0.05; // 5%
  const taxAmount = Math.round(taxableAmount * taxRate);
  const totalAmount = taxableAmount + taxAmount;
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Order Type & Conditional Advance Payment calculations
  const pendingAmount =
    orderType === 'order' ? Math.max(0, totalAmount - (advancePayment || 0)) : 0;
  const amountToPayNow =
    orderType === 'order' ? (advancePayment || 0) : totalAmount;

  // Formatted Date & Time in #4E3636
  const formattedDateTime = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const handleClear = () => {
    if (cartItems.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    onClearCart();
    setShowClearConfirm(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#321E1E]/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-full sm:w-[380px] bg-white h-screen flex flex-col justify-between shrink-0 select-none shadow-[-6px_0_24px_rgba(50,30,30,0.05)] border-l border-[#4E3636]/10 z-50 transition-transform duration-300 ease-in-out fixed inset-y-0 right-0 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 flex' : 'translate-x-full hidden lg:flex'
        }`}
      >
        {/* 1. Header: "New Bill" (Serif font, #321E1E) & "Clear" button (Text #CD1818, trash icon) */}
        <div className="p-4 sm:p-5 pb-4 border-b border-[#4E3636]/10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg hover:bg-[#4E3636]/10 text-[#4E3636] transition-colors cursor-pointer mr-1"
                title="Close bill drawer"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-serif text-xl font-bold text-[#321E1E]">
                New Bill
              </h2>
              {totalItemsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#116D6E]/10 text-[#116D6E] text-xs font-bold">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleClear}
              disabled={cartItems.length === 0}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#CD1818] hover:text-[#b51414] transition-colors p-1.5 rounded-lg hover:bg-[#CD1818]/5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

        {/* Clear Confirmation Prompt */}
        {showClearConfirm && (
          <div className="mt-3 p-2.5 bg-[#CD1818]/10 rounded-xl border border-[#CD1818]/20 flex items-center justify-between animate-in fade-in">
            <span className="text-xs font-medium text-[#CD1818]">
              Empty current bill?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={confirmClear}
                className="px-2.5 py-1 bg-[#CD1818] text-white rounded text-[11px] font-bold"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2.5 py-1 bg-white text-[#321E1E] rounded text-[11px] font-medium border border-[#4E3636]/20"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 2. Customer Info: Dropdown for "Walk-in Customer", Bill No., and Date/Time in #4E3636 */}
        <div className="mt-4 pt-3 border-t border-[#4E3636]/10 space-y-2.5">
          {/* Customer Dropdown */}
          <div className="relative" ref={customerDropdownRef}>
            <button
              type="button"
              onClick={() => setCustomerDropdownOpen(!customerDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/15 hover:border-[#116D6E] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <User className="w-4 h-4 text-[#116D6E] shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-bold text-[#321E1E] truncate">
                    {selectedCustomer.name}
                  </div>
                  {selectedCustomer.phone !== '—' && (
                    <div className="text-[10px] text-[#4E3636]/70 truncate">
                      {selectedCustomer.phone}
                    </div>
                  )}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#4E3636] shrink-0" />
            </button>

            {customerDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-soft-lg border border-[#4E3636]/15 py-1 z-30 max-h-48 overflow-y-auto">
                {CUSTOMERS.map((cust) => (
                  <button
                    key={cust.id}
                    onClick={() => {
                      onSelectCustomer(cust);
                      setCustomerDropdownOpen(false);
                      if (cust.discountEligible && discountPercent === 0) {
                        setDiscountPercent(10);
                      }
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                      selectedCustomer.id === cust.id
                        ? 'bg-[#116D6E]/10 text-[#116D6E] font-semibold'
                        : 'text-[#321E1E] hover:bg-[#FDFBF7]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{cust.name}</div>
                      <div className="text-[10px] text-[#4E3636]/70">
                        {cust.phone} &bull; {cust.visits} visits
                      </div>
                    </div>
                    {selectedCustomer.id === cust.id && (
                      <Check className="w-3.5 h-3.5 text-[#116D6E]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bill No. and Date/Time in #4E3636 */}
          <div className="flex items-center justify-between text-xs text-[#4E3636] px-1 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-[#4E3636]/60">Bill No:</span>
              <span className="font-bold text-[#321E1E]">{billNumber}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#4E3636]">
              <Calendar className="w-3 h-3 text-[#4E3636]/70" />
              <span>{formattedDateTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 Order Type Selector (Above the itemized list) */}
      <div className="px-5 py-3 border-b border-[#4E3636]/10 bg-white shrink-0">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#4E3636] block mb-1.5">
          Order Type
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FDFBF7] rounded-lg border border-[#4E3636]/30">
          <button
            type="button"
            onClick={() => setOrderType('takeaway')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              orderType === 'takeaway'
                ? 'bg-[#116D6E] text-white shadow-xs'
                : 'bg-white text-[#321E1E] hover:bg-[#FDFBF7]'
            }`}
          >
            <ShoppingBag
              className={`w-3.5 h-3.5 ${
                orderType === 'takeaway' ? 'text-white' : 'text-[#321E1E]'
              }`}
            />
            <span>Takeaway</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderType('dinein')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              orderType === 'dinein'
                ? 'bg-[#116D6E] text-white shadow-xs'
                : 'bg-white text-[#321E1E] hover:bg-[#FDFBF7]'
            }`}
          >
            <Utensils
              className={`w-3.5 h-3.5 ${
                orderType === 'dinein' ? 'text-white' : 'text-[#321E1E]'
              }`}
            />
            <span>Dine-in</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderType('order')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              orderType === 'order'
                ? 'bg-[#116D6E] text-white shadow-xs'
                : 'bg-white text-[#321E1E] hover:bg-[#FDFBF7]'
            }`}
          >
            <Calendar
              className={`w-3.5 h-3.5 ${
                orderType === 'order' ? 'text-white' : 'text-[#321E1E]'
              }`}
            />
            <span>Order</span>
          </button>
        </div>
      </div>

      {/* 3. Itemized List */}
      <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-[#4E3636]/10">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between gap-3 group"
            >
              {/* Thumbnail */}
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80';
                }}
                className="w-11 h-11 rounded-lg object-cover border border-[#4E3636]/10 shrink-0 bg-[#FDFBF7]"
              />

              {/* Title & Subtext */}
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-xs font-bold text-[#321E1E] truncate" title={item.name}>
                  {item.name}
                </h4>
                <div className="text-[11px] text-[#4E3636] mt-0.5 flex items-center gap-1.5">
                  <span>₹{item.price} each</span>
                  <span className="text-[#4E3636]/40">&bull;</span>
                  <span className="font-semibold text-[#321E1E]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Minimalist Quantity selector with + and - buttons */}
              <div className="flex items-center gap-1.5 bg-[#FDFBF7] px-2 py-1 rounded-lg border border-[#4E3636]/15 shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-5 h-5 rounded flex items-center justify-center text-[#4E3636] hover:bg-white hover:text-[#321E1E] transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-[#321E1E] w-5 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-5 h-5 rounded flex items-center justify-center text-[#4E3636] hover:bg-white hover:text-[#321E1E] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Delete icon: #CD1818 on hover */}
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="p-1 text-[#4E3636]/40 hover:text-[#CD1818] transition-colors rounded hover:bg-[#CD1818]/5 shrink-0 cursor-pointer"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-[#4E3636]/60">
            <ShoppingBag className="w-10 h-10 text-[#4E3636]/30 mb-2 stroke-[1.5]" />
            <p className="text-sm font-bold text-[#321E1E]">Bill is currently empty</p>
            <p className="text-xs text-[#4E3636] mt-1 max-w-[200px]">
              Click &quot;Add to Bill&quot; on any product card in the catalog.
            </p>
          </div>
        )}
      </div>

      {/* 4. Summary Section & Action Buttons */}
      <div className="p-5 border-t border-[#4E3636]/10 bg-[#FDFBF7]/70 shrink-0 space-y-3.5">
        {/* Breakdown */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span>Sub Total</span>
            <span className="font-semibold text-[#321E1E]">
              ₹{subTotal.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Discount with Input */}
          <div className="flex items-center justify-between text-[#4E3636] gap-2">
            <span className="flex items-center gap-1">
              <span>Discount</span>
              <span className="text-[10px] text-[#116D6E] font-semibold">(%)</span>
            </span>
            <div className="flex items-center gap-2">
              <div className="relative w-16">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent || ''}
                  onChange={(e) => {
                    const val = Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                    setDiscountPercent(val);
                  }}
                  placeholder="0"
                  className="w-full text-right bg-white text-xs font-semibold text-[#321E1E] py-1 px-2 pr-5 rounded-md border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E]"
                />
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-[#4E3636]/60 font-bold">
                  %
                </span>
              </div>
              <span className="font-semibold text-emerald-700 min-w-14 text-right">
                -₹{discountAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[#4E3636]">
            <span>GST / Tax (5%)</span>
            <span className="font-semibold text-[#321E1E]">
              +₹{taxAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* 2. Conditional Advance Payment Section (Only visible if orderType === 'order') */}
        {orderType === 'order' && (
          <div className="pt-2.5 border-t border-[#4E3636]/15 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs font-semibold text-[#4E3636]">
                Advance Payment (₹)
              </label>
              <div className="relative w-32">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#4E3636]/60">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  value={advancePayment === 0 ? '' : advancePayment}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setAdvancePayment(0);
                    } else {
                      const num = Math.max(0, Math.min(totalAmount, parseInt(val, 10) || 0));
                      setAdvancePayment(num);
                    }
                  }}
                  placeholder="0"
                  className="w-full text-right bg-white text-xs font-bold text-[#321E1E] py-1.5 pl-6 pr-2.5 rounded-lg border border-[#4E3636]/30 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/20 shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#CD1818]/5 border border-[#CD1818]/15">
              <span className="text-[#4E3636] font-medium">Pending Amount</span>
              <span className="font-extrabold text-sm text-[#CD1818]">
                ₹{pendingAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Total Amount: Very prominent. Text in #321E1E bold,
            but actual number large and in #CD1818 (Vibrant Crimson) for maximum contrast */}
        <div className="pt-3 border-t border-[#4E3636]/15 flex items-baseline justify-between">
          <span className="text-base font-bold text-[#321E1E]">
            Total Amount
          </span>
          <span className="text-3xl font-extrabold text-[#CD1818] tracking-tight">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Action Button:
              If orderType is 'takeaway' or 'dinein': Button text = "Pay Now" (Background: #CD1818, text white).
              If orderType is 'order': Button text = "Pay Advance & Confirm Order" (Background: #116D6E, text white). */}
          {orderType === 'order' ? (
            <button
              type="button"
              onClick={() => {
                if (cartItems.length === 0) return;
                const orderData = {
                  items: [...cartItems],
                  orderType: 'order',
                  orderTypeLabel: 'Order',
                  subTotal,
                  discountAmount,
                  discountPercent,
                  taxAmount,
                  totalAmount,
                  advancePaid: advancePayment,
                  pendingAmount,
                  amountToPayNow,
                  status: pendingAmount > 0 ? 'Pending Payment' : 'Completed',
                  timestamp: new Date(),
                };
                onPayNow && onPayNow(orderData);
              }}
              disabled={cartItems.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(17,109,110,0.45)] hover:shadow-[0_12px_28px_-4px_rgba(17,109,110,0.55)] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Pay Advance &amp; Confirm Order</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (cartItems.length === 0) return;
                onCloseMobile?.();
                const orderData = {
                  items: [...cartItems],
                  orderType,
                  orderTypeLabel: orderType === 'takeaway' ? 'Takeaway' : 'Dine-in',
                  subTotal,
                  discountAmount,
                  discountPercent,
                  taxAmount,
                  totalAmount,
                  advancePaid: '-',
                  pendingAmount: 0,
                  amountToPayNow: totalAmount,
                  status: 'Completed',
                  timestamp: new Date(),
                };
                onPayNow && onPayNow(orderData);
              }}
              disabled={cartItems.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-[#CD1818] hover:bg-[#b51414] active:scale-[0.99] text-white text-base font-bold flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(205,24,24,0.45)] hover:shadow-[0_12px_28px_-4px_rgba(205,24,24,0.55)] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
            >
              <CreditCard className="w-5 h-5 text-white" />
              <span>Pay Now &bull; ₹{totalAmount.toLocaleString('en-IN')}</span>
            </button>
          )}

          {/* "Print Bill": Secondary button, background white, border #321E1E, text #321E1E */}
          <button
            type="button"
            onClick={() => {
              if (cartItems.length === 0) return;
              onCloseMobile?.();
              const orderData = {
                items: [...cartItems],
                orderType,
                orderTypeLabel:
                  orderType === 'takeaway'
                    ? 'Takeaway'
                    : orderType === 'dinein'
                    ? 'Dine-in'
                    : 'Order',
                subTotal,
                discountAmount,
                discountPercent,
                taxAmount,
                totalAmount,
                advancePaid: orderType === 'order' ? advancePayment : '-',
                pendingAmount,
                amountToPayNow,
                status: pendingAmount > 0 ? 'Pending Payment' : 'Completed',
                timestamp: new Date(),
              };
              onPrintBill && onPrintBill(orderData);
            }}
            disabled={cartItems.length === 0}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FDFBF7] border border-[#321E1E] text-[#321E1E] text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <Printer className="w-4 h-4 text-[#321E1E]" />
            <span>Print Bill</span>
          </button>
        </div>
      </div>
    </aside>
  </>
  );
};

export default BillingCart;
