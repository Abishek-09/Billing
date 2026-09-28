import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Award,
  Calendar,
  X,
  ShoppingBag,
  Download,
  FileText,
  TrendingUp,
  DollarSign,
  Printer,
  CheckCircle2,
  Users,
  Eye,
  ArrowDownToLine,
  Sparkles,
  Zap
} from 'lucide-react';
import { ALL_CUSTOMERS_DATA, ALL_ORDERS_DATA } from '../../data/adminMockData';

// Historical base customer metrics for baseline demonstration
const BASELINE_METRICS = {
  'cust-1': { // Anita Sharma
    Daily: { orders: 2, spend: 1480, lastActive: '26 Sep 2026, 11:20 AM' },
    Weekly: { orders: 6, spend: 5420, lastActive: '26 Sep 2026, 11:20 AM' },
    Monthly: { orders: 18, spend: 14200, lastActive: '26 Sep 2026, 11:20 AM' },
    Yearly: { orders: 32, spend: 24850, lastActive: '26 Sep 2026, 11:20 AM' },
  },
  'cust-2': { // Dr. Vikram Seth
    Daily: { orders: 1, spend: 945, lastActive: '26 Sep 2026, 01:15 PM' },
    Weekly: { orders: 4, spend: 3850, lastActive: '26 Sep 2026, 01:15 PM' },
    Monthly: { orders: 11, spend: 8900, lastActive: '26 Sep 2026, 01:15 PM' },
    Yearly: { orders: 18, spend: 14200, lastActive: '26 Sep 2026, 01:15 PM' },
  },
  'cust-3': { // Pooja Patel
    Daily: { orders: 0, spend: 0, lastActive: '25 Sep 2026, 04:30 PM' },
    Weekly: { orders: 5, spend: 4200, lastActive: '25 Sep 2026, 04:30 PM' },
    Monthly: { orders: 14, spend: 11300, lastActive: '25 Sep 2026, 04:30 PM' },
    Yearly: { orders: 28, spend: 19650, lastActive: '25 Sep 2026, 04:30 PM' },
  },
  'cust-4': { // Rahul Verma
    Daily: { orders: 1, spend: 290, lastActive: '26 Sep 2026, 02:40 PM' },
    Weekly: { orders: 3, spend: 1850, lastActive: '26 Sep 2026, 02:40 PM' },
    Monthly: { orders: 7, spend: 4800, lastActive: '26 Sep 2026, 02:40 PM' },
    Yearly: { orders: 9, spend: 6450, lastActive: '26 Sep 2026, 02:40 PM' },
  },
  'cust-5': { // Cafe Bistro Downtown
    Daily: { orders: 3, spend: 4850, lastActive: '26 Sep 2026, 04:50 PM' },
    Weekly: { orders: 12, spend: 22400, lastActive: '26 Sep 2026, 04:50 PM' },
    Monthly: { orders: 34, spend: 62400, lastActive: '26 Sep 2026, 04:50 PM' },
    Yearly: { orders: 46, spend: 84200, lastActive: '26 Sep 2026, 04:50 PM' },
  },
  'cust-6': { // Elena Rostova
    Daily: { orders: 1, spend: 1460, lastActive: '26 Sep 2026, 05:42 PM' },
    Weekly: { orders: 4, spend: 4380, lastActive: '26 Sep 2026, 05:42 PM' },
    Monthly: { orders: 9, spend: 7850, lastActive: '26 Sep 2026, 05:42 PM' },
    Yearly: { orders: 14, spend: 11350, lastActive: '26 Sep 2026, 05:42 PM' },
  },
  'cust-7': { // Siddharth Rao
    Daily: { orders: 0, spend: 0, lastActive: '23 Sep 2026, 12:10 PM' },
    Weekly: { orders: 2, spend: 1680, lastActive: '23 Sep 2026, 12:10 PM' },
    Monthly: { orders: 5, spend: 3650, lastActive: '23 Sep 2026, 12:10 PM' },
    Yearly: { orders: 6, spend: 4120, lastActive: '23 Sep 2026, 12:10 PM' },
  },
};

