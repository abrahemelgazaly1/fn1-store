import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';

const SHIPPING_COST = 120;

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const total = cartTotal + (cart.length > 0 ? SHIPPING_COST : 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-8 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">Shopping Cart</h1>
          <p className="text-neutral-500">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-500 mb-6">Your cart is empty</p>
            <Link to="/products" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="animate-fadeIn">
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-neutral-50 rounded-2xl">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl bg-neutral-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900">{item.name}</h3>
                    <p className="text-neutral-500 text-sm mt-0.5">
                      {item.color} / {item.size}
                    </p>
                    <p className="font-display font-semibold text-neutral-900 mt-1">{item.price} EGP</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)}
                          className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)}
                          className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id, item.size, item.color)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-neutral-50 rounded-2xl p-6">
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium text-neutral-900">{cartTotal} EGP</span>
              </div>
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-medium text-neutral-900">{SHIPPING_COST} EGP</span>
              </div>
              <div className="border-t border-neutral-200 pt-4 flex justify-between">
                <span className="font-display font-semibold text-neutral-900">Total</span>
                <span className="font-display text-xl font-bold text-neutral-900">{total} EGP</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 btn-primary"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
