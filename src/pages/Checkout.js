import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import { API_URL } from '../config';

const SHIPPING_COST = 120;

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone1: '',
    phone2: '',
  });

  const total = cartTotal + SHIPPING_COST;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.phone1 || !form.phone2) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please fill all fields', confirmButtonColor: '#171717' });
      return;
    }

    if (form.phone1 === form.phone2) {
      Swal.fire({ icon: 'warning', title: 'Invalid', text: 'Phone numbers must be different', confirmButtonColor: '#171717' });
      return;
    }

    if (cart.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Empty Cart', text: 'Your cart is empty', confirmButtonColor: '#171717' });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          image: item.images?.[0],
        })),
        customer: form,
        subtotal: cartTotal,
        shipping: SHIPPING_COST,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        clearCart();
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Thank you for your order',
          confirmButtonColor: '#171717',
        }).then(() => {
          navigate('/');
        });
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong', confirmButtonColor: '#171717' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-8 px-4 max-w-lg mx-auto animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">Checkout</h1>
          <p className="text-neutral-500">Complete your order</p>
        </div>

        {/* Order Summary */}
        <div className="bg-neutral-50 rounded-2xl p-5 mb-6">
          <h2 className="font-display font-semibold text-neutral-900 mb-4">Order Summary</h2>
          {cart.map((item, idx) => (
            <div key={idx} className="flex gap-3 mb-3">
              <img src={item.images?.[0]} alt={item.name} className="w-14 h-18 object-cover rounded-lg bg-neutral-200" />
              <div className="flex-1">
                <p className="font-medium text-neutral-900 text-sm">{item.name}</p>
                <p className="text-neutral-500 text-xs">{item.color} / {item.size} × {item.quantity}</p>
                <p className="font-semibold text-neutral-900 text-sm mt-0.5">{item.price * item.quantity} EGP</p>
              </div>
            </div>
          ))}
          <div className="border-t border-neutral-200 pt-3 mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Subtotal</span>
              <span className="text-neutral-900">{cartTotal} EGP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Shipping</span>
              <span className="text-neutral-900">{SHIPPING_COST} EGP</span>
            </div>
            <div className="flex justify-between font-display font-bold text-lg pt-2">
              <span>Total</span>
              <span>{total} EGP</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-style"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="input-style"
              placeholder="Enter your address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number 1</label>
            <input
              type="tel"
              name="phone1"
              value={form.phone1}
              onChange={handleChange}
              className="input-style"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number 2</label>
            <input
              type="tel"
              name="phone2"
              value={form.phone2}
              onChange={handleChange}
              className="input-style"
              placeholder="Enter another phone number"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary mt-6 disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'BUY IT'}
          </button>
        </form>

        {/* Shipping Info Card */}
        <div className="mt-8 bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
          <div className="text-center">
            <h3 className="font-display font-semibold text-neutral-900 mb-3">Shipping Information</h3>
            <p className="text-neutral-600 text-sm mb-2">Delivery takes 3-5 business days</p>
            <p className="text-neutral-900 font-medium text-sm mb-3">Shipping Cost: 120 EGP</p>
            <p className="text-neutral-500 text-xs mb-3">25 عمارات الفتح، حي السفارات، مدينة نصر - بجوار السجل المدني</p>
            <p className="text-neutral-600 text-sm">
              Need to transfer money? 
              <a 
                href="https://wa.me/201012058699" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-900 font-medium hover:underline ml-1"
              >
                Contact us on WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
