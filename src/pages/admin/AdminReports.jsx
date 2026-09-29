import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  CreditCard,
  Percent,
  Receipt,
  CheckCircle2,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ShieldCheck,
  Scale,
  Eye,
  Clock,
  Utensils,
  ShoppingBag
} from 'lucide-react';
import {
  REPORTS_FINANCIAL_SUMMARY,
  PAYMENT_TENDER_AUDIT,
  GST_SLAB_AUDIT_DATA,
  PRODUCT_PROFITABILITY_DATA,
  ALL_ORDERS_DATA
} from '../../data/adminMockData';
import ReceiptModal from '../../components/ReceiptModal';
import ProductDailyProfitReport from './reports/ProductDailyProfitReport';

export const AdminReports = () => {
  const outletContext = useOutletContext();
  const selectedRange = outletContext?.selectedDateRange || 'This Week';
  const setSelectedDateRange = outletContext?.setSelectedDateRange;

  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('DailyProfit'); // 'DailyProfit' | 'Overview' | 'GST'
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [activeReceiptSlipOrder, setActiveReceiptSlipOrder] = useState(null);
  const [matrixViewMode, setMatrixViewMode] = useState('products'); // 'products' | 'bills'

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Pull financial data dynamically based on selectedRange
  const financialData =
    REPORTS_FINANCIAL_SUMMARY[selectedRange] || REPORTS_FINANCIAL_SUMMARY['This Week'];

  const totalGSTTax = GST_SLAB_AUDIT_DATA.reduce((acc, curr) => acc + curr.totalTax, 0);
  const totalTaxableTurnover = GST_SLAB_AUDIT_DATA.reduce(
    (acc, curr) => acc + curr.taxableValue,
    0
  );

  // 1. Live Today's Orders from Memory & LocalStorage
  const todayOrders = useMemo(() => {
    let source = [...ALL_ORDERS_DATA];
    try {
      const saved = localStorage.getItem('sweetbite_pos_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          source = [...parsed, ...ALL_ORDERS_DATA];
          const seen = new Set();
          source = source.filter((o) => {
            const id = o.id || o.billNumber;
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
          });
        }
      }
    } catch (e) {}

    // Match today orders
    return source.filter(
      (o) =>
        o.isNewToday ||
        (o.date &&
          (o.date.includes('26 Sep') ||
            o.date.includes('Today') ||
            o.date.includes(
              new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
            )))
    );
  }, []);

  // 2. Map Today's Sales per Product with Associated Live Bills
  const todayProductMatrix = useMemo(() => {
    const productRules = [
      {
        id: 'p1',
        name: 'Golden Butter Croissant',
        category: 'Pastries',
        classification: 'Star High Margin',
        sellingPrice: 110,
        unitCost: 28,
        matchKeywords: ['croissant'],
        fallbackQty: 12,
      },
      {
        id: 'p2',
        name: 'Belgian Truffle Cake (1 kg)',
        category: 'Cakes',
        classification: 'Revenue Anchor',
        sellingPrice: 750,
        unitCost: 260,
        matchKeywords: ['truffle', 'belgian'],
        fallbackQty: 2,
      },
      {
        id: 'p3',
        name: 'Red Velvet Cream Cheese Cake',
        category: 'Cakes',
        classification: 'Celebration Favorite',
        sellingPrice: 680,
        unitCost: 245,
        matchKeywords: ['red velvet'],
        fallbackQty: 3,
      },
      {
        id: 'p4',
        name: 'Artisan Sourdough Country Boule',
        category: 'Bread',
        classification: 'Daily Essential',
        sellingPrice: 180,
        unitCost: 45,
        matchKeywords: ['sourdough'],
        fallbackQty: 3,
      },
      {
        id: 'p5',
        name: 'Valrhona Pain au Chocolat',
        category: 'Pastries',
        classification: 'Consistent Seller',
        sellingPrice: 135,
        unitCost: 42,
        matchKeywords: ['chocolat', 'pain au'],
        fallbackQty: 5,
      },
      {
        id: 'p6',
        name: 'Vanilla Bean Berry Gateau',
        category: 'Cakes',
        classification: 'Specialty Item',
        sellingPrice: 620,
        unitCost: 230,
        matchKeywords: ['gateau', 'berry'],
        fallbackQty: 2,
      },
    ];

    return productRules
      .map((p, idx) => {
        const matchingBills = [];
        let totalQty = 0;

        todayOrders.forEach((order) => {
          let orderItemQty = 0;

          if (order.detailedItems && Array.isArray(order.detailedItems)) {
            order.detailedItems.forEach((it) => {
              const itName = (it.name || '').toLowerCase();
              if (p.matchKeywords.some((kw) => itName.includes(kw))) {
                orderItemQty += Number(it.quantity || 1);
              }
            });
          } else if (order.itemsList && Array.isArray(order.itemsList)) {
            order.itemsList.forEach((itemStr) => {
              const lower = itemStr.toLowerCase();
              if (p.matchKeywords.some((kw) => lower.includes(kw))) {
                const match = itemStr.match(/^(\d+)x/);
                const qty = match ? parseInt(match[1], 10) : 1;
                orderItemQty += qty;
              }
            });
          }

          if (orderItemQty > 0) {
            totalQty += orderItemQty;
            matchingBills.push({
              order,
              qtyInBill: orderItemQty,
              itemAmount: orderItemQty * p.sellingPrice,
            });
          }
        });

        const finalQty = totalQty > 0 ? totalQty : p.fallbackQty;
        const todayRevenue = finalQty * p.sellingPrice;
        const todayCOGS = finalQty * p.unitCost;
        const todayGrossProfit = todayRevenue - todayCOGS;
        const margin = (((p.sellingPrice - p.unitCost) / p.sellingPrice) * 100).toFixed(1) + '%';

        return {
          ...p,
          rank: idx + 1,
          qtySoldToday: finalQty,
          todayRevenue,
          todayGrossProfit,
          margin,
          bills: matchingBills,
        };
      })
      .sort((a, b) => b.todayGrossProfit - a.todayGrossProfit)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  }, [todayOrders]);

  // Format order into ReceiptModal billData
  const formatBillData = (order) => {
    if (!order) return null;
    return {
      billNumber: order.billNumber || order.id,
      date:
        order.date?.split(',')[0] ||
        order.date ||
        new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time:
        order.date?.split(',')[1]?.trim() ||
        new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      customerName: order.customer || 'Walk-in Customer',
      customerPhone: order.customerPhone || '',
      cashier: 'Chef Marie Laurent',
      items:
        order.detailedItems ||
        (order.itemsList
          ? order.itemsList.map((itemStr) => {
              const match = itemStr.match(/^(\d+)x\s*(.*)$/);
              if (match) {
                return {
                  name: match[2],
                  quantity: parseInt(match[1], 10),
                  price: Math.round(order.totalAmount / (order.itemsList.length || 1)),
                };
              }
              return {
                name: itemStr,
                quantity: 1,
                price: Math.round(order.totalAmount / (order.itemsList.length || 1)),
              };
            })
          : []),
      subTotal: order.subTotal || Math.round(order.totalAmount / 1.05),
      discountAmount: order.discountAmount || 0,
      discountPercent: order.discountPercent || 0,
      taxAmount: order.taxAmount || Math.round(order.totalAmount - order.totalAmount / 1.05),
      totalAmount: order.totalAmount,
      advancePaid: order.advancePaid,
      pendingAmount: order.pendingAmount,
      paymentMethod:
        order.paymentMethod ||
        (order.type === 'Takeaway' ? 'UPI' : order.type === 'Dine-in' ? 'CASH' : 'CARD'),
      orderType: order.type || 'Counter Sale',
    };
  };

  // Direct 1-click Download Slip handler for any order/sale
  const handleDownloadSingleSlip = (order) => {
    const bill = formatBillData(order);
    if (!bill) return;

    const receiptHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SweetBite_Slip_${bill.billNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      background: #FDFBF7;
      display: flex;
      justify-content: center;
      padding: 24px;
      margin: 0;
      color: #321E1E;
    }
    .receipt-container {
      width: 320px;
      background: #fff;
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
    <div class="title">SweetBite</div>
    <div style="font-size: 10px; text-transform: uppercase; color: #4E3636;">Artisan Bakery & Patisserie</div>
    <div style="font-size: 9px; color: #4E3636; margin-top: 4px;">
      Shop 4, Heritage Promenade, Park Avenue<br>
      GSTIN: 27AABCS1429B1Z8 &bull; FSSAI: 11521000000452<br>
      Ph: +91 (022) 2840-9912
    </div>
    <div class="dashed"></div>
    <div class="text-left" style="font-size: 11px; color: #4E3636;">
      <div class="flex-row"><span>Invoice No:</span><strong style="color: #321E1E;">${bill.billNumber}</strong></div>
      <div class="flex-row"><span>Date & Time:</span><span>${bill.date}, ${bill.time}</span></div>
      <div class="flex-row"><span>Customer:</span><strong style="color: #321E1E;">${bill.customerName}</strong></div>
      ${bill.customerPhone ? `<div class="flex-row"><span>Mobile:</span><span>${bill.customerPhone}</span></div>` : ''}
      <div class="flex-row"><span>Order Type:</span><strong style="color: #116D6E; text-transform: uppercase;">${bill.orderType}</strong></div>
      <div class="flex-row"><span>Cashier:</span><span>${bill.cashier}</span></div>
    </div>
    <div class="dashed"></div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Rate</th>
          <th style="text-align: right;">Amt</th>
        </tr>
      </thead>
      <tbody>
        ${bill.items
          .map(
            (it) => `
          <tr>
            <td>${it.name}</td>
            <td style="text-align: center;">${it.quantity}</td>
            <td style="text-align: right;">₹${it.price}</td>
            <td style="text-align: right; font-weight: bold;">₹${it.price * it.quantity}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
    <div class="dashed"></div>
    <div class="text-right" style="font-size: 11px; color: #4E3636;">
      <div class="flex-row"><span>Sub Total:</span><span>₹${bill.subTotal.toLocaleString('en-IN')}</span></div>
      <div class="flex-row"><span>GST (5%):</span><span>+₹${bill.taxAmount.toLocaleString('en-IN')}</span></div>
      <div class="flex-row total-row" style="border-top: 1px solid rgba(78,54,54,0.2); padding-top: 4px; margin-top: 4px;">
        <span style="color: #321E1E;">GRAND TOTAL:</span><span>₹${bill.totalAmount.toLocaleString('en-IN')}</span>
      </div>
      ${
        bill.pendingAmount > 0
          ? `
      <div class="flex-row" style="color: #047857; margin-top: 4px;"><span>Advance Paid:</span><span>₹${Number(bill.advancePaid).toLocaleString('en-IN')}</span></div>
      <div class="flex-row" style="color: #CD1818; font-weight: bold;"><span>BALANCE DUE:</span><span>₹${Number(bill.pendingAmount).toLocaleString('en-IN')}</span></div>
      `
          : ''
      }
      <div class="flex-row" style="margin-top: 4px;"><span>Paid via:</span><strong style="color: #116D6E;">${bill.paymentMethod}</strong></div>
    </div>
    <div class="dashed"></div>
    <div style="font-size: 10px; color: #4E3636; margin-top: 6px;">
      <p style="font-style: italic; font-family: Georgia, serif; font-size: 12px; margin: 4px 0;">Freshly Baked Happiness</p>
      <p style="font-size: 9px; color: #666;">Thank you for your visit! For custom orders, visit sweetbite.com</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([receiptHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SweetBite_Slip_${bill.billNumber}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Slip for ${bill.billNumber} downloaded successfully!`);
  };

  // 1. Download Profit & Loss Statement (CSV)
  const handleDownloadPL = () => {
    const headers = ['Financial Metric', 'Value', 'Reporting Timeframe'];
    const rows = [
      ['Gross Counter Sales', `"${financialData.grossSales}"`, selectedRange],
      ['Promotions & Bill Discounts', `"${financialData.discounts}"`, selectedRange],
      ['Net Realized Revenue', `"${financialData.netRevenue}"`, selectedRange],
      ['Cost of Goods Sold (COGS)', `"${financialData.cogs}"`, selectedRange],
      ['Gross Operating Profit', `"${financialData.grossProfit}"`, selectedRange],
      ['Gross Profit Margin (%)', `"${financialData.marginPercent}"`, selectedRange],
      ['Total GST Collected (Liability)', `"${financialData.gstCollected}"`, selectedRange],
      ['Pending Advance Receivables', `"${financialData.pendingReceivables}"`, selectedRange],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `# SweetBite Artisan Bakery - Profit & Loss Statement (${selectedRange})`,
        headers.join(','),
        ...rows.map((r) => r.join(',')),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `SweetBite_PL_Statement_${selectedRange.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`P&L Statement for "${selectedRange}" downloaded successfully.`);
  };

  // 2. Download GST Tax Ledger (CSV - GSTR-1 format)
  const handleDownloadGST = () => {
    const headers = [
      'GST Tax Slab',
      'HSN Code',
      'Taxable Turnover (INR)',
      'CGST 50% (INR)',
      'SGST 50% (INR)',
      'Total Output Tax (INR)',
    ];

    const rows = GST_SLAB_AUDIT_DATA.map((row) => [
      `"${row.slab}"`,
      row.hsn,
      row.taxableValue,
      row.cgst,
      row.sgst,
      row.totalTax,
    ]);

    rows.push([
      '"TOTAL LIABILITY"',
      '"—"',
      totalTaxableTurnover,
      totalGSTTax / 2,
      totalGSTTax / 2,
      totalGSTTax,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `# SweetBite Bakery - GSTR-1 Statutory Tax Liability Ledger (${selectedRange})`,
        headers.join(','),
        ...rows.map((r) => r.join(',')),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `SweetBite_GST_Tax_Ledger_${selectedRange.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`GST Tax Ledger for "${selectedRange}" downloaded.`);
  };

  // 3. Download Menu Engineering Matrix (CSV) using Today's Live Sales
  const handleDownloadMenuMatrix = () => {
    const headers = [
      'Rank',
      'Product Name',
      'Category',
      'Selling Price (INR)',
      'Unit Cost COGS (INR)',
      'Margin %',
      'Today Units Sold',
      'Today Gross Sales (INR)',
      'Today Gross Profit (INR)',
      'Associated Bills Count'
    ];
    const rows = todayProductMatrix.map((p) => [
      `#${p.rank}`,
      `"${p.name}"`,
      `"${p.category}"`,
      p.sellingPrice,
      p.unitCost,
      `"${p.margin}"`,
      p.qtySoldToday,
      p.todayRevenue,
      p.todayGrossProfit,
      p.bills.length
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `# SweetBite Bakery - Today's Live Sales & Product Profitability Matrix`,
        headers.join(','),
        ...rows.map((r) => r.join(','))
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SweetBite_Today_Menu_Engineering_Matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Today's Menu Engineering Matrix downloaded.`);
  };

  // 4. Download All Today's Slips
  const handleDownloadAllTodaySlips = () => {
    if (todayOrders.length === 0) {
      showToast('No orders found for today.');
      return;
    }
    todayOrders.forEach((ord, index) => {
      setTimeout(() => {
        handleDownloadSingleSlip(ord);
      }, index * 250);
    });
    showToast(`Downloading ${todayOrders.length} slips for today's sales...`);
  };

  // 5. Print Complete Audit Report
  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#116D6E]/10 border border-[#116D6E]/20 text-[#116D6E] rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#116D6E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Report Sub-Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-[#4E3636]/15 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('DailyProfit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'DailyProfit'
                ? 'bg-[#116D6E] text-white shadow-teal'
                : 'text-[#4E3636] hover:bg-[#FDFBF7] hover:text-[#321E1E]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Product Daily Profit</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'DailyProfit'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#116D6E]/10 text-[#116D6E]'
              }`}
            >
              Unit Economics
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'Overview'
                ? 'bg-[#116D6E] text-white shadow-teal'
                : 'text-[#4E3636] hover:bg-[#FDFBF7] hover:text-[#321E1E]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Financial Audit &amp; P&amp;L</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('GST')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'GST'
                ? 'bg-[#116D6E] text-white shadow-teal'
                : 'text-[#4E3636] hover:bg-[#FDFBF7] hover:text-[#321E1E]'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>GSTR-1 Tax Ledger</span>
          </button>
        </div>

        <div className="text-[11px] text-[#4E3636] px-3 font-medium hidden md:block">
          Active Suite: <strong className="text-[#116D6E]">{activeTab === 'DailyProfit' ? 'Item Margin Audit' : activeTab === 'Overview' ? 'Comprehensive P&L' : 'Statutory Tax'}</strong>
        </div>
      </div>

      {/* Tab 1: Product Daily Profit (New Feature) */}
      {activeTab === 'DailyProfit' && <ProductDailyProfitReport />}

      {/* Tab 2: Financial Overview & P&L */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {/* Top Header & Export Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#4E3636]/15 shadow-soft">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#116D6E]" />
            <h2 className="font-serif text-2xl font-bold text-[#321E1E]">
              Financial Auditing &amp; Profitability Reports
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20">
              Tax &amp; P&amp;L Suite
            </span>
          </div>
          <p className="text-xs text-[#4E3636] mt-1">
            GSTR-1 tax compliance, Cost of Goods Sold (COGS), payment tender reconciliation, and item margins
          </p>
        </div>

        {/* Action Buttons: Export P&L, Export GST, Print */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadPL}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#4E3636]/20 hover:border-[#116D6E] text-[#321E1E] text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            title="Download Profit & Loss CSV"
          >
            <Download className="w-4 h-4 text-[#116D6E]" />
            <span>P&amp;L Report (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadGST}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#4E3636]/20 hover:border-[#116D6E] text-[#321E1E] text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            title="Download GST Liability CSV"
          >
            <FileText className="w-4 h-4 text-[#CD1818]" />
            <span>GST Ledger (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handlePrintAudit}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] active:scale-95 text-white text-xs font-bold shadow-teal transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Audit Report</span>
          </button>
        </div>
      </div>

      {/* 1. Executive P&L Financial Ledger (4 Distinct Auditing Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Gross Sales vs Discounts */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              Net Billed Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#116D6E]/10 flex items-center justify-center text-[#116D6E]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-[#321E1E] tracking-tight">
              {financialData.netRevenue}
            </div>
            <div className="text-xs text-[#4E3636] mt-1">
              Gross: <strong className="text-[#321E1E]">{financialData.grossSales}</strong> &bull; Disc:{' '}
              <span className="text-[#CD1818] font-semibold">{financialData.discounts}</span>
            </div>
          </div>
          <div className="text-[11px] text-[#4E3636] pt-2 border-t border-[#4E3636]/10 flex justify-between">
            <span>Period:</span>
            <span className="font-semibold text-[#116D6E]">{selectedRange}</span>
          </div>
        </div>

        {/* Card 2: Cost of Goods Sold (COGS) & Profit Margin */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              Gross Profit &amp; Margin
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-emerald-800 tracking-tight">
              {financialData.grossProfit}
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                {financialData.marginPercent} Margin
              </span>
              <span className="text-[11px] text-[#4E3636]">
                COGS: {financialData.cogs}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#4E3636] pt-2 border-t border-[#4E3636]/10 flex justify-between">
            <span>Ingredient Cost Ratio:</span>
            <span className="font-semibold text-[#321E1E]">32.0%</span>
          </div>
        </div>

        {/* Card 3: Total GST Tax Liability */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              GST Tax Collected
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#CD1818]/10 flex items-center justify-center text-[#CD1818]">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-[#CD1818] tracking-tight">
              {financialData.gstCollected}
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <span className="font-bold text-[#CD1818] bg-[#CD1818]/10 px-2 py-0.5 rounded-md">
                Output Tax Payable
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#4E3636] pt-2 border-t border-[#4E3636]/10 flex justify-between">
            <span>Filing Status:</span>
            <span className="font-bold text-emerald-700">GSTR-1 Balanced</span>
          </div>
        </div>

        {/* Card 4: Advance Receivables Due */}
        <div className="bg-white rounded-2xl p-5 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4E3636] uppercase tracking-wider">
              Pending Receivables
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-extrabold text-amber-800 tracking-tight">
              {financialData.pendingReceivables}
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1">
              <span className="font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                Uncollected Balances
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#4E3636] pt-2 border-t border-[#4E3636]/10 flex justify-between">
            <span>Collection Point:</span>
            <span className="font-semibold text-[#321E1E]">Counter Handover</span>
          </div>
        </div>
      </div>

      {/* 2. Menu Engineering & Product Profitability Matrix (Today's Sales with View & Download Slips) */}
      <div className="bg-white rounded-2xl border border-[#4E3636]/15 shadow-soft overflow-hidden">
        {/* Header with Live Status, View Mode Switcher, and Export Actions */}
        <div className="p-5 border-b border-[#4E3636]/10 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#116D6E]" />
              <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                Menu Engineering &amp; Product Profitability Matrix
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Today&apos;s Live Sales
              </span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            {/* View Mode Toggle: Products Matrix vs All Bills */}
            <div className="bg-[#FDFBF7] p-1 rounded-xl border border-[#4E3636]/15 flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setMatrixViewMode('products')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  matrixViewMode === 'products'
                    ? 'bg-[#116D6E] text-white shadow-xs'
                    : 'text-[#4E3636] hover:text-[#321E1E]'
                }`}
              >
                Product Profitability
              </button>
              <button
                type="button"
                onClick={() => setMatrixViewMode('bills')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  matrixViewMode === 'bills'
                    ? 'bg-[#116D6E] text-white shadow-xs'
                    : 'text-[#4E3636] hover:text-[#321E1E]'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>All Today&apos;s Bills ({todayOrders.length})</span>
              </button>
            </div>

            {/* Export Actions: Export CSV and Download All Slips aligned side-by-side */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadMenuMatrix}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#4E3636]/20 hover:border-[#116D6E] text-[#116D6E] text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                title="Download Today's Profitability CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadAllTodaySlips}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#116D6E] hover:bg-[#0e5859] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                title="Download All Today's Bills / Slips (HTML)"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Download All Slips</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Product Profitability Matrix with Expandable Today's Bills */}
        {matrixViewMode === 'products' && (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-10 bg-[#FDFBF7] shadow-xs">
                <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7] text-[#4E3636]">
                  <th className="py-3 px-5 font-bold uppercase tracking-wider bg-[#FDFBF7]">Rank</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider bg-[#FDFBF7]">Product Name</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider bg-[#FDFBF7]">Category</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-right bg-[#FDFBF7]">Selling Price</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-right bg-[#FDFBF7]">Unit Cost (COGS)</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-right bg-[#FDFBF7]">Margin %</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-right bg-[#FDFBF7]">Today&apos;s Volume</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-right bg-[#FDFBF7]">Today&apos;s Gross Profit</th>
                  <th className="py-3 px-5 font-bold uppercase tracking-wider text-center bg-[#FDFBF7]">Customer Bills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4E3636]/10">
                {todayProductMatrix.map((item) => {
                  const isExpanded = expandedProductId === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => setExpandedProductId(isExpanded ? null : item.id)}
                        className={`transition-colors cursor-pointer ${
                          isExpanded ? 'bg-[#116D6E]/5' : 'hover:bg-[#FDFBF7]/60'
                        }`}
                      >
                        <td className="py-3.5 px-5">
                          <span
                            className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                              item.rank === 1
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : item.rank === 2
                                ? 'bg-slate-100 text-slate-800'
                                : 'bg-[#FDFBF7] text-[#4E3636]'
                            }`}
                          >
                            #{item.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#321E1E] block">{item.name}</span>
                          <span className="text-[10px] text-[#116D6E] font-medium block">
                            {item.classification}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#4E3636] font-medium">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#321E1E]">
                          ₹{item.sellingPrice}
                        </td>
                        <td className="py-3.5 px-4 text-right text-[#4E3636]">
                          ₹{item.unitCost}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-emerald-100 text-emerald-800">
                            {item.margin}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-[#321E1E]">
                          <span className="font-bold text-[#116D6E]">{item.qtySoldToday}</span> pcs today
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-[#116D6E] text-sm">
                          ₹{item.todayGrossProfit.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedProductId(isExpanded ? null : item.id);
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs ${
                              isExpanded
                                ? 'bg-[#116D6E] text-white border-[#116D6E]'
                                : 'bg-white hover:bg-[#116D6E]/10 border-[#116D6E]/30 text-[#116D6E]'
                            }`}
                            title="View today's bills for this product"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>
                              {item.bills.length > 0 ? `${item.bills.length} Bills` : 'View Bills'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Accordion: All Customer Bills for this product today */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={9} className="p-0 bg-[#FDFBF7]/80 border-b border-[#4E3636]/15">
                            <div className="p-4 px-6 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#4E3636]/10 pb-2">
                                <div className="flex items-center gap-2">
                                  <Receipt className="w-4 h-4 text-[#116D6E]" />
                                  <h4 className="font-serif font-bold text-xs text-[#321E1E]">
                                    Today&apos;s Customer Sales Bills for {item.name}
                                  </h4>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#116D6E]/10 text-[#116D6E]">
                                    {item.bills.length} transactions recorded today
                                  </span>
                                </div>
                                <div className="text-[11px] text-[#4E3636]">
                                  Total Sold: <strong className="text-[#116D6E] font-bold">{item.qtySoldToday} pcs</strong> &bull; Gross Profit: <strong className="text-emerald-700 font-bold">₹{item.todayGrossProfit.toLocaleString('en-IN')}</strong>
                                </div>
                              </div>

                              {item.bills.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {item.bills.map(({ order, qtyInBill, itemAmount }) => (
                                    <div
                                      key={order.id}
                                      className="bg-white p-3.5 rounded-xl border border-[#4E3636]/15 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                                    >
                                      <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-mono font-bold text-xs text-[#116D6E]">
                                              {order.id}
                                            </span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FDFBF7] text-[#4E3636] font-medium border border-[#4E3636]/10">
                                              {order.type || 'Counter'}
                                            </span>
                                          </div>
                                          <span className="text-[10px] text-[#4E3636]/80 flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-[#116D6E]" />
                                            {order.date?.split(',')[1]?.trim() || order.date}
                                          </span>
                                        </div>

                                        <div className="text-xs">
                                          <div className="font-bold text-[#321E1E] truncate">
                                            {order.customer}
                                          </div>
                                          <div className="text-[11px] text-[#4E3636] flex items-center justify-between mt-1 pt-1 border-t border-[#4E3636]/10">
                                            <span>
                                              Quantity: <strong className="text-[#116D6E] font-bold">{qtyInBill}x</strong>
                                            </span>
                                            <span className="font-bold text-[#321E1E]">
                                              Bill: ₹{order.totalAmount.toLocaleString('en-IN')}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* View Slip & Download Slip Actions */}
                                      <div className="pt-3 mt-2 border-t border-[#4E3636]/10 flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setActiveReceiptSlipOrder(order)}
                                          className="flex-1 py-1.5 px-2 bg-white hover:bg-[#116D6E]/10 border border-[#116D6E] text-[#116D6E] rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
                                          title="View 80mm Thermal Receipt Slip"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                          <span>View Slip</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleDownloadSingleSlip(order)}
                                          className="flex-1 py-1.5 px-2 bg-[#116D6E] hover:bg-[#0e5859] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
                                          title="Download Official Slip (HTML)"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                          <span>Download</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-xs text-[#4E3636]/70 italic py-2">
                                  No individual customer bills matched for this product today yet. Counter orders placed from POS will automatically show here!
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* View Mode 2: All Today's Bills Ledger with 1-Click View & Download for Every Sale */}
        {matrixViewMode === 'bills' && (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-10 bg-[#FDFBF7] shadow-xs">
                <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7] text-[#4E3636]">
                  <th className="py-3 px-5 font-bold uppercase tracking-wider bg-[#FDFBF7]">Bill #</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider bg-[#FDFBF7]">Date &amp; Time</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider bg-[#FDFBF7]">Customer</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider bg-[#FDFBF7]">Items Purchased</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider bg-[#FDFBF7]">Order Type</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-right bg-[#FDFBF7]">Amount</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-center bg-[#FDFBF7]">Tender</th>
                  <th className="py-3 px-5 font-bold uppercase tracking-wider text-center bg-[#FDFBF7]">Slip Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4E3636]/10">
                {todayOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FDFBF7]/60 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-[#116D6E]">
                      {ord.id}
                    </td>
                    <td className="py-3.5 px-4 text-[#4E3636] whitespace-nowrap">
                      {ord.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#321E1E]">
                      {ord.customer}
                    </td>
                    <td className="py-3.5 px-4 text-[#4E3636] max-w-xs truncate">
                      {ord.itemsList ? ord.itemsList.join(', ') : ord.items}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDFBF7] text-[#4E3636] border border-[#4E3636]/15">
                        {ord.type || 'Counter'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-[#321E1E]">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {ord.type === 'Takeaway' ? 'UPI' : ord.type === 'Dine-in' ? 'CASH' : 'CARD'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveReceiptSlipOrder(ord)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#116D6E] text-[#116D6E] hover:bg-[#116D6E]/10 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
                          title="View Slip"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadSingleSlip(ord)}
                          className="p-1 rounded-lg bg-[#116D6E] hover:bg-[#0e5859] text-white transition-all cursor-pointer active:scale-95 shadow-2xs"
                          title="Download Slip (HTML)"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Lower Section: Payment Tender Reconciliation (Left) & GSTR-1 Tax Ledger (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 cols): Payment Tender Audit & Bank Reconciliation */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#116D6E]" />
                <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                  Payment Tender Reconciliation
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                100% Audited
              </span>
            </div>
            <p className="text-xs text-[#4E3636] mb-4">
              Electronic UPI vs. Counter Cash vs. Card settlement distribution
            </p>

            {/* Total Reconciled Summary Box */}
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#4E3636]">
                  Total Reconciled Tender
                </span>
                <div className="text-2xl font-extrabold text-[#321E1E] mt-0.5">
                  ₹2,54,200
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-[#116D6E] bg-[#116D6E]/10 px-2.5 py-1 rounded-md">
                  995 Transactions
                </span>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                  100% Reconciled
                </div>
              </div>
            </div>

            {/* Proportional Segmented Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] text-[#4E3636] font-semibold mb-1.5">
                <span>Tender Split</span>
                <span>UPI {PAYMENT_TENDER_AUDIT[0]?.percentage} &bull; Cash {PAYMENT_TENDER_AUDIT[1]?.percentage}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#4E3636]/10 flex overflow-hidden p-0.5 gap-0.5 bg-[#FDFBF7] border border-[#4E3636]/15">
                {PAYMENT_TENDER_AUDIT.map((item) => (
                  <div
                    key={item.method}
                    style={{ width: item.percentage, backgroundColor: item.color }}
                    className="h-full rounded-xs transition-all"
                    title={`${item.method}: ${item.percentage} (₹${item.amount.toLocaleString('en-IN')})`}
                  />
                ))}
              </div>
            </div>

            {/* Itemized Tender Rows */}
            <div className="space-y-2.5 pt-2 border-t border-[#4E3636]/10 text-xs">
              {PAYMENT_TENDER_AUDIT.map((item) => (
                <div
                  key={item.method}
                  className="p-2.5 rounded-xl bg-[#FDFBF7]/60 border border-[#4E3636]/10 hover:border-[#116D6E]/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-[#321E1E]">{item.method}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#321E1E]">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-[#4E3636] ml-1.5 font-bold">
                        ({item.percentage})
                      </span>
                    </div>
                  </div>
                  {/* Mini Progress Bar & Order Count */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-[#4E3636]/10 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: item.percentage, backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-[10px] text-[#4E3636] shrink-0 font-medium">
                      {item.count} settlements
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#4E3636]/10 text-[11px] text-[#4E3636] flex items-center justify-between">
            <span>Bank Deposit Status:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Matched with Bank Account</span>
            </span>
          </div>
        </div>

        {/* Right (7 cols): GSTR-1 Tax Liability Summary Ledger */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#CD1818]" />
                <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                  GSTR-1 Tax Liability Summary Ledger
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#CD1818]/10 text-[#CD1818] border border-[#CD1818]/20">
                GST Ready
              </span>
            </div>
            <p className="text-xs text-[#4E3636] mb-4">
              Slab-wise taxable turnover and CGST/SGST collected for government tax filing
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7] text-[#4E3636]">
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">GST Slab</th>
                    <th className="py-2.5 px-2 font-bold uppercase tracking-wider">HSN</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Taxable Sales</th>
                    <th className="py-2.5 px-2.5 font-bold uppercase tracking-wider text-right">CGST</th>
                    <th className="py-2.5 px-2.5 font-bold uppercase tracking-wider text-right">SGST</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Total Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4E3636]/10">
                  {GST_SLAB_AUDIT_DATA.map((row) => (
                    <tr key={row.slab} className="hover:bg-[#FDFBF7]/60">
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#321E1E] block">{row.slab}</span>
                        <span className="text-[10px] text-[#4E3636] block line-clamp-1">{row.description}</span>
                      </td>
                      <td className="py-3 px-2 font-mono text-[11px] text-[#4E3636]">{row.hsn}</td>
                      <td className="py-3 px-3 text-right font-semibold text-[#321E1E]">
                        ₹{row.taxableValue.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2.5 text-right text-[#4E3636]">
                        ₹{row.cgst.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2.5 text-right text-[#4E3636]">
                        ₹{row.sgst.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-[#CD1818]">
                        ₹{row.totalTax.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-[#116D6E]/5 font-bold text-[#116D6E] border-t-2 border-[#116D6E]/30">
                    <td className="py-3 px-3" colSpan={2}>
                      TOTAL LIABILITY PAYABLE
                    </td>
                    <td className="py-3 px-3 text-right">
                      ₹{totalTaxableTurnover.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2.5 text-right">
                      ₹{(totalGSTTax / 2).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2.5 text-right">
                      ₹{(totalGSTTax / 2).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-[#CD1818] font-extrabold text-sm">
                      ₹{totalGSTTax.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#4E3636]/10 flex flex-wrap items-center justify-between text-[11px] text-[#4E3636] gap-2">
            <span>Prepared according to Indian GST Composite and Regular Scheme</span>
            <button
              type="button"
              onClick={handleDownloadGST}
              className="text-[#116D6E] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Export GSTR-1 File (CSV)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Tab 3: GSTR-1 Tax Ledger Only */}
      {activeTab === 'GST' && (
        <div className="space-y-6">
          {/* Lower Section: Payment Tender Reconciliation & GSTR-1 Tax Ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left (5 cols): Payment Tender Audit */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#116D6E]" />
                    <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                      Payment Tender Reconciliation
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    100% Audited
                  </span>
                </div>
                <p className="text-xs text-[#4E3636] mb-4">
                  Electronic UPI vs. Counter Cash vs. Card settlement distribution
                </p>

                {/* Total Reconciled Summary Box */}
                <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#4E3636]">
                      Total Reconciled Tender
                    </span>
                    <div className="text-2xl font-extrabold text-[#321E1E] mt-0.5">
                      ₹2,54,200
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-[#116D6E] bg-[#116D6E]/10 px-2.5 py-1 rounded-md">
                      995 Transactions
                    </span>
                  </div>
                </div>

                {/* Proportional Segmented Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] text-[#4E3636] font-semibold mb-1.5">
                    <span>Tender Split</span>
                    <span>UPI {PAYMENT_TENDER_AUDIT[0]?.percentage} &bull; Cash {PAYMENT_TENDER_AUDIT[1]?.percentage}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-[#4E3636]/10 flex overflow-hidden p-0.5 gap-0.5 bg-[#FDFBF7] border border-[#4E3636]/15">
                    {PAYMENT_TENDER_AUDIT.map((item) => (
                      <div
                        key={item.method}
                        style={{ width: item.percentage, backgroundColor: item.color }}
                        className="h-full rounded-xs transition-all"
                        title={`${item.method}: ${item.percentage}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Itemized Tender Rows */}
                <div className="space-y-2.5 pt-2 border-t border-[#4E3636]/10 text-xs">
                  {PAYMENT_TENDER_AUDIT.map((item) => (
                    <div
                      key={item.method}
                      className="p-2.5 rounded-xl bg-[#FDFBF7]/60 border border-[#4E3636]/10 hover:border-[#116D6E]/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-semibold text-[#321E1E]">{item.method}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#321E1E]">
                            ₹{item.amount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-[#4E3636] ml-1.5 font-bold">
                            ({item.percentage})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right (7 cols): GSTR-1 Tax Liability Summary Ledger */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#4E3636]/15 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-[#CD1818]" />
                    <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                      GSTR-1 Tax Liability Summary Ledger
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#CD1818]/10 text-[#CD1818] border border-[#CD1818]/20">
                    GST Ready
                  </span>
                </div>
                <p className="text-xs text-[#4E3636] mb-4">
                  Slab-wise taxable turnover and CGST/SGST collected for government tax filing
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7] text-[#4E3636]">
                        <th className="py-2.5 px-3 font-bold uppercase tracking-wider">GST Slab</th>
                        <th className="py-2.5 px-2 font-bold uppercase tracking-wider">HSN</th>
                        <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Taxable Sales</th>
                        <th className="py-2.5 px-2.5 font-bold uppercase tracking-wider text-right">CGST</th>
                        <th className="py-2.5 px-2.5 font-bold uppercase tracking-wider text-right">SGST</th>
                        <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">Total Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#4E3636]/10">
                      {GST_SLAB_AUDIT_DATA.map((row) => (
                        <tr key={row.slab} className="hover:bg-[#FDFBF7]/60">
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#321E1E] block">{row.slab}</span>
                            <span className="text-[10px] text-[#4E3636] block line-clamp-1">{row.description}</span>
                          </td>
                          <td className="py-3 px-2 font-mono text-[11px] text-[#4E3636]">{row.hsn}</td>
                          <td className="py-3 px-3 text-right font-semibold text-[#321E1E]">
                            ₹{row.taxableValue.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-2.5 text-right text-[#4E3636]">
                            ₹{row.cgst.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-2.5 text-right text-[#4E3636]">
                            ₹{row.sgst.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-[#CD1818]">
                            ₹{row.totalTax.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#4E3636]/10 flex flex-wrap items-center justify-between text-[11px] text-[#4E3636] gap-2">
                <span>Prepared according to Indian GST Composite and Regular Scheme</span>
                <button
                  type="button"
                  onClick={handleDownloadGST}
                  className="text-[#116D6E] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Export GSTR-1 File (CSV)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Slip Modal (80mm Thermal Slip Preview & Print/Download) */}
      {activeReceiptSlipOrder && (
        <ReceiptModal
          isOpen={Boolean(activeReceiptSlipOrder)}
          onClose={() => setActiveReceiptSlipOrder(null)}
          billData={formatBillData(activeReceiptSlipOrder)}
        />
      )}
    </div>
  );
};

export default AdminReports;
