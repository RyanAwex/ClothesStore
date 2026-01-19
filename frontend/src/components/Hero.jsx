import React from "react";
import { ShoppingBag, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative mt-16 mb-16 w-full max-w-7xl mx-auto pb-5 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-amber-100 rounded-full opacity-60 animate-pulse"></div>
        <div
          className="absolute top-32 right-16 w-12 h-12 bg-amber-200 rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-amber-50 rounded-full opacity-50 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 right-1/3 w-8 h-8 bg-amber-300 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="relative bg-linear-to-br from-white via-amber-50/30 to-amber-100/20 rounded-3xl p-6 sm:p-8 lg:p-12 mb-10 shadow-xl backdrop-blur-sm border border-amber-100/50">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Content Section */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/80 backdrop-blur-sm rounded-full text-amber-800 text-sm font-medium border border-amber-200/50">
              <Sparkles className="w-4 h-4" />
              <span>New Season Collection</span>
              <Star className="w-4 h-4" />
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-5xl  lg:text-6xl xl:text-7xl font-black text-gray-900 leading-none tracking-tight">
                <span className="block bg-linear-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  New Season
                </span>
                <span className="block text-gray-800 mt-1">Styles</span>
              </h1>
              <div className="w-24 h-1 bg-linear-to-r from-amber-400 to-amber-600 rounded-full mx-auto lg:mx-0"></div>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
              Discover premium pieces inspired by Moroccan tradition — modern
              tailoring with timeless details. Elevate your wardrobe with our
              exclusive collection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                Shop Now
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 border-2 border-amber-200 text-amber-700 rounded-2xl hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 font-semibold text-lg backdrop-blur-sm"
              >
                Explore Collection
              </Link>
            </div>

            {/* Stats or features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-6 border-t border-amber-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">2 Days</div>
                <div className="text-sm text-gray-600">Fast Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Perfect Quality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative">
              {/* Main image container */}
              <div className="relative bg-linear-to-br from-amber-100 to-amber-200 rounded-3xl p-4 shadow-2xl shadow-amber-400/30 transform hover:scale-105 transition-transform duration-500">
                <img
                  src="hero-1.png"
                  alt="traditional djellaba garment"
                  className="w-full h-80 sm:h-96 lg:h-112 object-cover object-center rounded-2xl shadow-lg"
                />

                {/* Overlay linear */}
                <div className="absolute inset-0 rounded-2xl"></div>

                {/* Floating badge on image */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-800">
                      New Arrival
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
