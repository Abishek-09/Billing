import React, { useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { mockProducts } from '../../../data/mockProducts';
import { mockSales, todayStr, yesterdayStr } from '../../../data/mockSales';
import {
  buildDailyProductProfitReport,
  exportDailyProfitToCSV,
} from '../../../services/productProfitService';
import DailyProfitHeader from './components/DailyProfitHeader';
import DailyProfitSummaryCards from './components/DailyProfitSummaryCards';
import DailyProfitFilters from './components/DailyProfitFilters';
import DailyProfitTable from './components/DailyProfitTable';
import DailyProfitEmptyState from './components/DailyProfitEmptyState';

export const ProductDailyProfitReport = () => {
  // 1. Date Selector State
  const [dateType, setDateType] = useState('Today'); // 'Today' | 'Yesterday' | 'Custom'
  const [customDate, setCustomDate] = useState(todayStr);

  // 2. Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [includeZeroSales, setIncludeZeroSales] = useState(false);

  // 3. Sorting State
  const [sortBy, setSortBy] = useState('totalProfit'); // Default: highest profit first
  const [sortDirection, setSortDirection] = useState('desc');

  // 4. Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 5. Aggregate & Calculate Derived State
  const { rows, summary, activeDateLabel, totalTransactionsCount } = useMemo(() => {
    return buildDailyProductProfitReport({
      products: mockProducts,
      sales: mockSales,
      dateType,
      customDate,
      categoryFilter: selectedCategory,
      searchQuery,
      sortBy,
      sortDirection,
      includeZeroSales,
    });
  }, [
    dateType,
    customDate,
    selectedCategory,
    searchQuery,
    sortBy,
    sortDirection,
    includeZeroSales,
  ]);

  // Handle Sort Change from Table Column Header
  const handleSortChange = (columnKey) => {
    if (sortBy === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(columnKey);
      setSortDirection(
        columnKey === 'name' || columnKey === 'category' || columnKey === 'posCode'
          ? 'asc'
          : 'desc'
      );
    }
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('totalProfit');
    setSortDirection('desc');
    setIncludeZeroSales(false);
    showToast('Filters reset to default.');
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    if (rows.length === 0) {
      showToast('No product rows available to export.');
      return;
    }
    exportDailyProfitToCSV(rows, summary, activeDateLabel);
    showToast(`Exported ${rows.length} product rows to CSV.`);
  };

  // Print Handler
  const handlePrintReport = () => {
    window.print();
  };

  const isFilterMismatch =
    rows.length === 0 &&
    (searchQuery.trim() !== '' || selectedCategory !== 'All');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-[#116D6E]/10 border border-[#116D6E]/20 text-[#116D6E] rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#116D6E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Date Selector & Export Actions */}
      <DailyProfitHeader
        dateType={dateType}
        setDateType={setDateType}
        customDate={customDate}
        setCustomDate={setCustomDate}
        onExportCSV={handleExportCSV}
        onPrintReport={handlePrintReport}
        totalTransactionsCount={totalTransactionsCount}
      />

      {/* 2. 6 Summary KPI Cards */}
      <DailyProfitSummaryCards summary={summary} />

      {/* 3. Filter & Sort Toolbar */}
      <DailyProfitFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        includeZeroSales={includeZeroSales}
        setIncludeZeroSales={setIncludeZeroSales}
        onResetFilters={handleResetFilters}
        resultCount={rows.length}
      />

      {/* 4. Data Table or Empty State */}
      {rows.length > 0 ? (
        <DailyProfitTable
          rows={rows}
          summary={summary}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
      ) : (
        <DailyProfitEmptyState
          isFilterMismatch={isFilterMismatch}
          onResetFilters={handleResetFilters}
          onSwitchToToday={() => {
            setDateType('Today');
            handleResetFilters();
          }}
          activeDateLabel={activeDateLabel}
        />
      )}
    </div>
  );
};

export default ProductDailyProfitReport;
