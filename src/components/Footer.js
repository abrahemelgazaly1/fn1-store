import React from 'react';
import { FaTiktok, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white py-12 mt-16 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <img src="/logo.jpg" alt="FN1-STORE" className="w-16 h-16 rounded-full object-cover mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold tracking-tight text-neutral-900 mb-2">
          FN1-STORE
        </h3>
        <p className="text-neutral-600 text-sm mb-1">✨ Premium Accessories • Unique Style</p>
        <p className="text-neutral-500 text-sm mb-4">Express Yourself with FN1</p>
        <p className="text-neutral-500 text-sm mb-6">
          📞 WhatsApp: 01021623791
        </p>
        <div className="flex justify-center gap-4 mb-6">
          <a 
            href="https://www.tiktok.com/@fn1.store?_r=1&_t=ZS-95tfwyOVp58" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all duration-200"
          >
            <FaTiktok className="w-4 h-4" />
          </a>
          <a 
            href="https://www.instagram.com/fn1.store?igsh=MTB1aTNlaGtnMHMzZw==" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all duration-200"
          >
            <FaInstagram className="w-4 h-4" />
          </a>
          <a 
            href="https://wa.me/2001021623791" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all duration-200"
          >
            <FaWhatsapp className="w-4 h-4" />
          </a>
        </div>
        <p className="text-neutral-400 text-sm">© 2024 FN1-STORE. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
