import React, { useState } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProductCatalog from '../components/ProductCatalog';
import BillingCart from '../components/BillingCart';
import PaymentModal from '../components/PaymentModal';
import ReceiptModal from '../components/ReceiptModal';
import {
  ProductsView,
  CategoriesView,
  OrdersView
} from '../components/OtherViews';
import { PRODUCTS, CUSTOMERS, INITIAL_RECENT_BILLS } from '../data/mockData';
import { ALL_ORDERS_DATA } from '../data/adminMockData';
import { WeightSelectionModal } from '../components/modals/WeightSelectionModal';
import { generateCartItemId, round2 } from '../services/weightCalculationService';

export function PosBillingDashboard() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('billing');
  const [currentOrderMeta, setCurrentOrderMeta] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Cart State (useState for cart items, active categories, quantity management)
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod-9',
      name: 'Golden Butter Croissant',
      price: 110,
      unit: '1 pc',
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'prod-6',
      name: 'Classic French Baguette',
      price: 120,
      unit: '1 loaf',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'prod-17',
      name: 'Artisan Flat White Coffee',
      price: 150,
      unit: '300ml',
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    },
  ]);

  // Invoice & Customer Info
  const [billNumber, setBillNumber] = useState('SB-1043');
  const [selectedCustomer, setSelectedCustomer] = useState(CUSTOMERS[0]);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Modals State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [weightModalProduct, setWeightModalProduct] = useState(null);
  const [lastCompletedBill, setLastCompletedBill] = useState(null);

  // Helper for strict 2-decimal financial totals across PIECE & WEIGHT products
  const calculateCartTotals = (items, discPercent = 0) => {
    const subTotal = round2(
      items.reduce(
        (sum, item) => sum + (item.sellingAmountBeforeGst !== undefined ? item.sellingAmountBeforeGst : item.price) * item.quantity,
        0
      )
    );
    const discountAmount = round2((subTotal * (discPercent || 0)) / 100);
    const taxableAmount = Math.max(0, subTotal - discountAmount);
    const taxAmount = round2(
      items.reduce((sum, item) => {
        const itemPre = (item.sellingAmountBeforeGst !== undefined ? item.sellingAmountBeforeGst : item.price) * item.quantity;
        const itemDisc = discPercent > 0 ? (itemPre * discPercent) / 100 : 0;
        const itemTaxable = Math.max(0, itemPre - itemDisc);
        const rate = (item.gstRate !== undefined ? item.gstRate : 5) / 100;
        return sum + (itemTaxable * rate);
      }, 0)
    );
    const totalAmount = round2(taxableAmount + taxAmount);
    return { subTotal, discountAmount, taxableAmount, taxAmount, totalAmount };
  };

  // Orders Ledger State (synced across POS and Admin)
  const [ordersList, setOrdersList] = useState(() => {
    try {
      const saved = localStorage.getItem('sweetbite_pos_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [...ALL_ORDERS_DATA];
  });

  // Add Item to Cart (Single Source of Truth for Click, Enter, and Barcode Scan)
  const handleAddToCart = (product, weightPayload = null) => {
    if (!product) return;

    // Respect stock validation (out of stock = do not add)
    if (product.stock !== undefined && product.stock <= 0) {
      return;
    }

    // Weight-based product guard: Open modal if no weight payload provided
    if (product.sellingType === 'WEIGHT' && !weightPayload) {
      setWeightModalProduct(product);
      return;
    }

    // Generate cartItemId: composite for weight items, product.id for piece items
    const grams = weightPayload ? weightPayload.grams : null;
    const cartItemId = generateCartItemId(product, grams);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.cartItemId || item.id) === cartItemId
      );

      if (existingIndex >= 0) {
        const existing = prevItems[existingIndex];
        // Respect stock limit if available
        if (product.stock !== undefined && existing.quantity >= product.stock) {
          return prevItems;
        }
        return prevItems.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // New Weight-based line item
      if (product.sellingType === 'WEIGHT' && weightPayload) {
        return [
          ...prevItems,
          {
            id: product.id,
            cartItemId,
            productId: product.id,
            name: product.name,
            sellingType: 'WEIGHT',
            grams: weightPayload.grams,
            displayWeight: weightPayload.displayWeight,
            ratePerKg: weightPayload.ratePerKg,
            purchaseRatePerKg: weightPayload.purchaseRatePerKg,
            price: weightPayload.sellingAmountBeforeGst,
            sellingAmountBeforeGst: weightPayload.sellingAmountBeforeGst,
            gstRate: weightPayload.gstRate,
            gstAmount: weightPayload.gstAmount,
            customerAmount: weightPayload.customerAmount,
            profitPerUnit: weightPayload.profit,
            unit: weightPayload.displayWeight,
            quantity: 1,
            image: product.image,
            stock: product.stock,
          },
        ];
      }

      // Standard Piece-based line item
      return [
        ...prevItems,
        {
          id: product.id,
          cartItemId,
          productId: product.id,
          name: product.name,
          sellingType: 'PIECE',
          price: product.price,
          unit: product.unit,
          quantity: 1,
          image: product.image,
          stock: product.stock,
          gstRate: product.gstRate || 5,
          sellingAmountBeforeGst: product.price,
        },
      ];
    });
  };

  // Update Item Quantity (by composite cartItemId)
  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          (item.cartItemId || item.id) === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Remove Item from Cart (by composite cartItemId)
  const handleRemoveItem = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item.cartItemId || item.id) !== cartItemId)
    );
  };

  // Clear Cart
  const handleClearCart = () => {
    setCartItems([]);
    setDiscountPercent(0);
  };

  // Payment Flow
  const handleOpenPayNow = (orderData) => {
    if (cartItems.length === 0) return;
    setCurrentOrderMeta(orderData);
    setIsPaymentModalOpen(true);
  };

  // Print Bill Flow
  const handleOpenPrintBill = (orderData) => {
    if (cartItems.length === 0) return;
    const { subTotal, discountAmount, taxAmount, totalAmount } = calculateCartTotals(
      cartItems,
      discountPercent
    );
    const isPreOrder = orderData?.orderType === 'order';

    setLastCompletedBill({
      billNumber,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer?.phone && selectedCustomer.phone !== '—' ? selectedCustomer.phone : '',
      items: [...cartItems],
      subTotal,
      discountAmount,
      discountPercent,
      taxAmount,
      totalAmount,
      orderType: orderData?.orderTypeLabel || 'Takeaway',
      advancePaid: isPreOrder ? orderData.advancePaid : totalAmount,
      pendingAmount: isPreOrder ? orderData.pendingAmount : 0,
      paymentMethod: 'PENDING / PROFORMA',
    });
    setIsReceiptModalOpen(true);
  };

  // Successful Payment Handling
  const handlePaymentSuccess = (paymentDetails) => {
    const { subTotal, discountAmount, taxAmount, totalAmount } = calculateCartTotals(
      cartItems,
      discountPercent
    );
    const isPreOrder = currentOrderMeta?.orderType === 'order';

    const completed = {
      billNumber: paymentDetails.billNumber,
      customerName: paymentDetails.customerName,
      customerPhone: paymentDetails.customerPhone,
      items: [...cartItems],
      subTotal,
      discountAmount,
      discountPercent,
      taxAmount,
      totalAmount,
      orderType: currentOrderMeta?.orderTypeLabel || 'Takeaway',
      advancePaid: isPreOrder ? currentOrderMeta.advancePaid : totalAmount,
      pendingAmount: isPreOrder ? currentOrderMeta.pendingAmount : 0,
      paymentMethod: paymentDetails.method,
      tendered: paymentDetails.tendered,
      change: paymentDetails.change,
    };

    // Prepend to ALL_ORDERS_DATA and local ordersList so it immediately surfaces on Orders menu!
    const newAdminOrder = {
      id: paymentDetails.billNumber ? `ORD-${paymentDetails.billNumber.replace('SB-', '')}` : `ORD-${Date.now().toString().slice(-4)}`,
      billNumber: paymentDetails.billNumber || billNumber,
      customer: paymentDetails.customerName || 'Walk-in Customer',
      customerPhone: paymentDetails.customerPhone || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      type: currentOrderMeta?.orderTypeLabel || 'Takeaway',
      date: `${new Date().getDate()} Sep 2026, ${new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`,
      items: `${cartItems.length} items`,
      itemsList: cartItems.map((it) =>
        it.sellingType === 'WEIGHT'
          ? `${it.quantity}x ${it.name} (${it.displayWeight})`
          : `${it.quantity}x ${it.name}`
      ),
      detailedItems: cartItems.map((it) => ({ ...it })),
      subTotal,
      discountAmount,
      discountPercent,
      taxAmount,
      totalAmount,
      amount: `₹${totalAmount.toLocaleString('en-IN')}`,
      advancePaid: isPreOrder ? (currentOrderMeta?.advancePaid ?? 0) : totalAmount,
      pendingAmount: isPreOrder ? (currentOrderMeta?.pendingAmount ?? 0) : 0,
      paymentMethod: paymentDetails.method || 'CASH',
      status: (isPreOrder && (currentOrderMeta?.pendingAmount || 0) > 0) ? 'Pending Payment' : 'Completed',
      kitchenStatus: isPreOrder ? 'Pre-Order Booked' : 'Ready for Packing',
      isNewToday: true,
      timestamp: Date.now(),
    };

    ALL_ORDERS_DATA.unshift(newAdminOrder);

    // Update POS orders list state (triggers immediate re-render of Orders tab)
    setOrdersList((prev) => {
      const updated = [newAdminOrder, ...prev];
      try {
        localStorage.setItem('sweetbite_pos_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setLastCompletedBill(completed);
    setIsReceiptModalOpen(true);

    // Prepare next bill
    const currentNum = parseInt(billNumber.replace('SB-', ''), 10) || 1043;
    setBillNumber(`SB-${currentNum + 1}`);
    setCartItems([]);
    setDiscountPercent(0);
    setSelectedCustomer(CUSTOMERS[0]);
    setCurrentOrderMeta(null);
  };

  // Reprint receipt handler from Orders tab
  const handleReprintReceipt = (order) => {
    const isPreOrder = order.type === 'Order';
    setLastCompletedBill({
      billNumber: order.billNumber || order.id,
      customerName: order.customer,
      customerPhone: order.customerPhone || '',
      items: order.detailedItems || (order.itemsList ? order.itemsList.map((itemStr) => {
        const match = itemStr.match(/^(\d+)x\s*(.*)$/);
        const qty = match ? parseInt(match[1], 10) : 1;
        const name = match ? match[2] : itemStr;
        return { name, quantity: qty, price: Math.round((order.totalAmount || 500) / (order.itemsList.length || 1)) };
      }) : []),
      subTotal: order.subTotal || order.totalAmount,
      discountAmount: order.discountAmount || 0,
      discountPercent: order.discountPercent || 0,
      taxAmount: order.taxAmount || Math.round((order.totalAmount || 0) * 0.05),
      totalAmount: order.totalAmount,
      orderType: order.type,
      advancePaid: order.advancePaid === '-' ? order.totalAmount : Number(order.advancePaid || order.totalAmount),
      pendingAmount: order.pendingAmount || 0,
      paymentMethod: order.paymentMethod || 'CASH',
    });
    setIsReceiptModalOpen(true);
  };

  // Balance collection handler from Orders tab
  const handleCollectOrderBalance = (orderId, method = 'Cash') => {
    setOrdersList((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId || ord.billNumber === orderId) {
          return {
            ...ord,
            advancePaid: ord.totalAmount,
            pendingAmount: 0,
            status: 'Completed',
            paymentMethod: `${ord.paymentMethod || 'CASH'} + ${method}`,
          };
        }
        return ord;
      });
      try {
        localStorage.setItem('sweetbite_pos_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    const found = ALL_ORDERS_DATA.find((o) => o.id === orderId || o.billNumber === orderId);
    if (found) {
      found.advancePaid = found.totalAmount;
      found.pendingAmount = 0;
      found.status = 'Completed';
    }
  };

  // Cart total calculation for modal
  const {
    subTotal: currentSubTotal,
    discountAmount: currentDiscountAmount,
    taxableAmount: currentTaxable,
    taxAmount: currentTaxAmount,
    totalAmount: currentTotalAmount,
  } = calculateCartTotals(cartItems, discountPercent);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FDFBF7] text-[#321E1E] relative">
      {/* Column 1: Left Sidebar (Navigation) - Width: 240px on desktop, drawer on mobile */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Switcher based on Active Tab */}
      {activeTab === 'billing' ? (
        <>
          {/* Column 2: Center Area (Product Catalog) - Flexible Width */}
          <ProductCatalog
            products={PRODUCTS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            onOpenMobileNav={() => setIsMobileNavOpen(true)}
            onOpenMobileCart={() => setIsMobileCartOpen(true)}
          />

          {/* Column 3: Right Sidebar (Current Bill / Cart) - Width: 380px on desktop, drawer on mobile */}
          <BillingCart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            billNumber={billNumber}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            discountPercent={discountPercent}
            setDiscountPercent={setDiscountPercent}
            onPayNow={handleOpenPayNow}
            onPrintBill={handleOpenPrintBill}
            mobileOpen={isMobileCartOpen}
            onCloseMobile={() => setIsMobileCartOpen(false)}
          />
        </>
      ) : activeTab === 'products' ? (
        <ProductsView onBackToBilling={() => setActiveTab('billing')} />
      ) : activeTab === 'categories' ? (
        <CategoriesView
          onBackToBilling={() => setActiveTab('billing')}
          onSelectCategory={(catName) => {
            setSelectedCategory(catName);
            setActiveTab('billing');
          }}
        />
      ) : activeTab === 'orders' ? (
        <OrdersView
          orders={ordersList}
          onBackToBilling={() => setActiveTab('billing')}
          onPrintReceipt={handleReprintReceipt}
          onCollectBalance={handleCollectOrderBalance}
        />
      ) : null}

      {/* Floating Mobile Cart Summary Bar on screens < lg */}
      {activeTab === 'billing' && (
        <div className="fixed bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#4E3636]/15 shadow-[0_-4px_20px_rgba(50,30,30,0.08)] z-30 lg:hidden flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
          <button
            type="button"
            onClick={() => setIsMobileCartOpen(true)}
            className="flex items-center gap-2.5 cursor-pointer select-none text-left"
          >
            <div className="relative w-10 h-10 rounded-xl bg-[#116D6E]/10 flex items-center justify-center text-[#116D6E] shrink-0">
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#CD1818] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-[#321E1E]">
                {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in bill
              </div>
              <div className="text-sm font-extrabold text-[#CD1818]">
                ₹{currentTotalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileCartOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-teal transition-all cursor-pointer shrink-0"
          >
            <span>View Bill &amp; Pay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={currentOrderMeta ? currentOrderMeta.amountToPayNow : currentTotalAmount}
        fullTotalAmount={currentOrderMeta ? currentOrderMeta.totalAmount : currentTotalAmount}
        orderType={currentOrderMeta ? currentOrderMeta.orderTypeLabel : 'Takeaway'}
        pendingAmount={currentOrderMeta ? currentOrderMeta.pendingAmount : 0}
        customerName={selectedCustomer?.name && selectedCustomer.name !== 'Walk-in Customer' ? selectedCustomer.name : ''}
        customerPhone={selectedCustomer?.phone && selectedCustomer.phone !== '—' ? selectedCustomer.phone : ''}
        billNumber={billNumber}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Thermal Receipt Preview Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        billData={lastCompletedBill}
      />

      {/* Weight Selection Modal */}
      <WeightSelectionModal
        isOpen={Boolean(weightModalProduct)}
        onClose={() => setWeightModalProduct(null)}
        product={weightModalProduct}
        onConfirmWeight={(prod, payload) => handleAddToCart(prod, payload)}
      />
    </div>
  );
}

export default PosBillingDashboard;
