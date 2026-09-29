/**
 * Weight-Based Calculation Service
 * 
 * Implements strict accounting & financial precision for bakery products sold by weight.
 * Eliminates floating-point errors (e.g., ₹33.75, NOT 33.749999).
 * 
 * Formulas:
 * - sellingAmountBeforeGst = round2(sellingPrice * grams / 1000)
 * - gstAmount = round2(sellingAmountBeforeGst * gstRate / 100)
 * - customerAmount = round2(sellingAmountBeforeGst + gstAmount)
 * - profit = round2((sellingPrice - purchasePrice) * grams / 1000)
 * IMPORTANT: GST is NOT profit. Profit is derived exclusively from pre-GST price.
 */

/**
 * Strict 2-decimal financial rounding using Number.EPSILON
 */
export const round2 = (num) => {
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
};

/**
 * 1-decimal rounding for margins and percentages
 */
export const round1 = (num) => {
  return Math.round((Number(num) + Number.EPSILON) * 10) / 10;
};

/**
 * Format any number as Indian Rupee (INR) currency string
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
 * Normalizes any weight input (string or number, with or without unit) into integer grams.
 * Examples:
 * - normalizeWeightToGrams('0.75', 'kg') => 750
 * - normalizeWeightToGrams('750', 'g') => 750
 * - normalizeWeightToGrams('0.75 kg') => 750
 * - normalizeWeightToGrams('750g') => 750
 * - normalizeWeightToGrams(750) => 750
 */
export const normalizeWeightToGrams = (inputValue, unit = 'g') => {
  if (inputValue === null || inputValue === undefined || inputValue === '') {
    return 0;
  }

  if (typeof inputValue === 'string') {
    const cleanStr = inputValue.trim().toLowerCase();
    
    // Explicit kg in string
    if (cleanStr.includes('kg') || cleanStr.includes('kilo')) {
      const num = parseFloat(cleanStr.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : Math.round(num * 1000);
    }
    
    // Explicit g/gm/grams in string
    if (cleanStr.includes('g') || cleanStr.includes('gm')) {
      const num = parseFloat(cleanStr.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : Math.round(num);
    }

    const parsed = parseFloat(cleanStr);
    if (isNaN(parsed)) return 0;
    return unit === 'kg' ? Math.round(parsed * 1000) : Math.round(parsed);
  }

  const numVal = Number(inputValue);
  if (isNaN(numVal)) return 0;
  return unit === 'kg' ? Math.round(numVal * 1000) : Math.round(numVal);
};

/**
 * Core pricing calculation for a weight-based product portion
 */
export const calculateWeightPricing = ({
  sellingPricePerKg = 0,
  purchasePricePerKg = 0,
  gstRate = 5,
  grams = 0,
}) => {
  const g = Math.max(0, Number(grams) || 0);
  const sellPerKg = Math.max(0, Number(sellingPricePerKg) || 0);
  const buyPerKg = Math.max(0, Number(purchasePricePerKg) || 0);
  const taxRate = Math.max(0, Number(gstRate) || 0);

  // 1. sellingAmountBeforeGst = sellingPrice * grams / 1000
  const sellingAmountBeforeGst = round2((sellPerKg * g) / 1000);

  // 2. gstAmount = sellingAmountBeforeGst * gstRate / 100
  const gstAmount = round2((sellingAmountBeforeGst * taxRate) / 100);

  // 3. customerAmount = sellingAmountBeforeGst + gstAmount
  const customerAmount = round2(sellingAmountBeforeGst + gstAmount);

  // 4. profit = (sellingPrice - purchasePrice) * grams / 1000
  // GST is NOT profit; profit is computed strictly from pre-GST revenue
  const profit = round2(((sellPerKg - buyPerKg) * g) / 1000);

  // 5. marginPercent
  const marginPercent = sellingAmountBeforeGst > 0
    ? round1((profit / sellingAmountBeforeGst) * 100)
    : 0;

  return {
    grams: g,
    sellingAmountBeforeGst,
    gstRate: taxRate,
    gstAmount,
    customerAmount,
    profit,
    marginPercent,
    displayWeight: formatWeight(g),
  };
};

/**
 * Formats grams into clean bakery unit labels:
 * - 250 -> "250 g"
 * - 750 -> "750 g"
 * - 1000 -> "1 kg"
 * - 1500 -> "1.5 kg"
 * - 2250 -> "2.25 kg"
 */
export const formatWeight = (grams) => {
  const g = Math.max(0, Number(grams) || 0);
  if (g === 0) return '0 g';
  if (g < 1000) return `${g} g`;
  const kg = g / 1000;
  // Format kg nicely without trailing zeroes: e.g. 1.5 instead of 1.50
  const formattedKg = Number.isInteger(kg) ? kg.toString() : kg.toFixed(2).replace(/\.?0+$/, '');
  return `${formattedKg} kg`;
};

/**
 * Generates composite cart item ID to manage duplicate weights:
 * - PIECE: item ID matches product.id
 * - WEIGHT: item ID combines product ID and grams (e.g., 'prod-1_w750')
 * Different weights create separate line items; identical weights merge.
 */
export const generateCartItemId = (product, grams = null) => {
  if (!product) return 'unknown';
  if (product.sellingType === 'WEIGHT' && grams !== null && grams !== undefined) {
    return `${product.id}_w${grams}`;
  }
  return product.id;
};
