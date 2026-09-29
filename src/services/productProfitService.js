/**
 * Product Daily Profit Business Logic & Aggregation Service
 * 
 * Implements core accounting & taxation rules:
 * - GST/Unit = Selling Price * GST Rate / 100
 * - Selling + GST = Selling Price + GST/Unit
 * - Profit/Unit = Selling Price - Purchase Price (GST is NOT profit)
 * - Total Profit = Profit/Unit * Qty Sold
 * - Sales Before GST = Selling Price * Qty Sold
 * - Total GST = GST/Unit * Qty Sold
 * - Customer Collection = Sales Before GST + Total GST
 */

import { todayStr, yesterdayStr } from '../data/mockSales';

/**
 * Format any number as Indian Rupee (INR) currency string:
 * Positive: ₹1,450.00
 * Negative: -₹20.00
 * Zero / Missing: ₹0.00
 */
export const formatINR = (val, includeDecimals = true) => {
  if (val === null || val === undefined || isNaN(val)) {
    return '₹0.00';
  }
  const num = Number(val);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(absNum);

  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
};

/**
 * Pure calculation for an individual product item & quantity
 */
export const calculateProductRow = (product, salesData = 0) => {
  const buyPrice = Number(product.buyPrice) || 0;
  const sellingPrice = Number(product.sellingPrice) || 0;
  const gstRate = Number(product.gstRate) || 0;

  // Handle both number qty or { count, totalGrams }
  const qtyCount = typeof salesData === 'object' && salesData !== null
    ? (Number(salesData.count) || 0)
    : (Number(salesData) || 0);
  const totalGrams = typeof salesData === 'object' && salesData !== null
    ? (Number(salesData.totalGrams) || 0)
    : 0;

  if (product.sellingType === 'WEIGHT') {
    // If total grams sold from transactions: e.g. 1500g = 1.5 kg
    const kgSold = totalGrams > 0
      ? Number((totalGrams / 1000).toFixed(2))
      : qtyCount;

    const gstPerUnit = Number((sellingPrice * (gstRate / 100)).toFixed(2));
    const sellingPlusGst = Number((sellingPrice + gstPerUnit).toFixed(2));
    const profitPerUnit = Number((sellingPrice - buyPrice).toFixed(2));

    const salesBeforeGst = Number((sellingPrice * kgSold).toFixed(2));
    const totalGst = Number((salesBeforeGst * (gstRate / 100)).toFixed(2));
    const customerCollection = Number((salesBeforeGst + totalGst).toFixed(2));
    const totalProfit = Number((profitPerUnit * kgSold).toFixed(2));
    const marginPercent = sellingPrice > 0 
      ? Number(((profitPerUnit / sellingPrice) * 100).toFixed(1)) 
      : 0;

    const displayQuantity = `${kgSold} kg`;

    return {
      ...product,
      buyPrice,
      sellingPrice,
      gstRate,
      quantitySold: kgSold,
      displayQuantity,
      gstPerUnit,
      sellingPlusGst,
      profitPerUnit,
      salesBeforeGst,
      totalGst,
      customerCollection,
      totalProfit,
      marginPercent,
      isNegativeProfit: totalProfit < 0,
      isZeroProfit: totalProfit === 0 && kgSold > 0,
    };
  }

  // 1. GST/Unit = Selling Price * GST Rate / 100
  const gstPerUnit = Number((sellingPrice * (gstRate / 100)).toFixed(2));

  // 2. Selling + GST = Selling Price + GST/Unit
  const sellingPlusGst = Number((sellingPrice + gstPerUnit).toFixed(2));

  // 3. Profit/Unit = Selling Price - Purchase Price (Buy Price)
  // GST is collected on behalf of the government and is NOT profit
  const profitPerUnit = Number((sellingPrice - buyPrice).toFixed(2));

  // 4. Sales Before GST = Selling Price * Qty Sold
  const salesBeforeGst = Number((sellingPrice * qtyCount).toFixed(2));

  // 5. Total GST = GST/Unit * Qty Sold
  const totalGst = Number((gstPerUnit * qtyCount).toFixed(2));

  // 6. Customer Collection = Sales Before GST + Total GST = Selling + GST * Qty
  const customerCollection = Number((salesBeforeGst + totalGst).toFixed(2));

  // 7. Total Profit = Profit/Unit * Qty Sold
  const totalProfit = Number((profitPerUnit * qtyCount).toFixed(2));

  // 8. Profit Margin % = (Profit/Unit / Selling Price) * 100
  const marginPercent = sellingPrice > 0 
    ? Number(((profitPerUnit / sellingPrice) * 100).toFixed(1)) 
    : 0;

  return {
    ...product,
    buyPrice,
    sellingPrice,
    gstRate,
    quantitySold: qtyCount,
    displayQuantity: `${qtyCount}`,
    gstPerUnit,
    sellingPlusGst,
    profitPerUnit,
    salesBeforeGst,
    totalGst,
    customerCollection,
    totalProfit,
    marginPercent,
    isNegativeProfit: totalProfit < 0,
    isZeroProfit: totalProfit === 0 && qtyCount > 0,
  };
};

