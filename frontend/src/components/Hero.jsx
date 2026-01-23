import React from "react";
import {
  ShoppingBag,
  Sparkles,
  Star,
  ArrowRight,
  Zap,
  Crown,
  Heart,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative mt-16 mb-16 w-full max-w-7xl mx-auto pb-5 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-10 left-10 w-40 h-40 bg-linear-to-br from-purple-200 to-pink-200 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-32 right-16 w-32 h-32 bg-linear-to-br from-blue-200 to-purple-200 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-48 h-48 bg-linear-to-br from-pink-100 to-red-100 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 right-1/3 w-24 h-24 bg-linear-to-br from-indigo-200 to-purple-200 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-linear-to-br from-violet-100 to-purple-100 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-linear-to-br from-white via-purple-50/30 to-pink-50/20 rounded-3xl p-8 sm:p-12 lg:p-16 mb-10 shadow-2xl backdrop-blur-sm border border-purple-100/50 overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-8 right-8 w-20 h-20 bg-linear-to-br from-purple-200 to-pink-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 bg-linear-to-br from-blue-200 to-purple-200 rounded-full opacity-25 animate-float-delayed"></div>
        <div className="absolute top-1/2 right-16 w-12 h-12 bg-linear-to-br from-pink-200 to-red-200 rounded-full opacity-20 animate-float"></div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Content Section */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 bg-linear-to-r from-purple-100 to-pink-100 backdrop-blur-sm rounded-2xl text-purple-800 text-sm font-bold border border-purple-200/50 shadow-lg">
              <Crown className="w-5 h-5 text-purple-600" />
              <span>Luxury Fashion Collection</span>
              <Sparkles className="w-5 h-5 text-pink-600" />
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-none tracking-tight">
                <span className="block bg-linear-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-linear">
                  Elevate Your
                </span>
                <span className="block text-gray-800 mt-2">Style Game</span>
              </h1>
              <div className="w-32 h-1.5 bg-linear-to-r from-purple-400 via-pink-400 to-red-400 rounded-full mx-auto lg:mx-0 shadow-lg"></div>
            </div>

            {/* Enhanced Description */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed font-medium">
              Discover the perfect blend of contemporary fashion and timeless
              elegance. Curated pieces that make you stand out in any crowd.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-2 md:gap-4 px-4 py-3 md:px-8 md:py-4 bg-linear-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-bold text-md md:text-lg hover:scale-105 active:scale-95 transform hover:-translate-y-1"
              >
                <ShoppingBag className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                Shop Collection
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-2 md:gap-4 px-4 py-3 md:px-8 md:py-4 border-2 border-purple-200 text-purple-700 rounded-xl md:rounded-2xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 font-bold text-md md:text-lg backdrop-blur-sm hover:shadow-lg transform hover:scale-105"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Explore Trends
              </Link>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-purple-100">
              <div className="text-center group">
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                  2 Days
                </div>
                <div className="text-sm text-gray-600 font-medium flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 text-purple-500" />
                  Express Delivery
                </div>
              </div>
              <div className="text-center group">
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">
                  100%
                </div>
                <div className="text-sm text-gray-600 font-medium flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-pink-500" />
                  Premium Quality
                </div>
              </div>
              <div className="text-center group">
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                  24/7
                </div>
                <div className="text-sm text-gray-600 font-medium flex items-center justify-center gap-1">
                  <Crown className="w-4 h-4 text-red-500" />
                  VIP Support
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Image Section */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative">
              {/* Main image container with enhanced effects */}
              <div className="relative bg-linear-to-br from-purple-100 via-pink-100 to-red-100 rounded-3xl p-6 shadow-xl  transform hover:scale-105 transition-all duration-500 group">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    alt="Modern fashion lifestyle - contemporary clothing collection"
                    className="w-full h-80 sm:h-96 lg:h-112 object-cover object-center rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Enhanced Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                  {/* Floating elements on image */}
                  <div className="absolute hidden sm:flex top-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-bold text-gray-800">
                        Trending Now
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 shadow-xl border border-white/20">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-bold text-gray-800">
                        Limited Edition
                      </span>
                    </div>
                  </div>

                  {/* Rating badge */}
                  <div className="absolute top-6 right-6 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-2xl px-3 py-2 shadow-xl">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">4.9</span>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-linear-to-br from-purple-400 to-pink-400 rounded-full animate-bounce"></div>
                <div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-linear-to-br from-pink-400 to-red-400 rounded-full animate-bounce"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Lightning Fast
          </h3>
          <p className="text-gray-600 text-sm">
            Express delivery within 48 hours to your doorstep.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-linear-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Secure Shopping
          </h3>
          <p className="text-gray-600 text-sm">
            256-bit SSL encryption and secure payment processing.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-linear-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Love Guarantee
          </h3>
          <p className="text-gray-600 text-sm">
            Not satisfied? 30-day hassle-free returns policy.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