export const AdminCustomers = () => {
  const [reportPeriod, setReportPeriod] = useState('Daily'); // 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [salesSyncVersion, setSalesSyncVersion] = useState(0);

  const itemsPerPage = 6;
  const REPORT_PERIODS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Re-sync with sales on storage changes (e.g. checkout completed in POS)
  useEffect(() => {
    const handleStorageChange = () => setSalesSyncVersion((v) => v + 1);
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Customer Ledger completely derived and updated by each and every sale made!
  const salesDerivedCustomers = useMemo(() => {
    // 1. Gather all sales from ALL_ORDERS_DATA and live POS orders in localStorage
    let allOrders = [...ALL_ORDERS_DATA];
    try {
      const saved = localStorage.getItem('sweetbite_pos_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const idSet = new Set(allOrders.map((o) => o.id || o.billNumber));
          for (const ord of parsed) {
            const key = ord.id || ord.billNumber;
            if (!idSet.has(key)) {
              allOrders.unshift(ord);
              idSet.add(key);
            }
          }
        }
      }
    } catch (e) {}

    // 2. Initialize customer registry with known profiles
    const customerMap = {};

    ALL_CUSTOMERS_DATA.forEach((base) => {
      const baseKey = base.name.toLowerCase().trim();
      customerMap[baseKey] = {
        id: base.id,
        name: base.name,
        avatar: base.avatar,
        email: base.email,
        phone: base.phone,
        joinedDate: base.joinedDate,
        lifetimeOrders: base.totalOrders,
        lifetimeSpendNum: parseInt(base.totalSpent.replace(/[^0-9]/g, ''), 10) || 0,
        dailyOrders: BASELINE_METRICS[base.id]?.Daily.orders || 0,
        dailySpend: BASELINE_METRICS[base.id]?.Daily.spend || 0,
        weeklyOrders: BASELINE_METRICS[base.id]?.Weekly.orders || 0,
        weeklySpend: BASELINE_METRICS[base.id]?.Weekly.spend || 0,
        monthlyOrders: BASELINE_METRICS[base.id]?.Monthly.orders || 0,
        monthlySpend: BASELINE_METRICS[base.id]?.Monthly.spend || 0,
        yearlyOrders: BASELINE_METRICS[base.id]?.Yearly.orders || 0,
        yearlySpend: BASELINE_METRICS[base.id]?.Yearly.spend || 0,
        lastActive: BASELINE_METRICS[base.id]?.Daily.lastActive || '26 Sep 2026',
        salesRecorded: [],
      };
    });

    // 3. Process every sale made in the bakery
    allOrders.forEach((order) => {
      const rawName = (order.customer || 'Walk-in Customer').trim();
      const lookupKey = rawName.toLowerCase();

      // If customer doesn't exist yet, automatically auto-register them from the sale!
      if (!customerMap[lookupKey]) {
        customerMap[lookupKey] = {
          id: `cust-${rawName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
          name: rawName,
          avatar: order.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          email: `${rawName.toLowerCase().replace(/\s+/g, '.')}@sweetbite.com`,
          phone: order.customerPhone || '—',
          joinedDate: 'Registered via POS Sale',
          lifetimeOrders: 0,
          lifetimeSpendNum: 0,
          dailyOrders: 0,
          dailySpend: 0,
          weeklyOrders: 0,
          weeklySpend: 0,
          monthlyOrders: 0,
          monthlySpend: 0,
          yearlyOrders: 0,
          yearlySpend: 0,
          lastActive: order.date || 'Today',
          salesRecorded: [],
        };
      }

      const target = customerMap[lookupKey];
      const amount = order.totalAmount || 0;
      target.salesRecorded.push(order);

      // If phone is provided on the order and missing on customer profile, populate it
      if (order.customerPhone && (!target.phone || target.phone === '—')) {
        target.phone = order.customerPhone;
      }

      // If order is new or made today
      const isTodayOrder = order.isNewToday || (order.date && order.date.includes('26 Sep'));
      if (order.isNewToday) {
        target.dailyOrders += 1;
        target.dailySpend += amount;
        target.weeklyOrders += 1;
        target.weeklySpend += amount;
        target.monthlyOrders += 1;
        target.monthlySpend += amount;
        target.yearlyOrders += 1;
        target.yearlySpend += amount;
        target.lifetimeOrders += 1;
        target.lifetimeSpendNum += amount;
        target.lastActive = order.date || 'Today';
      }
    });

    // 4. Calculate final period fields and dynamic loyalty tiers
    return Object.values(customerMap).map((cust) => {
      let periodOrders = 0;
      let periodSpend = 0;

      if (reportPeriod === 'Daily') {
        periodOrders = cust.dailyOrders;
        periodSpend = cust.dailySpend;
      } else if (reportPeriod === 'Weekly') {
        periodOrders = cust.weeklyOrders;
        periodSpend = cust.weeklySpend;
      } else if (reportPeriod === 'Monthly') {
        periodOrders = cust.monthlyOrders;
        periodSpend = cust.monthlySpend;
      } else {
        periodOrders = cust.yearlyOrders;
        periodSpend = cust.yearlySpend;
      }

      // Dynamic loyalty tier based on spend
      let loyaltyTier = 'Bronze';
      if (cust.lifetimeSpendNum >= 20000) {
        loyaltyTier = 'Gold';
      } else if (cust.lifetimeSpendNum >= 10000) {
        loyaltyTier = 'Silver';
      }

      const avgOrderValue = periodOrders > 0 ? Math.round(periodSpend / periodOrders) : 0;

      return {
        ...cust,
        periodOrders,
        periodSpend,
        avgOrderValue,
        loyaltyTier,
        totalSpent: `₹${cust.lifetimeSpendNum.toLocaleString('en-IN')}`,
        totalOrders: cust.lifetimeOrders,
      };
    });
  }, [reportPeriod, salesSyncVersion]);

  // Search filter across Name, Email, and Phone
  const filteredCustomers = useMemo(() => {
    return salesDerivedCustomers.filter((cust) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        cust.name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        cust.phone.toLowerCase().includes(q)
      );
    });
  }, [salesDerivedCustomers, searchQuery]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Aggregate Period Analytics
  const periodAnalytics = useMemo(() => {
    const activeInPeriod = salesDerivedCustomers.filter((c) => c.periodOrders > 0);
    const totalOrders = salesDerivedCustomers.reduce((sum, c) => sum + c.periodOrders, 0);
    const totalRevenue = salesDerivedCustomers.reduce((sum, c) => sum + c.periodSpend, 0);
    const avgSpend = activeInPeriod.length > 0 ? Math.round(totalRevenue / activeInPeriod.length) : 0;

    return {
      activeCount: activeInPeriod.length,
      totalOrders,
      totalRevenue,
      avgSpend,
    };
  }, [salesDerivedCustomers]);

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Gold':
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      case 'Silver':
        return 'bg-slate-100 text-slate-800 border border-slate-300';
      case 'Bronze':
        return 'bg-[#4E3636]/10 text-[#4E3636] border border-[#4E3636]/20';
      default:
        return 'bg-[#4E3636]/10 text-[#4E3636]';
    }
  };

  // Download Report CSV for Selected Timeframe (Daily, Weekly, Monthly, Yearly)
  const handleDownloadReport = (period = reportPeriod) => {
    const headers = [
      'Customer ID',
      'Customer Name',
      'Phone Number',
      'Email Address',
      'Loyalty Tier',
      `${period} Orders`,
      `${period} Total Spend (INR)`,
      'Average Order Value (INR)',
      'Lifetime Orders',
      'Lifetime Spend',
      'Last Active Timestamp',
      'Customer Origin'
    ];

    const rows = salesDerivedCustomers.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      c.loyaltyTier,
      c.periodOrders,
      c.periodSpend,
      c.avgOrderValue,
      c.totalOrders,
      `"${c.totalSpent}"`,
      `"${c.lastActive}"`,
      `"${c.joinedDate}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `# SweetBite Artisan Bakery - ${period.toUpperCase()} SALES-DRIVEN CUSTOMER REPORT`,
        `# Generated: ${new Date().toLocaleString('en-IN')}`,
        `# Total Active Patrons: ${periodAnalytics.activeCount}, Total Sales Orders: ${periodAnalytics.totalOrders}, Total Revenue: INR ${periodAnalytics.totalRevenue}`,
        '',
        headers.join(','),
        ...rows.map((row) => row.join(','))
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `SweetBite_${period}_Customer_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`${period} Customer Report exported successfully!`);
  };

  // Download Individual Customer Statement CSV
  const handleDownloadCustomerStatement = (cust) => {
    const headers = ['Field', 'Value'];
    const rows = [
      ['Customer ID', cust.id],
      ['Name', `"${cust.name}"`],
      ['Phone', `"${cust.phone}"`],
      ['Email', `"${cust.email}"`],
      ['Loyalty Tier', cust.loyaltyTier],
      ['Reporting Timeframe', reportPeriod],
      [`${reportPeriod} Orders`, cust.periodOrders],
      [`${reportPeriod} Spend`, `INR ${cust.periodSpend}`],
      ['Average Order Value', `INR ${cust.avgOrderValue}`],
      ['Lifetime Total Orders', cust.totalOrders],
      ['Lifetime Total Spend', cust.totalSpent],
      ['Account Status', cust.joinedDate],
      ['Last Active Sale', cust.lastActive]
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `# SweetBite - Statement for ${cust.name}`,
        headers.join(','),
        ...rows.map((r) => r.join(','))
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `SweetBite_Customer_${cust.name.replace(/\s+/g, '_')}_${reportPeriod}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Statement for "${cust.name}" downloaded.`);
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

      {/* Top Header & Report Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-[#321E1E]">Customer Directory &amp; Sales Reports</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20">
              <Zap className="w-3 h-3 text-[#116D6E]" />
              <span>Auto-Populated from Sales</span>
            </span>
          </div>
          <p className="text-xs text-[#4E3636] mt-0.5">
            Every customer profile and visit frequency is dynamically recorded from each and every sale made at the register
          </p>
        </div>

        {/* Action Buttons: View Full Report, Download Report CSV */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-[#116D6E]/30 bg-white text-[#116D6E] hover:bg-[#116D6E]/5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <FileText className="w-4 h-4 text-[#116D6E]" />
            <span>View Full Report</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownloadReport(reportPeriod)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#116D6E] hover:bg-[#0e5859] text-white transition-all shadow-teal cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download {reportPeriod} Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* Report Timeframe Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4E3636] flex items-center gap-1.5 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-[#116D6E]" />
            <span>Report Timeframe:</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {REPORT_PERIODS.map((period) => {
              const isActive = reportPeriod === period;
              return (
                <button
                  key={period}
                  onClick={() => {
                    setReportPeriod(period);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-[#116D6E] text-white shadow-teal'
                      : 'bg-[#FDFBF7] text-[#321E1E] hover:bg-white border border-[#4E3636]/15'
                  }`}
                >
                  {period} Report
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-[#4E3636] font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Reflecting customer sales for <strong>{reportPeriod}</strong> ({
              reportPeriod === 'Daily' ? 'Today, 26 Sep 2026' :
              reportPeriod === 'Weekly' ? 'Week of 20-26 Sep 2026' :
              reportPeriod === 'Monthly' ? 'September 2026' : 'Year to Date 2026'
            })
          </span>
        </div>
      </div>

      {/* Period Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">{reportPeriod} Active Patrons</span>
            <div className="w-8 h-8 rounded-lg bg-[#116D6E]/10 flex items-center justify-center text-[#116D6E]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#321E1E] mt-2">
            {periodAnalytics.activeCount} <span className="text-xs font-medium text-[#4E3636]">/ {salesDerivedCustomers.length}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">Purchased in {reportPeriod.toLowerCase()} period</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">{reportPeriod} Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#4E3636]/10 flex items-center justify-center text-[#4E3636]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#116D6E] mt-2">
            {periodAnalytics.totalOrders} Bills
          </div>
          <span className="text-[10px] text-[#4E3636] font-medium block mt-0.5">Auto-tallied from POS register sales</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">{reportPeriod} Customer Sales</span>
            <div className="w-8 h-8 rounded-lg bg-[#CD1818]/10 flex items-center justify-center text-[#CD1818]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#CD1818] mt-2">
            ₹{periodAnalytics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#4E3636] font-medium block mt-0.5">Gross revenue from patrons</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">Avg Spend / Patron</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">
            ₹{periodAnalytics.avgSpend.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#4E3636] font-medium block mt-0.5">Average ticket per customer</span>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#4E3636]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search customer by name, email, or mobile number..."
            className="w-full bg-[#FDFBF7] text-[#321E1E] text-xs pl-10 pr-8 py-2.5 rounded-xl border border-[#4E3636]/20 placeholder-[#4E3636]/50 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E3636]/60 hover:text-[#321E1E]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#4E3636]">
            Showing <strong>{filteredCustomers.length}</strong> sales-recorded customers
          </span>
        </div>
      </div>

      {/* Data Table: White background, rounded-xl, soft shadow */}
      <div className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#FDFBF7] shadow-xs">
              <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7] text-[#4E3636] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5 bg-[#FDFBF7]">Customer Profile</th>
                <th className="py-3 px-4 bg-[#FDFBF7]">Contact Details</th>
                <th className="py-3 px-4 bg-[#FDFBF7]">{reportPeriod} Orders</th>
                <th className="py-3 px-4 bg-[#FDFBF7]">{reportPeriod} Spend</th>
                <th className="py-3 px-4 bg-[#FDFBF7]">Avg Ticket</th>
                <th className="py-3 px-4 bg-[#FDFBF7]">Loyalty Tier</th>
                <th className="py-3 px-4 bg-[#FDFBF7]">Lifetime Spend</th>
                <th className="py-3 px-5 text-right bg-[#FDFBF7]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4E3636]/10 text-xs">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-[#FDFBF7]/70 transition-colors group"
                  >
                    {/* Customer Name with avatar circle */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#4E3636]/15 bg-white shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#321E1E]">
                            {cust.name}
                          </div>
                          <div className="text-[10px] text-[#4E3636]/70">
                            {cust.joinedDate}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info (Email / Phone) */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[#321E1E]">
                          <Mail className="w-3 h-3 text-[#4E3636]/60" />
                          <span>{cust.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#4E3636] font-mono">
                          <Phone className="w-3 h-3 text-[#4E3636]/60" />
                          <span>{cust.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Period Orders */}
                    <td className="py-3.5 px-4 font-bold text-[#321E1E]">
                      <span className="px-2 py-0.5 rounded-md bg-[#116D6E]/10 text-[#116D6E]">
                        {cust.periodOrders} {cust.periodOrders === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    {/* Period Spend */}
                    <td className="py-3.5 px-4 font-extrabold text-[#CD1818]">
                      ₹{cust.periodSpend?.toLocaleString('en-IN')}
                    </td>

                    {/* Avg Order Value */}
                    <td className="py-3.5 px-4 text-[#4E3636] font-medium">
                      ₹{cust.avgOrderValue?.toLocaleString('en-IN')}
                    </td>

                    {/* Loyalty Tier */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getTierBadge(
                          cust.loyaltyTier
                        )}`}
                      >
                        {cust.loyaltyTier}
                      </span>
                    </td>

                    {/* Lifetime Total */}
                    <td className="py-3.5 px-4 text-[#4E3636]">
                      <div className="font-semibold text-[#321E1E]">{cust.totalSpent}</div>
                      <div className="text-[10px] text-[#4E3636]/70">{cust.totalOrders} total sales</div>
                    </td>

                    {/* Actions: View Profile & Download Statement */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-2.5 py-1 text-[#116D6E] hover:bg-[#116D6E]/10 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        >
                          View Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadCustomerStatement(cust)}
                          title={`Download ${cust.name}'s statement`}
                          className="p-1.5 text-[#4E3636] hover:bg-[#4E3636]/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <ArrowDownToLine className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#4E3636]/60">
                    No customers found matching &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination: Bottom right */}
        <div className="p-4 px-5 bg-[#FDFBF7]/40 border-t border-[#4E3636]/10 flex items-center justify-between text-xs text-[#4E3636]">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of{' '}
            {filteredCustomers.length} registered patrons
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

      {/* Customer Full Performance Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-[#116D6E] p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-white" />
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight">
                    {reportPeriod} Customer Performance Report
                  </h3>
                  <p className="text-xs text-white/80">
                    Auto-generated from every sale transaction settled at the bakery
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-[#321E1E]">
              {/* Report Timeframe Switcher Tabs inside Modal */}
              <div className="flex items-center justify-between bg-[#FDFBF7] p-2 rounded-xl border border-[#4E3636]/15">
                <span className="font-bold text-[#4E3636] text-[11px] px-2">Report Period:</span>
                <div className="flex gap-1">
                  {REPORT_PERIODS.map((period) => (
                    <button
                      key={period}
                      onClick={() => setReportPeriod(period)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        reportPeriod === period
                          ? 'bg-[#116D6E] text-white shadow-xs'
                          : 'text-[#4E3636] hover:bg-white'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 text-center">
                  <span className="text-[11px] text-[#4E3636]">Active Patrons</span>
                  <div className="text-xl font-extrabold text-[#321E1E] mt-1">{periodAnalytics.activeCount}</div>
                </div>
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 text-center">
                  <span className="text-[11px] text-[#4E3636]">Period Orders</span>
                  <div className="text-xl font-extrabold text-[#116D6E] mt-1">{periodAnalytics.totalOrders}</div>
                </div>
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 text-center">
                  <span className="text-[11px] text-[#4E3636]">Period Spend</span>
                  <div className="text-xl font-extrabold text-[#CD1818] mt-1">₹{periodAnalytics.totalRevenue.toLocaleString('en-IN')}</div>
                </div>
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 text-center">
                  <span className="text-[11px] text-[#4E3636]">Avg Ticket</span>
                  <div className="text-xl font-extrabold text-emerald-700 mt-1">₹{periodAnalytics.avgSpend.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Top 5 High-Value Spenders */}
              <div>
                <h4 className="font-serif font-bold text-sm text-[#321E1E] mb-2.5 flex items-center justify-between">
                  <span>Top High-Value Patrons in {reportPeriod}</span>
                  <span className="text-[11px] text-[#4E3636] font-normal">Ranked by actual sales spend</span>
                </h4>
                <div className="border border-[#4E3636]/10 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FDFBF7] border-b border-[#4E3636]/10 text-[#4E3636] font-bold">
                      <tr>
                        <th className="py-2 px-3">Customer</th>
                        <th className="py-2 px-3">Tier</th>
                        <th className="py-2 px-3">Orders</th>
                        <th className="py-2 px-3 text-right">Spend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#4E3636]/10">
                      {[...salesDerivedCustomers]
                        .sort((a, b) => b.periodSpend - a.periodSpend)
                        .slice(0, 5)
                        .map((c, i) => (
                          <tr key={c.id} className="hover:bg-[#FDFBF7]/50">
                            <td className="py-2 px-3 flex items-center gap-2">
                              <span className="font-bold text-[#116D6E] w-4">{i + 1}.</span>
                              <span className="font-semibold text-[#321E1E]">{c.name}</span>
                            </td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getTierBadge(c.loyaltyTier)}`}>
                                {c.loyaltyTier}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-[#4E3636]">{c.periodOrders} orders</td>
                            <td className="py-2 px-3 text-right font-bold text-[#CD1818]">
                              ₹{c.periodSpend.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Report Footer Actions */}
              <div className="pt-3 border-t border-[#4E3636]/15 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-[#4E3636]/20 bg-white hover:bg-[#FDFBF7] text-[#321E1E] rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadReport(reportPeriod)}
                    className="px-4 py-2 bg-[#116D6E] hover:bg-[#0e5859] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-teal text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 bg-white border border-[#4E3636]/20 text-[#4E3636] rounded-xl font-semibold hover:bg-[#FDFBF7] cursor-pointer text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Profile View Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#116D6E] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/40"
                />
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight">
                    {selectedCustomer.name}
                  </h3>
                  <span className={`inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold ${getTierBadge(selectedCustomer.loyaltyTier)}`}>
                    {selectedCustomer.loyaltyTier} Member
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10">
                  <span className="text-[#4E3636]">{reportPeriod} Spend</span>
                  <div className="text-lg font-bold text-[#CD1818] mt-0.5">
                    ₹{selectedCustomer.periodSpend?.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10">
                  <span className="text-[#4E3636]">{reportPeriod} Orders</span>
                  <div className="text-lg font-bold text-[#116D6E] mt-0.5">
                    {selectedCustomer.periodOrders} orders
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between py-1.5 border-b border-[#4E3636]/10">
                  <span className="text-[#4E3636]">Lifetime Total Spend:</span>
                  <span className="font-bold text-[#321E1E]">{selectedCustomer.totalSpent}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#4E3636]/10">
                  <span className="text-[#4E3636]">Lifetime Total Orders:</span>
                  <span className="font-medium text-[#321E1E]">{selectedCustomer.totalOrders} visits</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#4E3636]/10">
                  <span className="text-[#4E3636]">Email:</span>
                  <span className="font-medium text-[#321E1E]">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#4E3636]/10">
                  <span className="text-[#4E3636]">Phone:</span>
                  <span className="font-medium text-[#321E1E] font-mono">{selectedCustomer.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#4E3636]/10">
                  <span className="text-[#4E3636]">Account Origin:</span>
                  <span className="font-medium text-[#321E1E]">{selectedCustomer.joinedDate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#4E3636]/10">
                  <span className="text-[#4E3636]">Last Active Sale:</span>
                  <span className="font-semibold text-[#116D6E]">{selectedCustomer.lastActive}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadCustomerStatement(selectedCustomer)}
                  className="flex-1 py-2.5 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Statement</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#4E3636]/20 bg-white text-[#4E3636] font-semibold hover:bg-[#FDFBF7] transition-colors cursor-pointer"
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

export default AdminCustomers;
