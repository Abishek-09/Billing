import React, { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Boxes,
  CheckCircle2,
  X,
  Sparkles,
  Upload,
  Search,
  Filter,
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import { ALL_INVENTORY_PRODUCTS } from '../../data/adminMockData';

export const AdminInventory = () => {
  const [products, setProducts] = useState(ALL_INVENTORY_PRODUCTS);
  const [slideOverOpen, setSlideOverOpen] = useState(false); // Edit drawer from side
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add modal in middle
  const [editingProduct, setEditingProduct] = useState(null);

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cakes',
    price: '',
    stock: '',
    unit: '1 pc',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80',
  });

  // KPI Calculations
  const totalItemsCount = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Extract distinct categories dynamically from product inventory
  const availableCategories = useMemo(() => {
    const cats = new Set();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSortBy('default');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedStatus !== 'All' ||
    sortBy !== 'default';

  // Computed filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        // Search filter: name, category, or id
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          prod.name?.toLowerCase().includes(query) ||
          prod.category?.toLowerCase().includes(query) ||
          prod.id?.toLowerCase().includes(query);

        // Category filter
        const matchesCategory =
          selectedCategory === 'All' || prod.category === selectedCategory;

        // Stock status filter
        let matchesStatus = true;
        if (selectedStatus === 'in_stock') {
          matchesStatus = prod.stock >= 10;
        } else if (selectedStatus === 'low_stock') {
          matchesStatus = prod.stock > 0 && prod.stock < 10;
        } else if (selectedStatus === 'out_of_stock') {
          matchesStatus = prod.stock === 0;
        }

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'stock-asc') return a.stock - b.stock;
        if (sortBy === 'stock-desc') return b.stock - a.stock;
        return 0;
      });
  }, [products, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setSlideOverOpen(false);
    setFormData({
      name: '',
      category: 'Cakes',
      price: '',
      stock: '',
      unit: '1 pc',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setIsAddModalOpen(false);
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      unit: prod.unit,
      image: prod.image,
    });
    setSlideOverOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const priceNum = parseFloat(formData.price) || 0;
    const stockNum = parseInt(formData.stock, 10) || 0;

    let statusText = 'In Stock';
    if (stockNum === 0) statusText = 'Out of Stock';
    else if (stockNum < 10) statusText = 'Low Stock';

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                price: priceNum,
                stock: stockNum,
                unit: formData.unit,
                image: formData.image,
                status: statusText,
              }
            : p
        )
      );
      setEditingProduct(null);
      setSlideOverOpen(false);
    } else {
      const newProduct = {
        id: `inv-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        price: priceNum,
        stock: stockNum,
        unit: formData.unit,
        image: formData.image,
        status: statusText,
      };
      setProducts((prev) => [newProduct, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Title "Product Inventory" & "+ Add New Product" button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#321E1E]">
            Product Inventory
          </h2>
          <p className="text-xs text-[#4E3636] mt-0.5">
            Manage bakery menu, recipe inventory batches, and real-time stock limits
          </p>
        </div>

        {/* Primary button: #116D6E background, white text, rounded-lg */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#116D6E] hover:bg-[#0e5859] active:scale-95 text-white text-xs font-bold shadow-teal transition-all cursor-pointer select-none"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* KPI Row: Interactive quick-status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <button
          type="button"
          onClick={() => setSelectedStatus('All')}
          className={`text-left bg-white rounded-xl p-4 shadow-soft border transition-all cursor-pointer flex items-center justify-between ${
            selectedStatus === 'All'
              ? 'ring-2 ring-[#116D6E] border-[#116D6E]/40'
              : 'border-[#4E3636]/10 hover:border-[#116D6E]/30'
          }`}
          title="Click to view all products"
        >
          <div>
            <span className="text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
              Total Items
            </span>
            <div className="text-2xl font-bold text-[#321E1E] mt-1">
              {totalItemsCount}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#116D6E]/10 flex items-center justify-center text-[#116D6E]">
            <Boxes className="w-4 h-4" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus(selectedStatus === 'low_stock' ? 'All' : 'low_stock')}
          className={`text-left bg-white rounded-xl p-4 shadow-soft border transition-all cursor-pointer flex items-center justify-between ${
            selectedStatus === 'low_stock'
              ? 'ring-2 ring-amber-600 border-amber-600/40 bg-amber-50/20'
              : 'border-[#4E3636]/10 hover:border-amber-600/30'
          }`}
          title="Click to filter low stock items"
        >
          <div>
            <span className="text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
              Low Stock Items
            </span>
            <div className="text-2xl font-bold text-amber-700 mt-1">
              {lowStockCount}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus(selectedStatus === 'out_of_stock' ? 'All' : 'out_of_stock')}
          className={`text-left bg-white rounded-xl p-4 shadow-soft border transition-all cursor-pointer flex items-center justify-between ${
            selectedStatus === 'out_of_stock'
              ? 'ring-2 ring-[#CD1818] border-[#CD1818]/40 bg-[#CD1818]/5'
              : 'border-[#4E3636]/10 hover:border-[#CD1818]/30'
          }`}
          title="Click to filter out of stock items"
        >
          <div>
            <span className="text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
              Out of Stock
            </span>
            <div className="text-2xl font-extrabold text-[#CD1818] mt-1">
              {outOfStockCount}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#CD1818]/10 flex items-center justify-center text-[#CD1818]">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-soft border border-[#4E3636]/10 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#4E3636] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, category, or ID..."
              className="w-full bg-[#FDFBF7] text-[#321E1E] text-xs pl-10 pr-9 py-2.5 rounded-xl border border-[#4E3636]/20 placeholder-[#4E3636]/50 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#4E3636]/50 hover:text-[#321E1E] cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns and Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#4E3636]">
              <span className="font-semibold text-[11px] uppercase tracking-wider text-[#4E3636]/70">
                Category:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#FDFBF7] text-[#321E1E] text-xs px-3 py-2 rounded-xl border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E] font-medium cursor-pointer shadow-xs"
              >
                <option value="All">All Categories ({products.length})</option>
                {availableCategories
                  .filter((c) => c !== 'All')
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({products.filter((p) => p.category === cat).length})
                    </option>
                  ))}
              </select>
            </div>

            {/* Stock Status Filter Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#4E3636]">
              <span className="font-semibold text-[11px] uppercase tracking-wider text-[#4E3636]/70">
                Status:
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#FDFBF7] text-[#321E1E] text-xs px-3 py-2 rounded-xl border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E] font-medium cursor-pointer shadow-xs"
              >
                <option value="All">All Status</option>
                <option value="in_stock">In Stock (≥10)</option>
                <option value="low_stock">Low Stock (&lt;10)</option>
                <option value="out_of_stock">Out of Stock (0)</option>
              </select>
            </div>

            {/* Sort Filter Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#4E3636]">
              <span className="font-semibold text-[11px] uppercase tracking-wider text-[#4E3636]/70 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-[#116D6E]" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FDFBF7] text-[#321E1E] text-xs px-3 py-2 rounded-xl border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E] font-medium cursor-pointer shadow-xs"
              >
                <option value="default">Default</option>
                <option value="name-asc">Name (A → Z)</option>
                <option value="name-desc">Name (Z → A)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="stock-asc">Stock: Low to High</option>
                <option value="stock-desc">Stock: High to Low</option>
              </select>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#CD1818] hover:bg-[#CD1818]/10 border border-[#CD1818]/30 transition-all cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#4E3636]/10 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#4E3636]/70 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#116D6E]" />
              Quick Filter:
            </span>
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected && cat !== 'All' ? 'All' : cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#116D6E] text-white shadow-teal'
                      : 'bg-[#FDFBF7] text-[#4E3636] hover:bg-[#116D6E]/10 border border-[#4E3636]/15'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-medium text-[#4E3636]">
            Showing <span className="font-bold text-[#321E1E]">{filteredProducts.length}</span> of {products.length} products
          </div>
        </div>
      </div>

      {/* Data Table: White background, rounded-xl, soft shadow */}
      <div className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#FDFBF7] shadow-xs">
              <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7]">
                <th className="py-3 px-5 text-xs font-semibold text-[#4E3636] uppercase tracking-wider bg-[#FDFBF7]">
                  Product Image
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider bg-[#FDFBF7]">
                  Name
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider bg-[#FDFBF7]">
                  Category
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider bg-[#FDFBF7]">
                  Price
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider bg-[#FDFBF7]">
                  Stock Quantity
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider bg-[#FDFBF7]">
                  Status
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#4E3636] uppercase tracking-wider text-right bg-[#FDFBF7]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4E3636]/10 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#4E3636]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#116D6E]/10 flex items-center justify-center text-[#116D6E]">
                        <Search className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-sm text-[#321E1E]">No products match the selected filters</p>
                      <p className="text-xs text-[#4E3636]/70 max-w-sm">
                        Try changing your category, adjusting your search term, or clearing active filters.
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="mt-2 px-3.5 py-1.5 rounded-lg bg-[#116D6E] text-white font-semibold text-xs hover:bg-[#0e5859] transition-all cursor-pointer shadow-teal active:scale-95"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isLow = prod.stock > 0 && prod.stock < 10;
                  const isOut = prod.stock === 0;

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-[#FDFBF7]/70 transition-colors"
                    >
                      {/* Product Image (small thumbnail) */}
                      <td className="py-3 px-5">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-11 h-11 rounded-lg object-cover border border-[#4E3636]/15 bg-[#FDFBF7]"
                        />
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-[#321E1E]">
                        {prod.name}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-[#4E3636] font-medium">
                        {prod.category}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-[#321E1E]">
                        ₹{prod.price} <span className="text-[10px] text-[#4E3636]/70">/{prod.unit}</span>
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3 px-4 font-semibold text-[#321E1E]">
                        {prod.stock} {prod.unit}
                      </td>

                      {/* Status Logic:
                          If stock < 10: display red warning dot and text "Low Stock" in #CD1818.
                          If stock > 10: display "In Stock" in #116D6E.
                          If stock === 0: display "Out of Stock" in #CD1818. */}
                      <td className="py-3 px-4">
                        {isOut ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#CD1818]/10 text-[#CD1818] font-bold text-[11px] border border-[#CD1818]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#CD1818]" />
                            <span>Out of Stock</span>
                          </div>
                        ) : isLow ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#CD1818]/10 text-[#CD1818] font-bold text-[11px] border border-[#CD1818]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#CD1818] animate-pulse" />
                            <span>Low Stock ({prod.stock})</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#116D6E]/10 text-[#116D6E] font-bold text-[11px] border border-[#116D6E]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#116D6E]" />
                            <span>In Stock</span>
                          </div>
                        )}
                      </td>

                      {/* Action Column: Edit icon (#4E3636 hover to #116D6E) and Delete icon (#4E3636 hover to #CD1818) */}
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 rounded-lg text-[#4E3636] hover:text-[#116D6E] hover:bg-[#116D6E]/10 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(prod.id)}
                            className="p-1.5 rounded-lg text-[#4E3636] hover:text-[#CD1818] hover:bg-[#CD1818]/10 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. Add New Product Modal (Centered in the middle of the page) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#4E3636]/15 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 px-6 bg-[#116D6E] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white border border-white/20">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Add New Bakery Product</h3>
                  <p className="text-xs text-white/80">
                    Fill in menu details, pricing, and live inventory counter
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 max-h-[80vh] overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pistachio Frangipane Tart"
                  className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 text-[#321E1E] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 bg-white text-[#321E1E] text-xs"
                  >
                    <option value="Cakes">Cakes</option>
                    <option value="Bread">Bread</option>
                    <option value="Pastries">Pastries</option>
                    <option value="Cookies">Cookies</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                    Unit Label
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="1 pc, 1 kg, loaf"
                    className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 text-[#321E1E] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 180"
                    className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 text-[#321E1E] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="e.g. 24"
                    className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 text-[#321E1E] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 text-[#321E1E] text-xs"
                />
                <p className="text-[10px] text-[#4E3636]/70 mt-1">
                  Square high-res photography provides the cleanest card presentation.
                </p>
              </div>

              {/* Preview */}
              <div className="p-3 bg-[#FDFBF7] rounded-2xl border border-[#4E3636]/10 flex items-center gap-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-12 h-12 rounded-xl object-cover border border-[#4E3636]/15 bg-white"
                />
                <div>
                  <span className="font-bold text-[#321E1E] block">{formData.name || 'Sample Product'}</span>
                  <div className="text-[11px] text-[#4E3636]">
                    ₹{formData.price || '0'} &bull; {formData.category} &bull; {formData.stock || 0} in stock
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#4E3636]/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#4E3636]/20 text-[#321E1E] font-semibold hover:bg-[#FDFBF7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#116D6E] text-white font-bold hover:bg-[#0e5859] transition-all shadow-teal cursor-pointer active:scale-95"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Product Slide-Over Panel (From the side - kept unchanged) */}
      {slideOverOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#321E1E]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#4E3636]/15 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 bg-[#116D6E] text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold">Edit Bakery Item</h3>
                <p className="text-xs text-white/80">
                  Fill in menu details, pricing, and live inventory counter
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSlideOverOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 flex-1 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pistachio Frangipane Tart"
                  className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 text-[#321E1E] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 bg-white text-[#321E1E] text-xs"
                  >
                    <option value="Cakes">Cakes</option>
                    <option value="Bread">Bread</option>
                    <option value="Pastries">Pastries</option>
                    <option value="Cookies">Cookies</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                    Unit Label
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="1 pc, 1 kg, loaf"
                    className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 text-[#321E1E] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 180"
                    className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 text-[#321E1E] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="e.g. 24"
                    className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 text-[#321E1E] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#321E1E] mb-1.5 uppercase tracking-wider text-[11px]">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 text-[#321E1E] text-xs"
                />
                <p className="text-[10px] text-[#4E3636]/70 mt-1">
                  Square high-res photography provides the cleanest card presentation.
                </p>
              </div>

              {/* Preview */}
              <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 flex items-center gap-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-[#4E3636]/10"
                />
                <div>
                  <span className="font-bold text-[#321E1E]">{formData.name || 'Sample Product'}</span>
                  <div className="text-[11px] text-[#4E3636]">
                    ₹{formData.price || '0'} &bull; {formData.category} &bull; {formData.stock || 0} in stock
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#116D6E] text-white font-bold hover:bg-[#0e5859] transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSlideOverOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#4E3636]/20 text-[#321E1E] font-semibold hover:bg-[#FDFBF7] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
