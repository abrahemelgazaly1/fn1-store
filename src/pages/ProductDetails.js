import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { useCart } from '../context/CartContext';
import { FiMinus, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { API_URL } from '../config';

const CATEGORIES_WITH_SIZES = ['T-Shirts', 't-shirts', 'Boxers', 'boxers'];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const categoryHasSizes = () => {
    return product && CATEGORIES_WITH_SIZES.includes(product.category);
  };

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        const relRes = await fetch(`${API_URL}/api/products`);
        const relData = await relRes.json();
        setRelatedProducts(relData.filter((p) => p._id !== id).slice(0, 4));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Check if size is required for this category
    if (categoryHasSizes() && !selectedSize) {
      Swal.fire({ icon: 'warning', title: 'Select size', text: 'Please select a size', confirmButtonColor: '#171717' });
      return;
    }
    if (!selectedColor) {
      Swal.fire({ icon: 'warning', title: 'Select color', text: 'Please select a color', confirmButtonColor: '#171717' });
      return;
    }
    if (product.soldOut) {
      Swal.fire({ icon: 'error', title: 'Sold Out', text: 'This product is currently unavailable', confirmButtonColor: '#171717' });
      return;
    }
    addToCart(product, selectedSize || 'N/A', selectedColor, quantity);
    Swal.fire({ icon: 'success', title: 'Added to cart!', showConfirmButton: false, timer: 1200 });
  };

  const handleCheckout = () => {
    // Check if size is required for this category
    if (categoryHasSizes() && !selectedSize) {
      Swal.fire({ icon: 'warning', title: 'Select size', text: 'Please select a size', confirmButtonColor: '#171717' });
      return;
    }
    if (!selectedColor) {
      Swal.fire({ icon: 'warning', title: 'Select color', text: 'Please select a color', confirmButtonColor: '#171717' });
      return;
    }
    addToCart(product, selectedSize || 'N/A', selectedColor, quantity);
    navigate('/checkout');
  };

  if (loading) return <Loading fullPage />;
  if (!product) return <div className="pt-20 text-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 pb-8 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="animate-fadeIn">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 mb-4">
              <img
                src={product.images?.[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                    selectedImage === idx ? 'ring-2 ring-neutral-900' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-fadeIn">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-2">{product.name}</h1>
            <p className="font-display text-3xl font-bold text-neutral-900 mb-8">{product.price} EGP</p>

            {/* Colors */}
            <div className="mb-6">
              <p className="text-sm font-medium text-neutral-700 mb-3">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map((color) => {
                  const isSoldOut = product.soldOutColors?.includes(color);
                  return (
                    <button
                      key={color}
                      onClick={() => !isSoldOut && setSelectedColor(color)}
                      disabled={isSoldOut}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                        isSoldOut 
                          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50' 
                          : selectedColor === color
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {color}
                      {isSoldOut && <span className="ml-1 text-xs">(Sold Out)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes - Only show if category has sizes */}
            {categoryHasSizes() && product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-neutral-700 mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSoldOut = product.soldOutSizes?.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => !isSoldOut && setSelectedSize(size)}
                        disabled={isSoldOut}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                          isSoldOut 
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-50' 
                            : selectedSize === size
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {size}
                        {isSoldOut && <span className="ml-1 text-xs">(Sold Out)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-sm font-medium text-neutral-700 mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center hover:bg-neutral-200 transition-colors"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="font-display text-xl font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center hover:bg-neutral-200 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.soldOut}
                className={`w-full py-4 rounded-full font-medium transition-all duration-200 ${
                  product.soldOut ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' : 'btn-primary'
                }`}
              >
                {product.soldOut ? 'Sold Out' : 'Add to Cart'}
              </button>
              <button
                onClick={handleCheckout}
                disabled={product.soldOut}
                className={`w-full py-4 rounded-full font-medium transition-all duration-200 ${
                  product.soldOut ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed' : 'btn-secondary'
                }`}
              >
                Proceed to Checkout
              </button>
            </div>

            {/* Description Accordion */}
            <div className="border-t border-neutral-100 py-4">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="w-full flex items-center justify-between text-sm font-medium text-neutral-700"
              >
                Description
                {showDescription ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
              </button>
              {showDescription && (
                <p className="mt-3 text-neutral-500 text-sm leading-relaxed">{product.description || 'No description available.'}</p>
              )}
            </div>

            {/* Size Chart - Only show if category has sizes */}
            {categoryHasSizes() && (
              <div className="border-t border-neutral-100 py-4">
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="w-full flex items-center justify-between text-sm font-medium text-neutral-700"
                >
                  Size Chart
                  {showSizeChart ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>
                {showSizeChart && (
                  <div className="mt-3">
                    <img
                      src="/chart.jpg"
                      alt="Size Chart"
                      className="w-full rounded-xl"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl font-bold text-neutral-900">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
