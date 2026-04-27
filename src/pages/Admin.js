import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiX, FiPlus, FiPackage, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import { API_URL } from '../config';

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['BLACK', 'WHITE', 'BLUE', 'RED', 'BEIGE', 'PINK', 'GRAY', 'BROWN', 'GREEN', 'YELLOW'];
const CATEGORIES = ['T-Shirts', 'Cap', 'Bracelet', 'Wallet', 'Belt', 'Necklace', 'Ring', 'Boxers', 'Bags'];
const CATEGORIES_WITH_SIZES = ['T-Shirts', 'Boxers']; // Only these categories have sizes

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('add');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: '', price: '', description: '', category: '',
    sizes: [], colors: [], images: [], soldOutSizes: [], soldOutColors: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
    fetchProducts();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) { console.error(error); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (error) { console.error(error); }
  };

  const getSizes = () => CLOTHING_SIZES;
  
  const categoryHasSizes = () => CATEGORIES_WITH_SIZES.includes(form.category);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
    Swal.fire({ icon: 'success', title: 'Images uploaded!', showConfirmButton: false, timer: 1200 });
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }));
  };

  const toggleColor = (color) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color],
    }));
  };

  const toggleSoldOutSize = (size) => {
    setForm((prev) => ({
      ...prev,
      soldOutSizes: prev.soldOutSizes?.includes(size) 
        ? prev.soldOutSizes.filter((s) => s !== size) 
        : [...(prev.soldOutSizes || []), size],
    }));
  };

  const toggleSoldOutColor = (color) => {
    setForm((prev) => ({
      ...prev,
      soldOutColors: prev.soldOutColors?.includes(color) 
        ? prev.soldOutColors.filter((c) => c !== color) 
        : [...(prev.soldOutColors || []), color],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category || form.colors.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Missing fields', text: 'Please fill all required fields', confirmButtonColor: '#171717' });
      return;
    }
    
    // Check if sizes are required for this category
    if (categoryHasSizes() && form.sizes.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Missing sizes', text: 'Please select at least one size', confirmButtonColor: '#171717' });
      return;
    }
    
    setLoading(true);
    try {
      const url = editingProduct ? `${API_URL}/api/products/${editingProduct._id}` : `${API_URL}/api/products`;
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: editingProduct ? 'Updated!' : 'Added!', showConfirmButton: false, timer: 1200 });
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Failed', confirmButtonColor: '#171717' });
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ name: '', price: '', description: '', category: '', sizes: [], colors: [], images: [], soldOutSizes: [], soldOutColors: [] });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name, price: product.price.toString(), description: product.description || '',
      category: product.category, sizes: product.sizes || [], colors: product.colors || [], images: product.images || [],
      soldOutSizes: product.soldOutSizes || [], soldOutColors: product.soldOutColors || [],
    });
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#171717', cancelButtonColor: '#ef4444',
    });
    if (result.isConfirmed) {
      await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  const handleSoldOut = async (product) => {
    await fetch(`${API_URL}/api/products/${product._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, soldOut: !product.soldOut }),
    });
    fetchProducts();
  };

  const handleOrderStatus = async (orderId, status) => {
    await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const handleDeleteOrder = async (id) => {
    const result = await Swal.fire({
      title: 'Delete order?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#171717', cancelButtonColor: '#ef4444',
    });
    if (result.isConfirmed) {
      await fetch(`${API_URL}/api/orders/${id}`, { method: 'DELETE' });
      fetchOrders();
    }
  };

  const tabs = [
    { id: 'add', label: 'Add Product', icon: FiPlus },
    { id: 'manage', label: 'Products', icon: FiPackage },
    { id: 'orders', label: `Orders (${orders.length})`, icon: FiShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="FN1" className="w-9 h-9 rounded-full object-cover" />
            <h1 className="font-display text-lg font-bold text-neutral-900">FN1 Admin Panel</h1>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/admin/login');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-neutral-900 border-b-2 border-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {/* ADD PRODUCT */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-2xl p-6 space-y-5 animate-fadeIn">
            <h2 className="font-display text-xl font-bold text-neutral-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <input type="text" placeholder="Product Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-style" />
            
            <input type="number" placeholder="Price (EGP)" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input-style" />
            
            <textarea placeholder="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-style h-24 resize-none" />
            
            <select value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value, sizes: [] })}
              className="input-style">
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            {form.category && (
              <>
                {categoryHasSizes() && (
                  <div>
                    <p className="text-sm font-medium text-neutral-700 mb-2">Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {getSizes().map((size) => (
                        <div key={size} className="relative">
                          <button onClick={() => toggleSize(size)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                              form.sizes.includes(size) ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'
                            }`}>
                            {size}
                          </button>
                          {form.sizes.includes(size) && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleSoldOutSize(size); }}
                              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold ${
                                form.soldOutSizes?.includes(size) ? 'bg-red-500 text-white' : 'bg-yellow-400 text-neutral-900'
                              }`}
                              title={form.soldOutSizes?.includes(size) ? 'Sold Out' : 'In Stock'}
                            >
                              {form.soldOutSizes?.includes(size) ? '✕' : '✓'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">Click the badge to mark size as sold out</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-2">Colors</p>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((color) => (
                      <div key={color} className="relative">
                        <button onClick={() => toggleColor(color)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            form.colors.includes(color) ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'
                          }`}>
                          {color}
                        </button>
                        {form.colors.includes(color) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSoldOutColor(color); }}
                            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold ${
                              form.soldOutColors?.includes(color) ? 'bg-red-500 text-white' : 'bg-yellow-400 text-neutral-900'
                            }`}
                            title={form.soldOutColors?.includes(color) ? 'Sold Out' : 'In Stock'}
                          >
                            {form.soldOutColors?.includes(color) ? '✕' : '✓'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">Click the badge to mark color as sold out</p>
                </div>
              </>
            )}

            <div>
              <label className="block w-full py-4 border-2 border-dashed border-neutral-200 rounded-xl text-center cursor-pointer hover:border-neutral-400 transition-colors">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                <span className="text-neutral-500 text-sm">Click to upload images</span>
              </label>
              {form.images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt="" className="w-16 h-20 object-cover rounded-lg" />
                      <button onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleSubmit} disabled={loading} className="w-full btn-primary disabled:bg-neutral-300">
              {loading ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
            </button>
            {editingProduct && (
              <button onClick={resetForm} className="w-full btn-secondary">Cancel</button>
            )}
          </div>
        )}

        {/* MANAGE PRODUCTS */}
        {activeTab === 'manage' && (
          <div className="space-y-4 animate-fadeIn">
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <FiPackage className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 font-medium">No products yet</p>
                <p className="text-neutral-400 text-sm mt-1">Add your first product to get started</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="bg-white rounded-2xl p-4 flex gap-4">
                  <img src={product.images?.[0]} alt={product.name} className="w-20 h-24 object-cover rounded-xl bg-neutral-100" />
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900">{product.name}</h3>
                    <p className="text-neutral-500 text-sm">{product.price} EGP • {product.category}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleDelete(product._id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">
                        Delete
                      </button>
                      <button onClick={() => handleEdit(product)}
                        className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-medium hover:bg-neutral-200">
                        Edit
                      </button>
                      <button onClick={() => handleSoldOut(product)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                          product.soldOut ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                        {product.soldOut ? 'In Stock' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <FiShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 font-medium">No orders yet</p>
                <p className="text-neutral-400 text-sm mt-1">Orders will appear here when customers place them</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl p-4">
                  <p className="text-xs text-neutral-400 mb-3">{new Date(order.createdAt).toLocaleString()}</p>
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-neutral-50 rounded-xl">
                        <img src={item.image} alt="" className="w-14 h-16 md:w-16 md:h-20 object-cover rounded-lg bg-neutral-100 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 text-sm truncate">{item.name}</p>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1.5 text-xs">
                            <p className="text-neutral-500"><span className="font-medium text-neutral-700">Size:</span> {item.size}</p>
                            <p className="text-neutral-500"><span className="font-medium text-neutral-700">Color:</span> {item.color}</p>
                            <p className="text-neutral-500"><span className="font-medium text-neutral-700">Count:</span> {item.quantity}</p>
                            <p className="text-neutral-900 font-semibold">{item.price * item.quantity} EGP</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Customer Info */}
                  <div className="border-t border-neutral-100 pt-4">
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">Customer Info</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p className="text-neutral-700"><span className="font-medium text-neutral-900">Name:</span> {order.customer?.name}</p>
                      <p className="text-neutral-700"><span className="font-medium text-neutral-900">Phone 1:</span> {order.customer?.phone1}</p>
                      <p className="text-neutral-700 md:col-span-2"><span className="font-medium text-neutral-900">Address:</span> {order.customer?.address}</p>
                      {order.customer?.phone2 && (
                        <p className="text-neutral-700"><span className="font-medium text-neutral-900">Phone 2:</span> {order.customer?.phone2}</p>
                      )}
                    </div>
                    <p className="font-display text-lg font-bold text-neutral-900 mt-4">Total: {order.total} EGP</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <select value={order.status} onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                      className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button onClick={() => handleDeleteOrder(order._id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
