import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Eye, Sparkles } from "lucide-react";
import supabase, { getProductImageUrl } from "../utils/supabase";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

function Products({ title, margin, excludeId, limit } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (!mounted) return;
        setProducts(limit ? (data || []).slice(0, limit) : data || []);
      } catch (err) {
        console.warn(
          "Failed to load products from Supabase:",
          err.message || err
        );
        if (!mounted) return;
        setProducts([]);
        setError("Unable to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [limit]);

  const items = excludeId
    ? products.filter((p) => (p._id || p.id) !== excludeId)
    : products;

  // --- CRITICAL FIX: SWIPER LOOP LOGIC ---
  // Swiper needs enough slides to loop. If we have few items (e.g. 3),
  // we repeat them to create a seamless infinite buffer.
  // We enable looping only if we have actual items.
  const shouldLoop = items.length > 0;
  
  // If items < 6, we triple the array to ensure the loop buffer is full
  // This solves "Number of slides not enough" and ensures Left/Right context always exists
  const swiperItems = items.length > 0 && items.length < 6 
    ? [...items, ...items, ...items] 
    : items;

  const desktopItems = limit ? items : items.slice(0, 12);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const renderProductCard = (product, index, isMobile = false, uniqueKey) => (
    <div
      // Use the uniqueKey for React reconciliation
      key={uniqueKey}
      className={`group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-amber-200 w-full mx-auto ${
        !isMobile ? "transform hover:-translate-y-2" : "h-full"
      }`}
      style={{ animationDelay: isMobile ? "0ms" : `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden bg-linear-to-br from-gray-50 to-white"
        style={{ aspectRatio: "4 / 3" }}
      >
        <img
          src={getProductImageUrl(product.variants?.[0]?.image)}
          alt="product image"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Hover overlay - Hidden on mobile to prevent touch interference */}
        <div className={`absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 ${!isMobile && 'group-hover:opacity-100'} transition-all duration-300`}></div>

        {/* Action buttons */}
        <div className={`absolute top-4 right-4 flex flex-col gap-2 opacity-0 ${!isMobile && 'group-hover:opacity-100'} transition-all duration-300 transform translate-y-2 group-hover:translate-y-0`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product._id || product.id);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              favorites.has(product._id || product.id)
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:text-red-500"
            } shadow-lg hover:shadow-xl`}
          >
            <Heart
              size={18}
              className={
                favorites.has(product._id || product.id) ? "fill-current" : ""
              }
            />
          </button>

          <Link
            to={`/product/${product._id || product.id}`}
            className="w-10 h-10 bg-white/90 text-gray-600 hover:text-amber-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Eye size={18} />
          </Link>
        </div>
        
        {/* Mobile Heart Button (Always visible on mobile because hover doesn't exist) */}
        {isMobile && (
             <button
             onClick={(e) => {
               e.preventDefault();
               toggleFavorite(product._id || product.id);
             }}
             className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
               favorites.has(product._id || product.id)
                 ? "bg-red-500 text-white"
                 : "bg-white/80 text-gray-600"
             } shadow-md`}
           >
             <Heart size={14} className={favorites.has(product._id || product.id) ? "fill-current" : ""} />
           </button>
        )}

        <div className={`absolute top-4 left-4 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg opacity-0 ${!isMobile ? 'group-hover:opacity-100' : 'opacity-100'} transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0`}>
          New Arrival
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-3">
        <div className="space-y-2">
          <h3
            className="text-gray-900 font-bold text-lg sm:text-xl overflow-hidden group-hover:text-amber-600 transition-colors duration-200"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.name}
          </h3>
          <p
            className="text-gray-600 text-xs sm:text-sm overflow-hidden leading-relaxed"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.description || "Premium traditional garment."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <p className="text-lg sm:text-xl font-black text-gray-900">
              MAD {product.price}
            </p>
            <p className="text-xs text-gray-500 line-through font-medium">
              MAD {(product.price * 1.2).toFixed(0)}
            </p>
          </div>

          <Link
            to={`/product/${product._id || product.id}`}
            className="group/btn inline-flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white sm:px-4 sm:py-2 rounded-lg font-bold transition-all duration-300 hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            <span className="hidden sm:inline">View</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <section className={`relative mt-16 mb-6 lg:mb-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${margin}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-10 left-10 w-40 h-40 bg-linear-to-br from-purple-200 to-pink-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-linear-to-br from-pink-200 to-purple-200 rounded-full blur-2xl"></div>
      </div>

      <div className="relative mt-30">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6">
            <Sparkles size={16} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">
              Premium Collection
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          <div className="w-24 h-1 bg-linear-to-r from-purple-400 via-pink-400 to-red-400 rounded-full mx-auto"></div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 font-medium">Loading products...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-red-600 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 text-white rounded-xl">Try Again</button>
          </div>
        ) : (
          <>
            {/* --- MOBILE VIEW: SWIPER --- */}
            <div className="block md:hidden">
              <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                // Only loop if we have items
                loop={shouldLoop} 
                // Adjust slidesPerView to control how much of side items are visible
                slidesPerView={"auto"}
                // Controls the gap. 
                spaceBetween={5}
                coverflowEffect={{
                  rotate: 0, // No rotation (flat)
                  stretch: 0,
                  depth: 0, // No depth (prevents blur issues)
                  modifier: 1,
                  scale: 0.85, // Side items are 85% size of center item
                  slideShadows: false, // No shadows/blur on sides
                }}
                modules={[EffectCoverflow, Autoplay]}
                className="w-full py-4 pb-10"
              >
                {swiperItems.map((product, index) => {
                  // Create a unique key using index because we duplicated items
                  const uniqueKey = `mobile-swipe-${product._id || product.id}-${index}`;
                  return (
                    <SwiperSlide
                      key={uniqueKey}
                      // Width 80% allows 10% peeking on left and 10% on right (approx)
                      className="!w-[80%] sm:!w-[350px] pb-10"
                    >
                     {renderProductCard(product, index, true, uniqueKey)}
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            {/* --- DESKTOP VIEW: GRID --- */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {desktopItems.map((product, index) =>
                renderProductCard(product, index, false, `desktop-${product._id || product.id}`)
              )}
            </div>
          </>
        )}

        {/* {items.length > 0 && !limit && (
          <div className="text-center md:mt-12">
            <Link to="/products">
              <button className="inline-flex items-center gap-2 bg-white border-2 border-purple-200 text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors">
                View All Products
              </button>
            </Link>
          </div>
        )} */}
      </div>
    </section>
  );
}

export default Products;