import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, ChevronDown, Facebook, Instagram, Twitter, Mail, ArrowRight } from 'lucide-react'; // Install lucide-react for icons

const Test = () => {
  const [products] = useState([
    { id: 1, name: 'Minimalist Vase', price: '$45.00', image: 'https://placehold.co/300x400/e0e0e0/333' },
    { id: 2, name: 'Ceramic Bowl', price: '$30.00', image: 'https://placehold.co/300x400/e0e0e0/333' },
    { id: 3, name: 'Linen Throw', price: '$85.00', image: 'https://placehold.co/300x400/e0e0e0/333' },
    { id: 4, name: 'Table Lamp', price: '$120.00', image: 'https://placehold.co/300x400/e0e0e0/333' },
  ]);

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-100">
        <div className="text-2xl font-bold tracking-widest uppercase">Aurum Goods</div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-black">Home</a>
          <a href="#" className="text-black">Shop</a>
          <a href="#" className="hover:text-black">About</a>
          <a href="#" className="hover:text-black">Contact</a>
        </div>
        <div className="flex items-center space-x-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          <Menu className="md:hidden w-6 h-6" />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[600px] flex items-center justify-center bg-gray-100 text-center">
        {/* Placeholder for background image */}
        <div className="absolute inset-0 overflow-hidden">
             <img src="https://placehold.co/1920x600/d4d4d4/333" alt="Hero" className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="relative z-10 max-w-2xl px-6">
          <h1 className="text-5xl font-light mb-6 text-white drop-shadow-md">Essentials for Modern Living</h1>
          <button className="px-8 py-3 bg-white text-black text-sm font-semibold tracking-wide uppercase hover:bg-black hover:text-white transition-colors">
            Shop Now
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Toolbar (Filter & Sort) */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-4">
          <button className="flex items-center space-x-2 px-6 py-2 bg-black text-white text-xs uppercase tracking-wider hover:bg-gray-800">
            <span>Filter</span>
          </button>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Sort By:</span>
            <div className="flex items-center cursor-pointer border px-3 py-1">
              <span>Newest</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="w-full h-[400px] bg-gray-100 mb-4 overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button className="absolute bottom-0 w-full bg-black text-white py-3 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Add to Cart
                </button>
              </div>
              <h3 className="text-sm font-medium uppercase tracking-wide">{product.name}</h3>
              <p className="text-gray-500 mt-1">{product.price}</p>
            </div>
          ))}
        </div>

        {/* See All Button */}
        <div className="flex justify-center mt-16">
          <button className="px-10 py-3 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
            See All Products
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section: Newsletter & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold tracking-widest uppercase mb-4">Aurum Goods</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Curated essentials for the modern home. We prioritize quality, minimalism, and timeless design in every product we source.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Join our newsletter</h4>
            <div className="flex border-b border-black py-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              />
              <button className="flex-shrink-0 text-black hover:text-gray-600 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-sm">
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-black transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Home Decor</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-black transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="#" className="hover:text-black transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Order Status</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6">Follow Us</h4>
            <div className="flex space-x-6 text-gray-500">
              <a href="#" className="hover:text-black transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-black transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-black transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-black transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 uppercase tracking-widest">
          <p>&copy; 2026 Aurum Goods. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Test;