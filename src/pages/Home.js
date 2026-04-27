import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_URL } from '../config';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  const categories = [
    { name: 'T-Shirts', image: '/T-SHIRT.png' },
    { name: 'Caps', image: '/CAP.png' },
    { name: 'Bracelets', image: '/Bracelet.png' },
    { name: 'Wallets', image: '/Wallet.png' },
    { name: 'Belts', image: '/belt.png' },
    { name: 'Necklaces', image: '/Necklace.png' },
    { name: 'Rings', image: '/ring.png' },
    { name: 'Boxers', image: '/boxers.png' },
    { name: 'Bags', image: '/bags.png' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-scroll categories slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;
    const scrollSpeed = 1;
    
    const autoScroll = setInterval(() => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= slider.scrollWidth / 2) {
        scrollAmount = 0;
      }
      slider.scrollLeft = scrollAmount;
    }, 30);

    return () => clearInterval(autoScroll);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="h-[80vh] relative flex items-end justify-center pb-16 mt-[96px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/hero.jpg')`,
          }}
        ></div>
        <div className="relative z-10 text-center text-white px-4">
          <Link
            to="/products"
            className="inline-block bg-white text-neutral-900 px-10 py-4 font-medium text-sm tracking-wide hover:bg-neutral-100 transition-all duration-200 rounded-full"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Slider Section */}
      <section className="py-20 px-4 bg-white overflow-hidden">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-neutral-500 mb-3">Browse</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">Categories</h2>
        </div>
        
        <div className="relative">
          <div 
            ref={sliderRef}
            className="flex gap-6 overflow-x-hidden"
            style={{ scrollBehavior: 'auto' }}
          >
            {/* Duplicate categories for infinite scroll effect */}
            {[...categories, ...categories].map((cat, index) => (
              <Link
                key={`${cat.name}-${index}`}
                to={`/category/${cat.name.toLowerCase()}`}
                className="group flex-shrink-0 w-64"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden card-hover bg-neutral-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-neutral-900 font-display text-lg font-semibold text-center mt-3">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News Ticker Section */}
      <section className="py-12 bg-white overflow-hidden border-y border-neutral-100">
        <div className="ticker-wrapper">
          <div className="ticker-fast">
            <span className="ticker-item-dark">ELEVATE YOUR STYLE WITH FN1</span>
            <span className="ticker-item-dark">PREMIUM QUALITY ACCESSORIES</span>
            <span className="ticker-item-dark">EXPRESS YOURSELF WITH CONFIDENCE</span>
            <span className="ticker-item-dark">ELEVATE YOUR STYLE WITH FN1</span>
            <span className="ticker-item-dark">PREMIUM QUALITY ACCESSORIES</span>
            <span className="ticker-item-dark">EXPRESS YOURSELF WITH CONFIDENCE</span>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-neutral-500 mb-3">Featured</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900">PRODUCTS</h2>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-neutral-200 rounded-2xl"></div>
                <div className="h-4 bg-neutral-200 rounded mt-3 w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded mt-2 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden card-hover bg-neutral-100">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-neutral-900 font-medium text-sm md:text-base mt-3">{product.name}</h3>
                  <p className="text-neutral-900 font-display font-bold text-base md:text-lg">{product.price} EGP</p>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-block bg-neutral-900 text-white px-10 py-4 font-medium text-sm tracking-wide hover:bg-neutral-800 transition-all duration-200 rounded-full"
              >
                View More
              </Link>
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Home;
