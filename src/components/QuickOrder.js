import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const CATEGORIES_WITH_SIZES = ['T-Shirts', 't-shirts', 'Boxers', 'boxers'];

const QuickOrder = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addToCart } = useCart();

  const categoryHasSizes = () => {
    return product && CATEGORIES_WITH_SIZES.includes(product.category);
  };

  const handleAddToCart = () => {
    // Check if size is required for this category
    if (categoryHasSizes() && !selectedSize) {
      Swal.fire({
        icon: 'warning',
        title: 'Select size',
        text: 'Please select a size',
        confirmButtonColor: '#171717',
      });
      return;
    }
    if (!selectedColor) {
      Swal.fire({
        icon: 'warning',
        title: 'Select color',
        text: 'Please select a color',
        confirmButtonColor: '#171717',
      });
      return;
    }
    addToCart(product, selectedSize || 'N/A', selectedColor, 1);
    Swal.fire({
      icon: 'success',
      title: 'Added to cart!',
      showConfirmButton: false,
      timer: 1200,
    });
    onClose();
  };

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl p-6 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-5">
          <div className="flex gap-4">
            <img src={mainImage} alt={product.name} className="w-20 h-24 object-cover rounded-xl bg-neutral-100" />
            <div>
              <h3 className="font-display font-semibold text-neutral-900">{product.name}</h3>
              <p className="font-display text-xl font-bold text-neutral-900 mt-1">{product.price} EGP</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <FiX className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Size Selection - Only show if category has sizes */}
        {categoryHasSizes() && product.sizes && product.sizes.length > 0 && (
          <div className="mb-5">
            <p className="text-sm font-medium text-neutral-700 mb-2.5">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const isSoldOut = product.soldOutSizes?.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => !isSoldOut && setSelectedSize(size)}
                    disabled={isSoldOut}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isSoldOut 
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50' 
                        : selectedSize === size
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {size}
                    {isSoldOut && <span className="ml-1 text-xs">(Out)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Color Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-neutral-700 mb-2.5">Color</p>
          <div className="flex flex-wrap gap-2">
            {product.colors?.map((color) => {
              const isSoldOut = product.soldOutColors?.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => !isSoldOut && setSelectedColor(color)}
                  disabled={isSoldOut}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isSoldOut 
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50' 
                      : selectedColor === color
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {color}
                  {isSoldOut && <span className="ml-1 text-xs">(Out)</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-[7] btn-primary"
          >
            Add to Cart
          </button>
          <button
            onClick={onClose}
            className="flex-[3] btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickOrder;
