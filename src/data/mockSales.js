/**
 * Mock Sales Transactions for Bakery POS & Financial Auditing
 * Raw line-item sales records (no precomputed profit or GST).
 * Multiple sales of the same product occur across different bills.
 */

// Helper to format local date string YYYY-MM-DD
const formatDateString = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const now = new Date();
const todayStr = formatDateString(now);

const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = formatDateString(yesterday);

const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const twoDaysAgoStr = formatDateString(twoDaysAgo);

export const mockSales = [
  // ==========================================
  // TODAY'S SALES TRANSACTIONS
  // ==========================================
  // Bill #SB-1040 (Morning 09:15 AM)
  { id: 'tx-101', billId: 'SB-1040', productId: 'prod-9', quantity: 4, date: todayStr, time: '09:15 AM', paymentMethod: 'UPI' },
  { id: 'tx-102', billId: 'SB-1040', productId: 'prod-16', quantity: 2, date: todayStr, time: '09:15 AM', paymentMethod: 'UPI' },
  { id: 'tx-103', billId: 'SB-1040', productId: 'prod-5', quantity: 1, date: todayStr, time: '09:18 AM', paymentMethod: 'UPI' },

  // Bill #SB-1041 (Mid-Morning 10:45 AM)
  { id: 'tx-104', billId: 'SB-1041', productId: 'prod-1', quantity: 2, date: todayStr, time: '10:45 AM', paymentMethod: 'CARD' },
  { id: 'tx-105', billId: 'SB-1041', productId: 'prod-10', quantity: 3, date: todayStr, time: '10:46 AM', paymentMethod: 'CARD' },
  { id: 'tx-106', billId: 'SB-1041', productId: 'prod-9', quantity: 5, date: todayStr, time: '10:48 AM', paymentMethod: 'CARD' },

  // Bill #SB-1042 (Lunch Rush 12:30 PM)
  { id: 'tx-107', billId: 'SB-1042', productId: 'prod-6', quantity: 3, date: todayStr, time: '12:30 PM', paymentMethod: 'CASH' },
  { id: 'tx-108', billId: 'SB-1042', productId: 'prod-2', quantity: 1, date: todayStr, time: '12:32 PM', paymentMethod: 'CASH' },
  { id: 'tx-109', billId: 'SB-1042', productId: 'prod-13', quantity: 6, date: todayStr, time: '12:35 PM', paymentMethod: 'CASH' },
  { id: 'tx-110', billId: 'SB-1042', productId: 'prod-17', quantity: 2, date: todayStr, time: '12:36 PM', paymentMethod: 'CASH' },

  // Bill #SB-1043 (Afternoon 02:40 PM)
  { id: 'tx-111', billId: 'SB-1043', productId: 'prod-9', quantity: 6, date: todayStr, time: '02:40 PM', paymentMethod: 'UPI' },
  { id: 'tx-112', billId: 'SB-1043', productId: 'prod-14', quantity: 2, date: todayStr, time: '02:42 PM', paymentMethod: 'UPI' },
  { id: 'tx-113', billId: 'SB-1043', productId: 'prod-3', quantity: 1, date: todayStr, time: '02:44 PM', paymentMethod: 'UPI' },

  // Bill #SB-1044 (Evening Tea & Specials 05:10 PM)
  { id: 'tx-114', billId: 'SB-1044', productId: 'prod-10', quantity: 4, date: todayStr, time: '05:10 PM', paymentMethod: 'UPI' },
  { id: 'tx-115', billId: 'SB-1044', productId: 'prod-16', quantity: 3, date: todayStr, time: '05:12 PM', paymentMethod: 'UPI' },
  { id: 'tx-116', billId: 'SB-1044', productId: 'prod-18', quantity: 2, date: todayStr, time: '05:15 PM', paymentMethod: 'UPI' },
  { id: 'tx-117', billId: 'SB-1044', productId: 'prod-11', quantity: 2, date: todayStr, time: '05:18 PM', paymentMethod: 'UPI' },

  // Bill #SB-1045 (Evening Clearance & Promotion 06:45 PM)
  { id: 'tx-118', billId: 'SB-1045', productId: 'prod-19', quantity: 4, date: todayStr, time: '06:45 PM', paymentMethod: 'UPI' }, // Negative margin item!
  { id: 'tx-119', billId: 'SB-1045', productId: 'prod-20', quantity: 2, date: todayStr, time: '06:46 PM', paymentMethod: 'CASH' }, // Zero profit item!
  { id: 'tx-120', billId: 'SB-1045', productId: 'prod-9', quantity: 3, date: todayStr, time: '06:48 PM', paymentMethod: 'UPI' },
  { id: 'tx-121', billId: 'SB-1045', productId: 'prod-1', quantity: 1, date: todayStr, time: '06:50 PM', paymentMethod: 'CARD' },

  // ==========================================
  // YESTERDAY'S SALES TRANSACTIONS
  // ==========================================
  { id: 'tx-080', billId: 'SB-1028', productId: 'prod-1', quantity: 3, date: yesterdayStr, time: '11:15 AM', paymentMethod: 'CARD' },
  { id: 'tx-081', billId: 'SB-1028', productId: 'prod-9', quantity: 10, date: yesterdayStr, time: '11:18 AM', paymentMethod: 'CARD' },
  { id: 'tx-082', billId: 'SB-1029', productId: 'prod-5', quantity: 4, date: yesterdayStr, time: '01:20 PM', paymentMethod: 'CASH' },
  { id: 'tx-083', billId: 'SB-1029', productId: 'prod-6', quantity: 5, date: yesterdayStr, time: '01:22 PM', paymentMethod: 'CASH' },
  { id: 'tx-084', billId: 'SB-1030', productId: 'prod-2', quantity: 2, date: yesterdayStr, time: '03:40 PM', paymentMethod: 'UPI' },
  { id: 'tx-085', billId: 'SB-1030', productId: 'prod-10', quantity: 6, date: yesterdayStr, time: '03:45 PM', paymentMethod: 'UPI' },
  { id: 'tx-086', billId: 'SB-1031', productId: 'prod-16', quantity: 4, date: yesterdayStr, time: '05:10 PM', paymentMethod: 'UPI' },
  { id: 'tx-087', billId: 'SB-1031', productId: 'prod-14', quantity: 3, date: yesterdayStr, time: '05:15 PM', paymentMethod: 'CARD' },

  // ==========================================
  // TWO DAYS AGO TRANSACTIONS (FOR CUSTOM DATE TESTING)
  // ==========================================
  { id: 'tx-050', billId: 'SB-1015', productId: 'prod-1', quantity: 1, date: twoDaysAgoStr, time: '10:00 AM', paymentMethod: 'UPI' },
  { id: 'tx-051', billId: 'SB-1015', productId: 'prod-4', quantity: 2, date: twoDaysAgoStr, time: '10:05 AM', paymentMethod: 'UPI' },
  { id: 'tx-052', billId: 'SB-1016', productId: 'prod-9', quantity: 8, date: twoDaysAgoStr, time: '02:30 PM', paymentMethod: 'CASH' },
];

export { todayStr, yesterdayStr, twoDaysAgoStr };
