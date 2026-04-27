import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import QuickOrder from './QuickOrder';

const ProductCard = ({ product }) => {
  const [showQuickOrder, setShowQuickOrder] = useState(false);

  if (!product) return null;

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '';

  return (
    <>
      <div className="relative bg-white rounded-2xl overflow-hidden card-hover group animate-fadeIn">
        {/* Sold Out Badge */}
        {product.soldOut && (
          <div className="absolute top-3 left-3 z-10 bg-neutral-900 text-white px-3 py-1.5 rounded-full text-xs font-medium tracking-wide">
            SOLD OUT
          </div>
        )}

        {/* Quick Add Button */}
        {!product.soldOut && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowQuickOrder(true);
            }}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm text-neutral-900 rounded-full flex items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-neutral-900 hover:text-white"
          >
            <FiShoppingBag className="w-4 h-4" />
          </button>
        )}

        {/* Image */}
        <Link to={`/product/${product._id}`}>
          <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>

        {/* Info */}
        <div className="p-4 text-center">
          <h3 className="font-medium text-neutral-800 mb-1 truncate text-sm">{product.name}</h3>
          <p className="font-display text-lg font-semibold text-neutral-900">{product.price} EGP</p>
        </div>
      </div>

      {/* Quick Order Modal */}
      {showQuickOrder && (
        <QuickOrder product={product} onClose={() => setShowQuickOrder(false)} />
      )}
    </>
  );
};

export default ProductCard;