/**
 * Pull live orders from localStorage (POS Counter sales) if available
 * to ensure counter billing is instantly reflected in Admin Reports.
 */
export const getLivePosSalesTransactions = () => {
  const liveSales = [];
  try {
    const raw = localStorage.getItem('sweetbite_pos_orders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((order) => {
          const dateStr = order.date?.split(',')[0] || todayStr;
          // Normalize to YYYY-MM-DD if string contains today/sep etc.
          let resolvedDate = todayStr;
          if (order.isNewToday) {
            resolvedDate = todayStr;
          }

          if (Array.isArray(order.detailedItems)) {
            order.detailedItems.forEach((it, idx) => {
              liveSales.push({
                id: `live-${order.billNumber || order.id}-${idx}`,
                billId: order.billNumber || order.id,
                productId: it.productId || it.id,
                productName: it.name,
                quantity: Number(it.quantity || 1),
                grams: it.grams || null,
                displayWeight: it.displayWeight || null,
                sellingType: it.sellingType || 'PIECE',
                date: resolvedDate,
                time: order.date?.split(',')[1]?.trim() || 'Just now',
                paymentMethod: order.paymentMethod || 'UPI',
              });
            });
          }
        });
      }
    }
  } catch (err) {
    console.warn('Failed to parse localStorage POS orders for daily profit:', err);
  }
  return liveSales;
};

/**
 * Filter sales transactions matching the specified date filter
 */
export const filterSalesByDate = (sales = [], dateType = 'Today', customDate = '') => {
  const targetDate =
    dateType === 'Today'
      ? todayStr
      : dateType === 'Yesterday'
      ? yesterdayStr
      : customDate || todayStr;

  return sales.filter((s) => {
    if (!s.date) return false;
    return s.date === targetDate;
  });
};

/**
 * Aggregate sales quantities by productId for the filtered transactions
 */
export const aggregateQuantitiesByProduct = (filteredSales = [], products = []) => {
  const qtyMap = new Map();

  filteredSales.forEach((sale) => {
    let pId = sale.productId;

    // Fallback: match by product name if ID is missing or non-standard
    if (!pId && sale.productName) {
      const match = products.find(
        (p) => p.name.toLowerCase() === sale.productName.toLowerCase()
      );
      if (match) pId = match.id;
    }

    if (pId) {
      const existing = qtyMap.get(pId) || { count: 0, totalGrams: 0 };
      const saleQty = Number(sale.quantity || 0);
      const saleGrams = sale.grams ? Number(sale.grams) * saleQty : 0;
      qtyMap.set(pId, {
        count: existing.count + saleQty,
        totalGrams: existing.totalGrams + saleGrams,
      });
    }
  });

  return qtyMap;
};

/**
 * Main Aggregation Function:
 * Builds the complete daily profit report dataset with derived metrics,
 * filtering, and sorting applied.
 */
export const buildDailyProductProfitReport = ({
  products = [],
  sales = [],
  dateType = 'Today', // 'Today' | 'Yesterday' | 'Custom'
  customDate = '',
  categoryFilter = 'All',
  searchQuery = '',
  sortBy = 'totalProfit', // 'totalProfit' | 'name' | 'quantitySold' | 'salesBeforeGst' | 'totalGst'
  sortDirection = 'desc', // 'asc' | 'desc'
  includeZeroSales = false,
}) => {
  // 1. Merge static mockSales with any live POS counter transactions
  const livePosSales = getLivePosSalesTransactions();
  const allSales = [...sales, ...livePosSales];

  // 2. Filter sales for selected date
  const filteredSales = filterSalesByDate(allSales, dateType, customDate);

  // 3. Aggregate quantities per product
  const qtyMap = aggregateQuantitiesByProduct(filteredSales, products);

  // 4. Calculate individual product metrics
  let reportRows = products.map((prod) => {
    const qtySold = qtyMap.get(prod.id) || 0;
    return calculateProductRow(prod, qtySold);
  });

  // 5. Optionally filter out products with 0 sales for this date
  if (!includeZeroSales) {
    reportRows = reportRows.filter((r) => r.quantitySold > 0);
  }

  // 6. Category Filter
  if (categoryFilter && categoryFilter !== 'All') {
    reportRows = reportRows.filter(
      (r) => r.category?.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  // 7. Search Query Filter (matches Product Name or POS Code)
  const q = searchQuery.trim().toLowerCase();
  if (q) {
    reportRows = reportRows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.posCode && r.posCode.toLowerCase().includes(q)) ||
        (r.category && r.category.toLowerCase().includes(q))
    );
  }

  // 8. Sorting
  reportRows.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal || '').toLowerCase();
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    aVal = Number(aVal) || 0;
    bVal = Number(bVal) || 0;
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // 9. Assign dynamic rank after sorting
  reportRows = reportRows.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  // 10. Compute Summary Cards
  const summary = computeReportSummary(reportRows);

  const activeDateLabel =
    dateType === 'Today'
      ? `Today (${todayStr})`
      : dateType === 'Yesterday'
      ? `Yesterday (${yesterdayStr})`
      : `Custom Date (${customDate || todayStr})`;

  return {
    rows: reportRows,
    summary,
    activeDateLabel,
    totalTransactionsCount: filteredSales.length,
  };
};

