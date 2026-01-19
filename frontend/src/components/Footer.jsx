import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white border-t mt-20 border-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-end gap-1 mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Lux</h3>
              <span className="text-sm text-gray-600">By Stylish</span>
            </div>
            <p className="text-gray-600 mb-4">
              Discover premium clothing inspired by Moroccan tradition. Quality
              craftsmanship meets modern style in our curated collection.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-amber-50 transition"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-amber-50 transition"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-amber-50 transition"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  All Products
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Cart
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">
              Customer Service
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="mb-2 md:mb-0">
              <h4 className="text-lg font-semibold mb-2 text-gray-900">
                Stay Updated
              </h4>
              <p className="text-gray-600 text-sm">
                Subscribe for the latest arrivals and exclusive offers.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-50  border border-gray-200 rounded-l-full focus:outline-none focus:border-amber-300 flex-1 min-w-50 md:w-64 shadow-sm"
              />
              <button className="px-6 py-2 bg-amber-800 text-white border border-amber-800 font-semibold rounded-r-full hover:bg-amber-900 transition cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Lux By Stylish. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
