import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Boxes,
  CheckCircle2,
  X,
  Sparkles,
  Upload
} from 'lucide-react';
import { ALL_INVENTORY_PRODUCTS } from '../../data/adminMockData';

export const AdminInventory = () => {
  const [products, setProducts] = useState(ALL_INVENTORY_PRODUCTS);
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Cakes',
      price: '',
      stock: '',
      unit: '1 pc',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80',
    });
    setSlideOverOpen(true);
  };

  const handleOpenEdit = (prod) => {
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
    }

    setSlideOverOpen(false);
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
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* KPI Row: Small cards showing "Total Items", "Low Stock", "Out of Stock" (use #CD1818 for out-of-stock) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-4 shadow-soft border border-[#4E3636]/10 flex items-center justify-between">
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
        </div>

        <div className="bg-white rounded-xl p-4 shadow-soft border border-[#4E3636]/10 flex items-center justify-between">
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
        </div>

        <div className="bg-white rounded-xl p-4 shadow-soft border border-[#4E3636]/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
              Out of Stock
            </span>
            {/* use #CD1818 for the out-of-stock number */}
            <div className="text-2xl font-extrabold text-[#CD1818] mt-1">
              {outOfStockCount}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#CD1818]/10 flex items-center justify-center text-[#CD1818]">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Data Table: White background, rounded-xl, soft shadow */}
      <div className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7]/60">
                <th className="py-3 px-5 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Product Image
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Price
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Stock Quantity
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#4E3636] uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4E3636]/10 text-xs">
              {products.map((prod) => {
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
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Slide-Over Panel from the right */}
      {slideOverOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#321E1E]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#4E3636]/15 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 bg-[#116D6E] text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold">
                  {editingProduct ? 'Edit Bakery Item' : 'Add New Bakery Product'}
                </h3>
                <p className="text-xs text-white/80">
                  Fill in menu details, pricing, and live inventory counter
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSlideOverOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
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
                  className="flex-1 py-2.5 rounded-xl bg-[#116D6E] text-white font-bold hover:bg-[#0e5859] transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setSlideOverOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#4E3636]/20 text-[#321E1E] font-semibold hover:bg-[#FDFBF7]"
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
