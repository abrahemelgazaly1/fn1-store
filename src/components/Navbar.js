import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();

  const categories = [
    { name: 'T-Shirts', path: '/category/t-shirts' },
    { name: 'Cap', path: '/category/cap' },
    { name: 'Bracelet', path: '/category/bracelet' },
    { name: 'Wallet', path: '/category/wallet' },
    { name: 'Belt', path: '/category/belt' },
    { name: 'Necklace', path: '/category/necklace' },
    { name: 'Ring', path: '/category/ring' },
    { name: 'Boxers', path: '/category/boxers' },
  ];

  return (
    <>
      {/* Top Nav Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#f5f5f0]">
        <div className="max-w-7xl mx-auto px-4 py-1 text-center">
          <p className="text-black text-sm font-medium tracking-wide">
            FN1 STORE - Premium Accessories Collection
          </p>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="fixed top-[28px] left-0 right-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="FN1" className="w-9 h-9 rounded-full object-cover" />
            </Link>

            {/* Brand Name */}
            <Link to="/" className="font-display text-xl font-bold tracking-tight text-neutral-900">
              FN1-STORE
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <Link to="/cart" className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <FiShoppingBag className="w-5 h-5 text-neutral-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-neutral-900 text-white text-[10px] font-medium w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-neutral-100 animate-fadeIn">
            <div className="px-4 py-3 space-y-1">
              <Link 
                to="/products" 
                className="block py-2.5 px-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg font-medium transition-colors" 
                onClick={() => setIsOpen(false)}
              >
                All Products
              </Link>
              {categories.map(cat => (
                <Link 
                  key={cat.name} 
                  to={cat.path} 
                  className="block py-2.5 px-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg font-medium transition-colors" 
                  onClick={() => setIsOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
