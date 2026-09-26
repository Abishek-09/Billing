import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  Receipt,
  Sparkles,
  ShieldCheck,
  Split,
  ArrowRight,
  User,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal = ({
  isOpen,
  onClose,
  totalAmount,
  fullTotalAmount,
  orderType = 'Takeaway',
  pendingAmount = 0,
  customerName = 'Walk-in Customer',
  customerPhone = '',
  billNumber,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState('cash'); // 'cash' | 'upi' | 'card' | 'split'
  const [tenderedAmount, setTenderedAmount] = useState('');
  const [custName, setCustName] = useState(customerName || 'Walk-in Customer');
  const [custPhone, setCustPhone] = useState(customerPhone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    setCustName(customerName || 'Walk-in Customer');
    setCustPhone(customerPhone || '');
  }, [customerName, customerPhone, isOpen]);

  if (!isOpen) return null;

  const tendered = parseFloat(tenderedAmount) || totalAmount;
  const changeDue = Math.max(0, tendered - totalAmount);

  const handleCashPreset = (amount) => {
    setTenderedAmount(amount.toString());
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#116D6E', '#CD1818', '#321E1E', '#FDFBF7']
        });
      } catch (err) {
        // Safe fallback
      }

      setTimeout(() => {
        onPaymentSuccess({
          billNumber,
          customerName: custName.trim() || 'Walk-in Customer',
          customerPhone: custPhone.trim(),
          amount: totalAmount,
          orderType,
          fullTotalAmount: fullTotalAmount || totalAmount,
          pendingAmount,
          method: method.toUpperCase(),
          tendered,
          change: changeDue,
          timestamp: new Date(),
        });
        setPaymentDone(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#116D6E] px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold leading-tight">
                {orderType === 'Order' ? 'Pre-Order Advance Payment' : 'Complete Payment'}
              </h3>
              <p className="text-xs text-white/80">
                Bill {billNumber} &bull; {custName || 'Walk-in Customer'} &bull; {orderType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Customer Details: Name & Mobile Number */}
          <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#4E3636]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4E3636] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#116D6E]" />
                <span>Customer Details</span>
              </span>
              <span className="text-[10px] font-semibold text-[#116D6E] bg-[#116D6E]/10 px-2 py-0.5 rounded-md">
                {orderType === 'Order' ? 'Pre-Order Contact' : 'Billing Contact'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Customer Name */}
              <div>
                <label className="block text-[11px] font-semibold text-[#4E3636] mb-1">
                  Customer Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#4E3636]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-white text-xs text-[#321E1E] font-medium pl-8 pr-3 py-2 rounded-lg border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 shadow-2xs placeholder-[#4E3636]/40"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[11px] font-semibold text-[#4E3636] mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#4E3636]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-white text-xs text-[#321E1E] font-medium pl-8 pr-3 py-2 rounded-lg border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 shadow-2xs placeholder-[#4E3636]/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amount Due Card */}
          <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#4E3636]/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#4E3636]">
                {orderType === 'Order' ? 'Advance Amount Payable Now' : 'Total Payable Amount'}
              </span>
              <span className="text-3xl font-extrabold text-[#CD1818]">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            {orderType === 'Order' && pendingAmount > 0 && (
              <div className="pt-2 border-t border-[#4E3636]/10 flex items-center justify-between text-xs text-[#4E3636]">
                <span>Total: ₹{(fullTotalAmount || totalAmount).toLocaleString('en-IN')}</span>
                <span className="font-bold text-[#CD1818]">
                  Balance Due on Pickup: ₹{pendingAmount.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Payment Method Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4E3636] mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'cash', label: 'Cash', icon: Banknote },
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'split', label: 'Split Bill', icon: Split },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = method === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMethod(tab.id)}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#116D6E] bg-[#116D6E]/10 text-[#116D6E] shadow-sm'
                        : 'border-[#4E3636]/15 hover:border-[#4E3636]/30 text-[#321E1E] bg-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Method Specific UI */}
          {method === 'cash' && (
            <div className="space-y-3 bg-[#FDFBF7] p-4 rounded-xl border border-[#4E3636]/10">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#321E1E]">
                  Cash Received (₹)
                </span>
                <input
                  type="number"
                  value={tenderedAmount}
                  onChange={(e) => setTenderedAmount(e.target.value)}
                  placeholder={totalAmount.toString()}
                  className="w-32 bg-white text-right font-bold text-sm text-[#321E1E] p-2 rounded-lg border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E]"
                />
              </div>

              {/* Quick Preset Cash Notes */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-[#4E3636] font-medium mr-1">
                  Presets:
                </span>
                {[
                  { label: 'Exact', val: totalAmount },
                  { label: '₹500', val: 500 },
                  { label: '₹1000', val: 1000 },
                  { label: '₹2000', val: 2000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleCashPreset(preset.val)}
                    className="px-2.5 py-1 bg-white hover:bg-[#116D6E] hover:text-white text-xs font-semibold text-[#321E1E] rounded-md border border-[#4E3636]/15 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Change Due Display */}
              <div className="pt-2 border-t border-[#4E3636]/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#4E3636]">
                  Change Due to Customer
                </span>
                <span className="text-base font-bold text-[#116D6E]">
                  ₹{changeDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {method === 'upi' && (
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 flex items-center gap-4">
              <div className="w-24 h-24 bg-white p-1 rounded-lg border border-[#4E3636]/15 flex items-center justify-center shrink-0">
                {/* Simulated dynamic UPI QR code */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#321E1E]">
                  <rect x="5" y="5" width="30" height="30" fill="currentColor" />
                  <rect x="10" y="10" width="20" height="20" fill="white" />
                  <rect x="15" y="15" width="10" height="10" fill="currentColor" />
                  <rect x="65" y="5" width="30" height="30" fill="currentColor" />
                  <rect x="70" y="10" width="20" height="20" fill="white" />
                  <rect x="75" y="15" width="10" height="10" fill="currentColor" />
                  <rect x="5" y="65" width="30" height="30" fill="currentColor" />
                  <rect x="10" y="70" width="20" height="20" fill="white" />
                  <rect x="15" y="75" width="10" height="10" fill="currentColor" />
                  <rect x="45" y="15" width="10" height="20" fill="currentColor" />
                  <rect x="45" y="45" width="20" height="20" fill="currentColor" />
                  <rect x="70" y="55" width="20" height="10" fill="currentColor" />
                  <rect x="50" y="75" width="25" height="15" fill="currentColor" />
                </svg>
              </div>
              <div className="text-left text-xs space-y-1">
                <p className="font-bold text-[#321E1E]">Scan with any UPI App</p>
                <p className="text-[#4E3636]">GPay, PhonePe, Paytm, BHIM</p>
                <p className="text-[11px] font-mono text-[#116D6E] font-semibold">
                  sweetbite@hdfcbank
                </p>
                <div className="pt-1 flex items-center gap-1 text-[11px] text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Instant Audio Notification Enabled</span>
                </div>
              </div>
            </div>
          )}

          {method === 'card' && (
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-[#116D6E] shrink-0" />
              <div className="text-xs text-left">
                <p className="font-bold text-[#321E1E]">POS Terminal Ready</p>
                <p className="text-[#4E3636]">
                  Swipe, tap (NFC), or insert card on connected terminal #EDC-04.
                </p>
              </div>
            </div>
          )}

          {method === 'split' && (
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 text-xs text-left space-y-2">
              <p className="font-bold text-[#321E1E]">Split Payment</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#4E3636]">Part 1 (Cash)</label>
                  <input
                    type="number"
                    defaultValue={Math.round(totalAmount / 2)}
                    className="w-full bg-white text-xs p-1.5 rounded border border-[#4E3636]/20 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#4E3636]">Part 2 (UPI/Card)</label>
                  <input
                    type="number"
                    defaultValue={Math.round(totalAmount / 2)}
                    className="w-full bg-white text-xs p-1.5 rounded border border-[#4E3636]/20 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing || paymentDone}
            className="w-full py-3.5 px-4 rounded-xl bg-[#CD1818] hover:bg-[#b51414] active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(205,24,24,0.4)] transition-all cursor-pointer disabled:opacity-60"
          >
            {paymentDone ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Payment Received! Generating Receipt...</span>
              </>
            ) : isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Transaction...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Confirm Payment (₹{totalAmount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
