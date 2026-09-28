import React, { useState, useMemo } from 'react';
import {
  Tags,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
  CakeSlice,
  Boxes,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Eye,
  Filter,
  LayoutGrid,
  List
} from 'lucide-react';
import { BAKERY_CATEGORIES, PRODUCTS } from '../../data/mockData';

export const AdminCategories = () => {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('sweetbite_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [...BAKERY_CATEGORIES];
  });

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [modalMode, setModalMode] = useState(null); // null | 'add' | 'edit'
  const [selectedCat, setSelectedCat] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTax, setFormTax] = useState('5% GST');
  const [formImage, setFormImage] = useState('');
  const [formRevenue, setFormRevenue] = useState('10%');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const saveToStorage = (updated) => {
    setCategories(updated);
    try {
      localStorage.setItem('sweetbite_categories', JSON.stringify(updated));
    } catch (e) {}
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // 1. Tab filter
      let matchesTab = true;
      if (activeTab === 'Active') {
        matchesTab = cat.status === 'Active';
      } else if (activeTab === 'Inactive') {
        matchesTab = cat.status === 'Inactive';
      }

      // 2. Search query
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [categories, activeTab, searchQuery]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedCat(null);
    setFormName('');
    setFormDesc('');
    setFormTax('5% GST');
    setFormImage('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80');
    setFormRevenue('10%');
  };

  // Open Edit Modal
  const handleOpenEdit = (cat) => {
    setModalMode('edit');
    setSelectedCat(cat);
    setFormName(cat.name);
    setFormDesc(cat.description);
    setFormTax(cat.taxRate);
    setFormImage(cat.image);
    setFormRevenue(cat.revenueShare || '10%');
  };

  // Save Add/Edit
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (modalMode === 'add') {
      const newCat = {
        id: `cat-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        slug: formName.trim().toLowerCase().replace(/\s+/g, '-'),
        description: formDesc.trim() || 'Fresh artisan bakery collection crafted daily',
        image: formImage.trim() || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        itemCount: 0,
        status: 'Active',
        taxRate: formTax,
        revenueShare: formRevenue,
        color: '#116D6E',
        popularItem: 'Signature Selection',
        createdAt: 'Just now',
      };
      saveToStorage([...categories, newCat]);
      showToast(`Category "${formName.trim()}" created successfully!`);
    } else if (modalMode === 'edit' && selectedCat) {
      const updated = categories.map((c) =>
        c.id === selectedCat.id
          ? {
              ...c,
              name: formName.trim(),
              slug: formName.trim().toLowerCase().replace(/\s+/g, '-'),
              description: formDesc.trim(),
              image: formImage.trim(),
              taxRate: formTax,
              revenueShare: formRevenue,
            }
          : c
      );
      saveToStorage(updated);
      showToast(`Category "${formName.trim()}" updated successfully!`);
    }

    setModalMode(null);
  };

  // Toggle Category Active/Inactive
  const handleToggleStatus = (catId) => {
    const updated = categories.map((c) => {
      if (c.id === catId) {
        const nextStatus = c.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`Category status set to ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    });
    saveToStorage(updated);
  };

  // Delete Category
  const handleDeleteCategory = (catId, catName) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      const updated = categories.filter((c) => c.id !== catId);
      saveToStorage(updated);
      showToast(`Category "${catName}" removed.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-[#116D6E]/10 border border-[#116D6E]/20 text-[#116D6E] rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#116D6E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#321E1E]">Category Management</h2>
          <p className="text-xs text-[#4E3636] mt-0.5">
            Organize catalog classifications, configure GST tax rates, and manage POS collections
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#116D6E] hover:bg-[#0e5859] text-white rounded-xl text-xs font-bold transition-all shadow-teal flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">Total Categories</span>
            <div className="w-8 h-8 rounded-lg bg-[#116D6E]/10 flex items-center justify-center text-[#116D6E]">
              <Tags className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#321E1E] mt-2">{categories.length}</div>
          <span className="text-[10px] text-emerald-700 font-medium">Configured in store</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">Active in POS</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">
            {categories.filter((c) => c.status === 'Active').length}
          </div>
          <span className="text-[10px] text-[#4E3636] font-medium">Visible to cashiers</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">Top Performing</span>
            <div className="w-8 h-8 rounded-lg bg-[#CD1818]/10 flex items-center justify-center text-[#CD1818]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#CD1818] mt-2">Cakes (42%)</div>
          <span className="text-[10px] text-[#4E3636] font-medium">Leading revenue share</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">Total Menu Items</span>
            <div className="w-8 h-8 rounded-lg bg-[#4E3636]/10 flex items-center justify-center text-[#4E3636]">
              <CakeSlice className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#321E1E] mt-2">{PRODUCTS.length}</div>
          <span className="text-[10px] text-[#4E3636] font-medium">Active catalog SKUs</span>
        </div>
      </div>

      {/* Control Bar: Filters, Search & View Toggle */}
      <div className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {['All', 'Active', 'Inactive'].map((tab) => {
            const isActive = activeTab === tab;
            const count =
              tab === 'All'
                ? categories.length
                : categories.filter((c) => c.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#116D6E] text-white shadow-teal'
                    : 'bg-[#FDFBF7] text-[#321E1E] border border-[#4E3636]/15 hover:border-[#116D6E]/40'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-[#4E3636]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Search & Layout Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#4E3636]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category name..."
              className="w-full bg-[#FDFBF7] text-xs text-[#321E1E] font-medium pl-9 pr-8 py-2 rounded-xl border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E] placeholder-[#4E3636]/40 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4E3636]/60 hover:text-[#321E1E]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center border border-[#4E3636]/20 rounded-xl overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-2 transition-colors ${
                viewMode === 'table' ? 'bg-[#116D6E] text-white' : 'bg-white text-[#4E3636] hover:bg-[#FDFBF7]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid Cards View"
              className={`p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-[#116D6E] text-white' : 'bg-white text-[#4E3636] hover:bg-[#FDFBF7]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-soft border border-[#4E3636]/15 overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-10 bg-[#FDFBF7] shadow-xs">
                <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7] text-[#4E3636] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-5 bg-[#FDFBF7]">Category Name</th>
                  <th className="py-3 px-4 bg-[#FDFBF7]">Description</th>
                  <th className="py-3 px-4 bg-[#FDFBF7]">Menu Items</th>
                  <th className="py-3 px-4 bg-[#FDFBF7]">GST Tax Rate</th>
                  <th className="py-3 px-4 bg-[#FDFBF7]">Sales Share</th>
                  <th className="py-3 px-4 bg-[#FDFBF7]">Status</th>
                  <th className="py-3 px-5 text-right bg-[#FDFBF7]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4E3636]/10">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => {
                    const count = PRODUCTS.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                    const isCatActive = cat.status === 'Active';

                    return (
                      <tr key={cat.id} className="hover:bg-[#FDFBF7]/60 transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-10 h-10 rounded-lg object-cover border border-[#4E3636]/15 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-[#321E1E] text-sm block">
                                {cat.name}
                              </span>
                              <span className="text-[10px] text-[#4E3636]/70 font-mono block">
                                /{cat.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[#4E3636] max-w-xs">
                          <span className="line-clamp-2 leading-relaxed">
                            {cat.description}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-[#321E1E] px-2 py-0.5 rounded-md bg-[#FDFBF7] border border-[#4E3636]/15">
                            {count || cat.itemCount || 0} SKUs
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-[#116D6E]">
                            {cat.taxRate}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-bold text-[#321E1E]">
                          {cat.revenueShare || '10%'}
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleStatus(cat.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                              isCatActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isCatActive ? 'bg-emerald-600' : 'bg-gray-400'
                              }`}
                            />
                            <span>{cat.status}</span>
                          </button>
                        </td>

                        <td className="py-3 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(cat)}
                              title="Edit Category"
                              className="p-1.5 text-[#116D6E] hover:bg-[#116D6E]/10 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              title="Delete Category"
                              className="p-1.5 text-[#CD1818] hover:bg-[#CD1818]/10 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#4E3636]">
                      <Tags className="w-8 h-8 text-[#4E3636]/40 mx-auto mb-2" />
                      <p className="font-semibold text-sm text-[#321E1E]">No categories found</p>
                      <p className="text-xs text-[#4E3636]/70 mt-1">
                        Try modifying your search or filter options.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const count = PRODUCTS.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
            const isCatActive = cat.status === 'Active';

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-[#4E3636]/15 shadow-soft overflow-hidden flex flex-col hover:shadow-soft-lg transition-all"
              >
                <div className="h-36 relative overflow-hidden bg-[#321E1E]/5">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#321E1E]">
                      {cat.taxRate}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                        isCatActive ? 'bg-[#116D6E]' : 'bg-gray-500'
                      }`}
                    >
                      {cat.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-serif text-lg font-bold">{cat.name}</h3>
                    <span className="text-[11px] text-white/90">
                      {count || cat.itemCount || 0} Products &bull; {cat.revenueShare || '10%'} Sales
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-[#4E3636] leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>

                  <div className="pt-3 border-t border-[#4E3636]/10 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleStatus(cat.id)}
                      className="text-xs text-[#4E3636] hover:text-[#116D6E] font-medium"
                    >
                      Status: <strong>{cat.status}</strong>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 text-[#116D6E] hover:bg-[#116D6E]/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 text-[#CD1818] hover:bg-[#CD1818]/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#116D6E] p-4 px-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tags className="w-5 h-5 text-white" />
                <h3 className="font-serif font-bold text-base">
                  {modalMode === 'add' ? 'Add New Category' : `Edit Category • ${selectedCat?.name}`}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#4E3636] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Gourmet Cookies &amp; Biscotti"
                  className="w-full bg-[#FDFBF7] text-xs text-[#321E1E] font-medium p-2.5 rounded-xl border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 placeholder-[#4E3636]/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4E3636] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detailed category summary for catalog..."
                  className="w-full bg-[#FDFBF7] text-xs text-[#321E1E] font-medium p-2.5 rounded-xl border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 placeholder-[#4E3636]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4E3636] mb-1">
                    GST Tax Slab
                  </label>
                  <select
                    value={formTax}
                    onChange={(e) => setFormTax(e.target.value)}
                    className="w-full bg-[#FDFBF7] text-xs text-[#321E1E] font-medium p-2.5 rounded-xl border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E]"
                  >
                    <option value="5% GST">5% GST (Standard)</option>
                    <option value="0% GST">0% GST (Bread &amp; Essentials)</option>
                    <option value="12% GST">12% GST (Confectionery)</option>
                    <option value="18% GST">18% GST (Packaged Gourmet)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#4E3636] mb-1">
                    Sales Contribution (%)
                  </label>
                  <input
                    type="text"
                    value={formRevenue}
                    onChange={(e) => setFormRevenue(e.target.value)}
                    placeholder="e.g. 15%"
                    className="w-full bg-[#FDFBF7] text-xs text-[#321E1E] font-medium p-2.5 rounded-xl border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4E3636] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash..."
                  className="w-full bg-[#FDFBF7] text-xs text-[#321E1E] font-medium p-2.5 rounded-xl border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#116D6E] hover:bg-[#0e5859] text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {modalMode === 'add' ? 'Create Category' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="py-2.5 px-4 bg-white border border-[#4E3636]/20 text-[#4E3636] rounded-xl font-semibold hover:bg-[#FDFBF7] transition-colors cursor-pointer"
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

export default AdminCategories;