/**
 * Summary Calculation: Dynamically derived from the active table rows
 */
export const computeReportSummary = (rows = []) => {
  const productsSold = rows.filter((r) => r.quantitySold > 0).length;
  const totalQuantity = rows.reduce((acc, r) => acc + (r.quantitySold || 0), 0);
  const salesBeforeGst = rows.reduce((acc, r) => acc + (r.salesBeforeGst || 0), 0);
  const totalGst = rows.reduce((acc, r) => acc + (r.totalGst || 0), 0);
  const customerCollection = rows.reduce((acc, r) => acc + (r.customerCollection || 0), 0);
  const totalProfit = rows.reduce((acc, r) => acc + (r.totalProfit || 0), 0);

  const overallMarginPercent =
    salesBeforeGst > 0
      ? Number(((totalProfit / salesBeforeGst) * 100).toFixed(1))
      : 0;

  return {
    productsSold,
    totalQuantity,
    salesBeforeGst: Number(salesBeforeGst.toFixed(2)),
    totalGst: Number(totalGst.toFixed(2)),
    customerCollection: Number(customerCollection.toFixed(2)),
    totalProfit: Number(totalProfit.toFixed(2)),
    overallMarginPercent,
    isNetLoss: totalProfit < 0,
  };
};

/**
 * Export filtered & sorted rows to standard CSV file
 */
export const exportDailyProfitToCSV = (rows = [], summary, activeDateLabel = '') => {
  const headers = [
    'Rank',
    'Product Name',
    'POS Code',
    'Category',
    'Buy Price (INR)',
    'Selling Price (INR)',
    'GST Rate (%)',
    'GST per Unit (INR)',
    'Selling + GST (INR)',
    'Qty Sold',
    'Sales Before GST (INR)',
    'Total GST (INR)',
    'Profit per Unit (INR)',
    'Total Profit (INR)',
    'Margin (%)',
  ];

  const dataRows = rows.map((r) => [
    `#${r.rank}`,
    `"${r.name}"`,
    `"${r.posCode || '—'}"`,
    `"${r.category}"`,
    r.buyPrice.toFixed(2),
    r.sellingPrice.toFixed(2),
    `${r.gstRate}%`,
    r.gstPerUnit.toFixed(2),
    r.sellingPlusGst.toFixed(2),
    r.quantitySold,
    r.salesBeforeGst.toFixed(2),
    r.totalGst.toFixed(2),
    r.profitPerUnit.toFixed(2),
    r.totalProfit.toFixed(2),
    `"${r.marginPercent}%"`,
  ]);

  // Append Total Summary Footer row
  const summaryRow = [
    'TOTAL AUDIT',
    'All Active Filtered Products',
    '—',
    '—',
    '—',
    '—',
    '—',
    '—',
    '—',
    summary.totalQuantity,
    summary.salesBeforeGst.toFixed(2),
    summary.totalGst.toFixed(2),
    '—',
    summary.totalProfit.toFixed(2),
    `"${summary.overallMarginPercent}%"`,
  ];

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [
      `# SweetBite Artisan Bakery - Product Daily Profit Report`,
      `# Audit Period: ${activeDateLabel}`,
      `# Generated On: ${new Date().toLocaleString('en-IN')}`,
      headers.join(','),
      ...dataRows.map((r) => r.join(',')),
      summaryRow.join(','),
    ].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  const filename = `SweetBite_Product_Daily_Profit_${activeDateLabel.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
