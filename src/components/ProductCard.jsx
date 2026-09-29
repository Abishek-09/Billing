import React, { useState } from 'react';
import { Plus, Check, Scale } from 'lucide-react';

export const ProductCard = ({ product, onAddToCart, cartQuantity = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const isWeightProduct = product.sellingType === 'WEIGHT';

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    if (!isWeightProduct) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 600);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-200 p-3.5 flex flex-col justify-between border border-[#4E3636]/5 relative cursor-pointer"
      onClick={handleAdd}
    >
      {/* Top Image Container with subtle hover zoom effect */}
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#FDFBF7] mb-3">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Unit badge / Tag */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-semibold text-[#4E3636] shadow-xs">
          {isWeightProduct ? (
            <>
              <Scale className="w-3 h-3 text-[#116D6E]" />
              <span>By Weight</span>
            </>
          ) : (
            <span>{product.unit}</span>
          )}
        </div>

        {/* Cart Quantity Badge if item already in cart */}
        {cartQuantity > 0 && (
          <div className="absolute top-2 right-2 min-w-5 h-5 px-1.5 rounded-full bg-[#CD1818] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
            {cartQuantity}
          </div>
        )}
      </div>

      {/* Card Text: Title in #321E1E bold, Price in #4E3636 medium */}
      <div className="flex-1 flex flex-col justify-between mb-3 text-left">
        <h3 className="text-sm font-bold text-[#321E1E] line-clamp-1 leading-snug" title={product.name}>
          {product.name}
        </h3>
        <p className="text-xs text-[#4E3636]/70 line-clamp-1 mt-0.5">
          {product.description}
        </p>

        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-base font-semibold text-[#4E3636]">
            ₹{product.price.toLocaleString('en-IN')}
            {isWeightProduct && (
              <span className="text-xs font-normal text-[#4E3636]/70 ml-1">/ kg</span>
            )}
          </div>
          <span className="text-[11px] text-[#4E3636]/60">
            {product.category}
          </span>
        </div>
      </div>

      {/* "Add" / "Select Weight" Button */}
      <button
        type="button"
        onClick={handleAdd}
        className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
          isWeightProduct
            ? 'bg-[#116D6E]/10 hover:bg-[#116D6E] text-[#116D6E] hover:text-white border-[#116D6E]/30 hover:border-[#116D6E]'
            : justAdded
            ? 'bg-[#116D6E] text-white border-[#116D6E]'
            : 'text-[#116D6E] hover:bg-[#116D6E] hover:text-white border-[#116D6E]'
        }`}
      >
        {isWeightProduct ? (
          <>
            <Scale className="w-3.5 h-3.5" />
            <span>Select Weight</span>
          </>
        ) : justAdded ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Bill</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ProductCard;

