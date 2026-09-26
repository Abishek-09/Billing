import React from 'react';
import TopBar from './TopBar';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../data/mockData';
import { Sparkles, UtensilsCrossed } from 'lucide-react';

export const ProductCatalog = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onAddToCart,
  cartItems,
}) => {
  // Create cart quantity lookup map
  const cartQuantityMap = cartItems.reduce((acc, item) => {
    acc[item.id] = item.quantity;
    return acc;
  }, {});

  // Filter products by category and search query
  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FDFBF7] relative">
      {/* Top Bar: Search bar & Admin profile */}
      <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden px-8 py-5">
        {/* Category Filters Bar */}
        <div className="flex items-center justify-between gap-4 mb-5 shrink-0">
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-[#116D6E] text-white shadow-teal'
                      : 'bg-white text-[#321E1E] border border-[#4E3636]/15 hover:border-[#116D6E]/50 hover:bg-[#FDFBF7]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-medium text-[#4E3636] shrink-0 hidden sm:block">
            Showing <span className="font-bold text-[#321E1E]">{filteredProducts.length}</span> delicacies
          </div>
        </div>

        {/* Product Grid: 4 columns */}
        <div className="flex-1 overflow-y-auto pr-1 pb-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  cartQuantity={cartQuantityMap[product.id] || 0}
                />
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-white/60 rounded-2xl border border-dashed border-[#4E3636]/20 mt-4">
              <UtensilsCrossed className="w-12 h-12 text-[#4E3636]/40 mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                No bakery items found
              </h3>
              <p className="text-xs text-[#4E3636] mt-1 max-w-sm">
                We couldn&apos;t find anything matching &quot;{searchQuery}&quot; in the &quot;{selectedCategory}&quot; category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSelectCategory('All');
                }}
                className="mt-4 px-4 py-2 bg-[#116D6E] text-white rounded-lg text-xs font-semibold hover:bg-[#0e5859] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductCatalog;
