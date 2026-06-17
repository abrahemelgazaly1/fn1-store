import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import { API_URL } from '../config';
import { FiUpload, FiX, FiCopy, FiCheck } from 'react-icons/fi';

const SHIPPING_COST = 120;
const VODAFONE_NUMBER = '01021623791';

const EGYPT_GOVERNORATES = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحر الأحمر',
  'البحيرة', 'الفيوم', 'الغربية', 'الإسماعيلية', 'المنوفية',
  'المنيا', 'القليوبية', 'الوادي الجديد', 'السويس', 'أسوان',
  'أسيوط', 'بني سويف', 'بورسعيد', 'دمياط', 'الشرقية',
  'جنوب سيناء', 'كفر الشيخ', 'مطروح', 'الأقصر', 'قنا',
  'شمال سيناء', 'سوهاج',
];

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    name: '',
    governorate: '',
    address: '',
    phone1: '',
    phone2: '',
    paymentPhone: '',
  });

  const total = cartTotal + SHIPPING_COST;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(VODAFONE_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenVodafone = () => {
    handleCopyNumber();
    window.open(
      `https://vodafonecash.com.eg/`,
      '_blank'
    );
  };

  const handleScreenshot = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setScreenshot(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.governorate || !form.address || !form.phone1 || !form.phone2) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please fill all fields', confirmButtonColor: '#171717' });
      return;
    }

    if (form.phone1 === form.phone2) {
      Swal.fire({ icon: 'warning', title: 'Invalid', text: 'Phone numbers must be different', confirmButtonColor: '#171717' });
      return;
    }

    if (!form.paymentPhone) {
      Swal.fire({ icon: 'warning', title: 'Payment Info', text: 'Please enter the phone number you sent from', confirmButtonColor: '#171717' });
      return;
    }

    if (!screenshot) {
      Swal.fire({ icon: 'warning', title: 'Screenshot Required', text: 'Please upload payment screenshot', confirmButtonColor: '#171717' });
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
        payment: {
          method: 'vodafone_cash',
          fromPhone: form.paymentPhone,
          toPhone: VODAFONE_NUMBER,
          screenshot: screenshot,
        },
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
          text: 'Thank you! Your order is being reviewed.',
          confirmButtonColor: '#171717',
        }).then(() => navigate('/'));
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
            <input type="text" name="name" value={form.name} onChange={handleChange}
              className="input-style" placeholder="Enter your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Governorate</label>
            <select name="governorate" value={form.governorate} onChange={handleChange} className="input-style">
              <option value="">Select your governorate</option>
              {EGYPT_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Address</label>
            <input type="text" name="address" value={form.address} onChange={handleChange}
              className="input-style" placeholder="Enter your address" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number 1</label>
            <input type="tel" name="phone1" value={form.phone1} onChange={handleChange}
              className="input-style" placeholder="Enter phone number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number 2</label>
            <input type="tel" name="phone2" value={form.phone2} onChange={handleChange}
              className="input-style" placeholder="Enter another phone number" />
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <h2 className="font-display font-semibold text-neutral-900 mb-4 text-lg">Payment Method</h2>

            {/* Vodafone Cash Card */}
            <div className="border-2 border-red-500 rounded-2xl p-4 bg-red-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
                <span className="font-semibold text-neutral-900">Vodafone Cash</span>
                <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">Selected</span>
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Transfer <span className="font-bold text-neutral-900">{total} EGP</span> to our Vodafone Cash number, then upload the screenshot below.
              </p>

              {/* Number + Copy */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-red-200 mb-4">
                <span className="flex-1 font-mono font-bold text-neutral-900 text-lg tracking-widest">{VODAFONE_NUMBER}</span>
                <button type="button" onClick={handleCopyNumber}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-medium hover:bg-neutral-200 transition-colors">
                  {copied ? <FiCheck className="w-3.5 h-3.5 text-green-600" /> : <FiCopy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Shop Now button */}
              <button type="button" onClick={handleOpenVodafone}
                className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors mb-4">
                Shop Now — Open Vodafone Cash
              </button>

              {/* Sender phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Phone number you sent from
                </label>
                <input type="tel" name="paymentPhone" value={form.paymentPhone} onChange={handleChange}
                  className="input-style" placeholder="e.g. 010XXXXXXXX" />
              </div>

              {/* Screenshot upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Payment Screenshot
                </label>
                {screenshot ? (
                  <div className="relative">
                    <img src={screenshot} alt="Payment proof" className="w-full rounded-xl object-contain max-h-48 bg-neutral-100" />
                    <button type="button" onClick={() => setScreenshot(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow">
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 w-full py-6 border-2 border-dashed border-red-200 rounded-xl cursor-pointer hover:border-red-400 transition-colors bg-white">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
                    <FiUpload className="w-6 h-6 text-red-400" />
                    <span className="text-sm text-neutral-500">Upload payment screenshot</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full btn-primary mt-6 disabled:bg-neutral-300 disabled:cursor-not-allowed">
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>

        {/* Shipping Info */}
        <div className="mt-8 bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
          <div className="text-center">
            <h3 className="font-display font-semibold text-neutral-900 mb-3">Shipping Information</h3>
            <p className="text-neutral-600 text-sm mb-2">Delivery takes 3-5 business days</p>
            <p className="text-neutral-900 font-medium text-sm mb-3">Shipping Cost: 120 EGP</p>
            <p className="text-neutral-500 text-xs">الغربية، المحلة الكبرى، عند بنزينة الزعبلاوي</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
