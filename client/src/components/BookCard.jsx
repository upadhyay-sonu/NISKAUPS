import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Zap } from 'lucide-react';
import { handleImageError, PLACEHOLDER_IMAGE } from '../utils/imageHandler';

const BookCard = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onBuyNow,
  variant = 'light',
  onRemoveFavorite // For Favorites.jsx
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={`flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${isDark ? 'bg-[#0a0a0a] border border-white/10 card-glass' : 'bg-white border border-neutral-200 shadow-sm'}`}>
      
      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="block relative group overflow-hidden">
        <div className={`w-full aspect-[2/3] overflow-hidden relative ${isDark ? 'bg-[#111]' : 'bg-neutral-100'}`}>
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.title || "Product"}
              loading="lazy"
              crossOrigin="anonymous"
              onError={(e) => handleImageError(e, PLACEHOLDER_IMAGE)}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 group-hover:scale-105"
            />
          ) : (
            <img
              src={PLACEHOLDER_IMAGE}
              alt="No image available"
              className="w-full h-full object-cover opacity-50"
            />
          )}

          {/* Dark Overlay for dark theme */}
          {isDark && <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>}

          {/* Optional Favorite Button overlay */}
          {onToggleFavorite && (
             <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(product);
              }}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all z-10"
            >
              <Heart
                size={18}
                className={`transition-colors ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                }`}
              />
            </button>
          )}

          {/* Limited Edition Badge */}
          {product.isLimitedEdition && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded shadow-sm font-medium">
                Limited
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content Container */}
      <div className={`p-4 flex flex-col flex-grow ${isDark ? 'text-white' : 'text-neutral-900'}`}>
        <Link to={`/product/${product._id}`}>
          <h3 className={`font-serif font-bold text-lg mb-1 line-clamp-2 ${isDark ? 'hover:text-accentPurple' : 'hover:text-primary'} transition-colors`}>
            {product.title || "Untitled"}
          </h3>
          <p className={`text-sm mb-3 ${isDark ? 'text-secondaryText' : 'text-neutral-600'}`}>
            {product.author || 'Unknown Author'}
          </p>
        </Link>

        {/* Price alignment */}
        <div className="flex justify-between items-center mb-4 mt-auto">
          <div className="flex items-center gap-2">
            {product.salePrice && product.salePrice > 0 ? (
              <>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-primary'}`}>
                  ${product.salePrice.toFixed(2)}
                </span>
                <span className={`text-xs line-through ${isDark ? 'text-secondaryText' : 'text-neutral-500'}`}>
                  ${product.price?.toFixed(2)}
                </span>
              </>
            ) : (
              <span className={`font-bold ${isDark ? 'text-white' : 'text-primary'}`}>
                ${product.price?.toFixed(2) || "N/A"}
              </span>
            )}
          </div>
          
          {isDark && (
             <div className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${product.stock > 0 ? 'bg-white/10 text-white' : 'bg-red-500/10 text-red-400'}`}>
               {product.stock > 0 ? 'In Stock' : 'Sold Out'}
             </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isDark && (onAddToCart || onBuyNow || onRemoveFavorite) && (
          <div className="flex gap-2">
            {onAddToCart && (
               <button
                  onClick={() => onAddToCart(product)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
               >
                 <ShoppingCart size={16} />
                 <span className="hidden sm:inline">Add</span>
               </button>
            )}
            {onBuyNow && (
               <button
                  onClick={() => onBuyNow(product)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
               >
                 <Zap size={16} />
                 <span className="hidden sm:inline">Buy</span>
               </button>
            )}
            {onRemoveFavorite && (
               <button
                 onClick={() => onRemoveFavorite(product._id)}
                 className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                 title="Remove from favorites"
               >
                 <Heart size={18} className="fill-red-500" />
               </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
