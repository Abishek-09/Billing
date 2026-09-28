import React, { useState } from 'react';
import {
  Tags,
  ArrowRight,
  Search,
  CheckCircle2,
  TrendingUp,
  Percent,
  CakeSlice,
  Boxes,
  X,
  Sparkles,
  ShoppingBag,
  Layers
} from 'lucide-react';
import { BAKERY_CATEGORIES, PRODUCTS } from '../data/mockData';

export const CategoriesView = ({ onBackToBilling, onSelectCategory }) => {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryItems, setSelectedCategoryItems] = useState(null);

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      q === '' ||
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FDFBF7]">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#116D6E]" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#321E1E]">
              Bakery Categories
            </h2>
          </div>
          <p className="text-xs text-[#4E3636] mt-1">
            Browse bakery product classifications, tax slabs, and catalog grouping
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToBilling}
            className="px-4 py-2.5 bg-[#116D6E] hover:bg-[#0e5859] text-white rounded-xl text-xs font-bold transition-all shadow-teal flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Go to POS Billing</span>
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">Total Categories</span>
            <div className="w-8 h-8 rounded-lg bg-[#116D6E]/10 flex items-center justify-center text-[#116D6E]">
              <Tags className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#321E1E] mt-2">{categories.length}</div>
          <span className="text-[10px] text-emerald-700 font-medium">All active in POS catalog</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">Top Performing</span>
            <div className="w-8 h-8 rounded-lg bg-[#CD1818]/10 flex items-center justify-center text-[#CD1818]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#CD1818] mt-2">Cakes</div>
          <span className="text-[10px] text-[#4E3636] font-medium">42% of total POS sales</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">Catalog Items</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <CakeSlice className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#321E1E] mt-2">{PRODUCTS.length} Delicacies</div>
          <span className="text-[10px] text-[#4E3636] font-medium">Across all collections</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-center justify-between text-[#4E3636]">
            <span className="text-xs font-semibold">Tax Slabs</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#116D6E] mt-2">0% &amp; 5%</div>
          <span className="text-[10px] text-emerald-700 font-medium">GST compliant slabs</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#4E3636]/15 shadow-soft mb-6">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#4E3636]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name or description..."
            className="w-full bg-[#FDFBF7] text-xs text-[#321E1E] font-medium pl-10 pr-8 py-2.5 rounded-xl border border-[#4E3636]/20 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 placeholder-[#4E3636]/40 shadow-inner"
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
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const catProducts = PRODUCTS.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase());
          const actualCount = catProducts.length || cat.itemCount || 0;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-[#4E3636]/15 shadow-soft overflow-hidden flex flex-col hover:shadow-soft-lg hover:-translate-y-0.5 transition-all group"
            >
              {/* Category Image Banner */}
              <div className="h-40 relative overflow-hidden bg-[#321E1E]/5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-[#321E1E] shadow-sm">
                    {cat.taxRate}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#116D6E] text-white shadow-sm">
                    {cat.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-serif text-xl font-bold text-white leading-tight drop-shadow-sm">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-white/90 font-medium">
                    {actualCount} Menu Items &bull; {cat.revenueShare} Sales Volume
                  </span>
                </div>
              </div>

              {/* Category Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-[#4E3636] leading-relaxed line-clamp-2">
                  {cat.description}
                </p>

                {/* Meta details */}
                <div className="pt-3 border-t border-[#4E3636]/10 flex items-center justify-between text-xs">
                  <span className="text-[#4E3636]">Popular:</span>
                  <span className="font-semibold text-[#116D6E] truncate max-w-[180px]">
                    {cat.popularItem}
                  </span>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (onSelectCategory) {
                        onSelectCategory(cat.name);
                      } else if (onBackToBilling) {
                        onBackToBilling();
                      }
                    }}
                    className="flex-1 py-2 px-3 bg-[#116D6E] hover:bg-[#0e5859] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>View in POS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedCategoryItems({ category: cat, items: catProducts })}
                    className="py-2 px-3 bg-[#FDFBF7] hover:bg-[#FDFBF7]/80 border border-[#4E3636]/20 text-[#321E1E] rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    Items ({actualCount})
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>



      {/* Category Items Drawer / Modal */}
      {selectedCategoryItems && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#116D6E] p-4 px-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base">
                  {selectedCategoryItems.category.name} Menu Items
                </h3>
                <p className="text-xs text-white/80">
                  {selectedCategoryItems.items.length} items configured in POS
                </p>
              </div>
              <button
                onClick={() => setSelectedCategoryItems(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedCategoryItems.items.length > 0 ? (
                selectedCategoryItems.items.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <span className="font-bold text-[#321E1E] block">{prod.name}</span>
                        <span className="text-[10px] text-[#4E3636] block line-clamp-1">
                          {prod.description}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#321E1E] text-sm block">₹{prod.price}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Stock: {prod.stock}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#4E3636]">
                  <CakeSlice className="w-8 h-8 mx-auto text-[#4E3636]/40 mb-2" />
                  <p className="font-semibold text-xs">No products currently in this category</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#FDFBF7] border-t border-[#4E3636]/10 flex justify-between items-center">
              <span className="text-xs text-[#4E3636]">
                GST Rate: <strong>{selectedCategoryItems.category.taxRate}</strong>
              </span>
              <button
                onClick={() => {
                  const catName = selectedCategoryItems.category.name;
                  setSelectedCategoryItems(null);
                  if (onSelectCategory) {
                    onSelectCategory(catName);
                  } else if (onBackToBilling) {
                    onBackToBilling();
                  }
                }}
                className="px-4 py-2 bg-[#116D6E] text-white rounded-xl text-xs font-bold hover:bg-[#0e5859] transition-colors"
              >
                Open in POS Billing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesView;
