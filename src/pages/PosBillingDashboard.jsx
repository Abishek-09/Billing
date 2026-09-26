import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProductCatalog from '../components/ProductCatalog';
import BillingCart from '../components/BillingCart';
import PaymentModal from '../components/PaymentModal';
import ReceiptModal from '../components/ReceiptModal';
import {
  ProductsView,
  OrdersView,
  CustomersView,
  InventoryView,
  ReportsView,
  SettingsView
} from '../components/OtherViews';
import { PRODUCTS, CUSTOMERS, INITIAL_RECENT_BILLS } from '../data/mockData';

export function PosBillingDashboard() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('billing');

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
  const [lastCompletedBill, setLastCompletedBill] = useState(null);

  // Add Item to Cart
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          quantity: 1,
          image: product.image,
        },
      ];
    });
  };

  // Update Item Quantity
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove Item from Cart
  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Clear Cart
  const handleClearCart = () => {
    setCartItems([]);
    setDiscountPercent(0);
  };

  // Payment Flow
  const handleOpenPayNow = () => {
    if (cartItems.length === 0) return;
    setIsPaymentModalOpen(true);
  };

  // Print Bill Flow
  const handleOpenPrintBill = () => {
    if (cartItems.length === 0) return;
    const subTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountAmount = Math.round((subTotal * (discountPercent || 0)) / 100);
    const taxableAmount = Math.max(0, subTotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * 0.05);
    const totalAmount = taxableAmount + taxAmount;

    setLastCompletedBill({
      billNumber,
      customerName: selectedCustomer.name,
      items: [...cartItems],
      subTotal,
      discountAmount,
      discountPercent,
      taxAmount,
      totalAmount,
      paymentMethod: 'PENDING / PROFORMA',
    });
    setIsReceiptModalOpen(true);
  };

  // Successful Payment Handling
  const handlePaymentSuccess = (paymentDetails) => {
    const subTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountAmount = Math.round((subTotal * (discountPercent || 0)) / 100);
    const taxableAmount = Math.max(0, subTotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * 0.05);
    const totalAmount = taxableAmount + taxAmount;

    const completed = {
      billNumber: paymentDetails.billNumber,
      customerName: paymentDetails.customerName,
      items: [...cartItems],
      subTotal,
      discountAmount,
      discountPercent,
      taxAmount,
      totalAmount,
      paymentMethod: paymentDetails.method,
      tendered: paymentDetails.tendered,
      change: paymentDetails.change,
    };

    setLastCompletedBill(completed);
    setIsReceiptModalOpen(true);

    // Prepare next bill
    const currentNum = parseInt(billNumber.replace('SB-', ''), 10) || 1043;
    setBillNumber(`SB-${currentNum + 1}`);
    setCartItems([]);
    setDiscountPercent(0);
    setSelectedCustomer(CUSTOMERS[0]);
  };

  // Cart total calculation for modal
  const currentSubTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const currentDiscountAmount = Math.round(
    (currentSubTotal * (discountPercent || 0)) / 100
  );
  const currentTaxable = Math.max(0, currentSubTotal - currentDiscountAmount);
  const currentTotalAmount = currentTaxable + Math.round(currentTaxable * 0.05);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FDFBF7] text-[#321E1E]">
      {/* Column 1: Left Sidebar (Navigation) - Width: 240px */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

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
          />

          {/* Column 3: Right Sidebar (Current Bill / Cart) - Width: 380px */}
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
          />
        </>
      ) : activeTab === 'products' ? (
        <ProductsView onBackToBilling={() => setActiveTab('billing')} />
      ) : activeTab === 'orders' ? (
        <OrdersView onBackToBilling={() => setActiveTab('billing')} />
      ) : activeTab === 'customers' ? (
        <CustomersView onBackToBilling={() => setActiveTab('billing')} />
      ) : activeTab === 'inventory' ? (
        <InventoryView onBackToBilling={() => setActiveTab('billing')} />
      ) : activeTab === 'reports' ? (
        <ReportsView onBackToBilling={() => setActiveTab('billing')} />
      ) : (
        <SettingsView onBackToBilling={() => setActiveTab('billing')} />
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={currentTotalAmount}
        customerName={selectedCustomer.name}
        billNumber={billNumber}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Thermal Receipt Preview Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        billData={lastCompletedBill}
      />
    </div>
  );
}

export default PosBillingDashboard;
