import React from 'react';
import { X, Printer, CheckCircle, Sparkles, Download } from 'lucide-react';

export const ReceiptModal = ({
  isOpen,
  onClose,
  billData,
}) => {
  if (!isOpen || !billData) return null;

  const {
    billNumber = 'SB-1042',
    date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    customerName = 'Walk-in Customer',
    customerPhone = '',
    cashier = 'Chef Marie Laurent',
    items = [],
    subTotal = 0,
    discountAmount = 0,
    discountPercent = 0,
    taxAmount = 0,
    totalAmount = 0,
    paymentMethod = 'CASH',
  } = billData;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const printableElement = document.getElementById('printable-receipt');
    if (!printableElement) return;

    const receiptHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SweetBite_Receipt_${billNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Courier New", monospace;
      background: #FDFBF7;
      display: flex;
      justify-content: center;
      padding: 24px;
      margin: 0;
      color: #321E1E;
    }
    .receipt-container {
      width: 320px;
      background: #ffffff;
      padding: 24px;
      border: 1px solid rgba(78, 54, 54, 0.2);
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      font-size: 11px;
      line-height: 1.4;
      text-align: center;
      font-family: monospace;
    }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    .title { font-size: 22px; font-weight: bold; margin-bottom: 2px; font-family: Georgia, serif; }
    .dashed { border-top: 1px dashed rgba(78, 54, 54, 0.3); margin: 10px 0; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 11px; text-align: left; }
    th { border-bottom: 1px solid rgba(78, 54, 54, 0.2); padding: 4px 0; }
    td { padding: 4px 0; }
    .flex-row { display: flex; justify-content: space-between; margin: 2px 0; }
    .total-row { font-size: 13px; font-weight: bold; color: #CD1818; }
    @media print {
      body { background: white; padding: 0; }
      .receipt-container { border: none; box-shadow: none; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    ${printableElement.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([receiptHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SweetBite_Receipt_${billNumber}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="p-4 bg-[#116D6E] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-white" />
            <h3 className="font-serif font-bold text-sm">Receipt Slip Preview</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-white text-[#116D6E] hover:bg-[#FDFBF7] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
              title="Download Receipt Slip (HTML)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Slip</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/15 text-white hover:bg-white/25 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer border border-white/20 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Thermal</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#FDFBF7]/40 flex justify-center">
          <div
            id="printable-receipt"
            className="w-full max-w-[320px] bg-white p-5 rounded-lg border border-[#4E3636]/15 shadow-sm text-center font-mono text-xs text-[#321E1E]"
          >
            {/* Header */}
            <div className="space-y-1 mb-3">
              <h2 className="font-serif text-xl font-bold tracking-tight text-[#321E1E]">
                SweetBite
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-[#4E3636]">
                Artisan Bakery &amp; Patisserie
              </p>
              <p className="text-[10px] text-[#4E3636]/80 leading-tight">
                Shop 4, Heritage Promenade, Park Avenue<br />
                GSTIN: 27AABCS1429B1Z8 &bull; FSSAI: 11521000000452<br />
                Ph: +91 (022) 2840-9912
              </p>
            </div>

            <div className="border-t border-dashed border-[#4E3636]/30 my-2" />

            {/* Bill Meta */}
            <div className="text-left text-[11px] space-y-0.5 text-[#4E3636]">
              <div className="flex justify-between">
                <span>Invoice No:</span>
                <span className="font-bold text-[#321E1E]">{billNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date &amp; Time:</span>
                <span>{date}, {time}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-medium text-[#321E1E]">{customerName}</span>
              </div>
              {customerPhone && (
                <div className="flex justify-between">
                  <span>Mobile:</span>
                  <span className="font-medium text-[#321E1E]">{customerPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>{cashier}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-[#4E3636]/30 my-2" />

            {/* Items Table */}
            <table className="w-full text-left text-[11px] my-2">
              <thead>
                <tr className="border-b border-[#4E3636]/20 font-bold text-[#321E1E]">
                  <th className="py-1">Item</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Rate</th>
                  <th className="py-1 text-right">Amt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4E3636]/10">
                {items.map((item, idx) => (
                  <tr key={idx} className="py-1">
                    <td className="py-1.5 pr-1 font-medium">{item.name}</td>
                    <td className="py-1.5 text-center text-[#4E3636]">{item.quantity}</td>
                    <td className="py-1.5 text-right text-[#4E3636]">₹{item.price}</td>
                    <td className="py-1.5 text-right font-bold text-[#321E1E]">
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-dashed border-[#4E3636]/30 my-2" />

            {/* Financial Summary */}
            <div className="space-y-1 text-right text-[11px] text-[#4E3636]">
              <div className="flex justify-between">
                <span>Sub Total:</span>
                <span>₹{subTotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({discountPercent}%):</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>+₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#CD1818] pt-1 border-t border-[#4E3636]/20">
                <span className="text-[#321E1E]">GRAND TOTAL:</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              {billData.orderType && (
                <div className="flex justify-between text-[10px] text-[#4E3636] pt-1">
                  <span>Order Type:</span>
                  <span className="font-bold uppercase text-[#321E1E]">{billData.orderType}</span>
                </div>
              )}
              {billData.pendingAmount > 0 ? (
                <>
                  <div className="flex justify-between text-[10px] text-emerald-700">
                    <span>Advance Paid:</span>
                    <span className="font-bold">₹{Number(billData.advancePaid).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-[#CD1818] pt-0.5">
                    <span>BALANCE DUE:</span>
                    <span>₹{Number(billData.pendingAmount).toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : null}
              <div className="flex justify-between text-[10px] text-[#4E3636] pt-1">
                <span>Paid via:</span>
                <span className="font-bold uppercase text-[#116D6E]">{paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-[#4E3636]/30 my-3" />

            {/* Barcode & Footer note */}
            <div className="space-y-2">
              <div className="flex justify-center">
                {/* Visual Barcode */}
                <div className="h-9 w-44 flex items-center justify-between px-2 bg-white">
                  {[4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4].map(
                    (w, i) => (
                      <span
                        key={i}
                        className="h-full bg-[#321E1E]"
                        style={{ width: `${w * 1.5}px` }}
                      />
                    )
                  )}
                </div>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-[#4E3636]/70">
                *{billNumber}*
              </p>
              <p className="font-serif italic text-xs text-[#321E1E]">
                Freshly Baked Happiness
              </p>
              <p className="text-[9px] text-[#4E3636]/60">
                Thank you for visiting! For catering &amp; custom cakes, visit sweetbite.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-3 bg-white border-t border-[#4E3636]/10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 py-2.5 bg-white border border-[#116D6E] text-[#116D6E] hover:bg-[#116D6E]/10 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Slip</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-white border border-[#4E3636]/30 text-[#321E1E] hover:bg-[#FDFBF7] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#116D6E] hover:bg-[#0e5859] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-teal active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
