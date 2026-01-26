import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Eye, Sparkles, SlidersHorizontal, X, Filter } from "lucide-react";
import supabase, { getProductImageUrl } from "../utils/supabase";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

// Master Category List
import { CATEGORIES } from "../utils/categories";

function Products({ title, margin, excludeId, limit } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  
  // Filter States
  const location = useLocation();
  const isProductsPage = location.pathname === "/products";
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        let query = supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        // If on index page, only show featured products
        if (location.pathname === "/") {
          query = query.eq("is_featured", true);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (!mounted) return;
        setProducts(limit ? (data || []).slice(0, limit) : data || []);
      } catch (err) {
        console.warn("Failed to load products from Supabase:", err.message || err);
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

  // 1. Calculate Available Categories
  const availableCategories = useMemo(() => {
    const usedCategories = new Set();
    
    products.forEach(product => {
      const cats = Array.isArray(product.categories) 
        ? product.categories 
        : [product.category];
        
      cats.forEach(c => {
        if (c) usedCategories.add(c);
      });
    });

    return CATEGORIES.filter(cat => usedCategories.has(cat));
  }, [products]);

  // 2. Filter Logic
  const filteredItems = useMemo(() => {
    let items = excludeId
      ? products.filter((p) => (p._id || p.id) !== excludeId)
      : products;

    if (selectedCategory !== "All") {
      items = items.filter(p => {
        const cats = Array.isArray(p.categories) ? p.categories : [p.category];
        return cats.includes(selectedCategory);
      });
    }
    
    return items;
  }, [products, excludeId, selectedCategory]);

  // 3. Chunk Logic for Mobile Rows (Groups of 6)
  const mobileChunks = useMemo(() => {
    const chunks = [];
    if (filteredItems.length === 0) return chunks;
    
    // Split into arrays of 6
    for (let i = 0; i < filteredItems.length; i += 6) {
      chunks.push(filteredItems.slice(i, i + 6));
    }
    return chunks;
  }, [filteredItems]);

  const baseDisplayItems = limit ? filteredItems.slice(0, limit) : filteredItems;
  const desktopItems = limit ? baseDisplayItems : baseDisplayItems.slice(0, 12);

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
      key={uniqueKey}
      className={`group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-purple-200 w-full mx-auto ${
        !isMobile ? "transform hover:-translate-y-2" : "h-full"
      }`}
      style={{ animationDelay: isMobile ? "0ms" : `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white"
        style={{ aspectRatio: "1 / 1" }}
      >
        <img
          src={getProductImageUrl(product.variants?.[0]?.image)}
          alt="product image"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Hover overlay (Desktop) */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 ${!isMobile && 'group-hover:opacity-100'} transition-all duration-300`}></div>

        {/* Action buttons (Desktop Hover) */}
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
            <Heart size={18} className={favorites.has(product._id || product.id) ? "fill-current" : ""} />
          </button>
          <Link
            to={`/product/${product._id || product.id}`}
            className="w-10 h-10 bg-white/90 text-gray-600 hover:text-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Eye size={18} />
          </Link>
        </div>
        
        {/* Mobile Heart Button (Always Visible) */}
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

        <div className={`absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg opacity-0 ${!isMobile ? 'group-hover:opacity-100' : 'opacity-100'} transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0`}>
          New Arrival
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-3">
        <div className="space-y-2">
          <h3 className="text-gray-900 font-bold text-lg sm:text-xl overflow-hidden group-hover:text-purple-600 transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm overflow-hidden leading-relaxed line-clamp-2">
            {product.description || "Premium traditional garment."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <p className="text-lg sm:text-xl font-black text-gray-900">
              MAD {product.price}
            </p>
          </div>

          <Link
            to={`/product/${product._id || product.id}`}
            className="group/btn inline-flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white sm:px-4 sm:py-2 rounded-lg font-bold transition-all duration-300 hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            <span className="hidden sm:inline">View</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <section className={`relative mb-6 lg:mb-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${margin}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-2xl"></div>
      </div>

      <div className={`relative ${document.location.pathname === "/products" ? "mt-25" : ""} `}>
        <div className="text-center mb-8">
          <div
            className={`flex flex-row gap-4 mb-6 ${
              isProductsPage
                ? "justify-between items-end sm:items-center"
                : "justify-center items-center"
            }`}
          >
            <h1
              className={`text-3xl sm:text-4xl font-black text-gray-900 leading-tight ${
                isProductsPage ? "text-left" : "text-center"
              }`}
            >
              {title || "Featured Products"}
            </h1>

            {/* Filter Toggle Button */}
            {isProductsPage && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all shadow-sm cursor-pointer ${
                  showFilters || selectedCategory !== "All"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {showFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
                <span className="font-medium">Filters</span>
                {selectedCategory !== "All" && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold ml-1">
                    1
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Decorative Line - Only show on Products Page */}
          {isProductsPage && (
            <div className="w-full h-1 bg-gradient-to-r from-purple-200 via-pink-200 to-transparent rounded-full mb-8"></div>
          )}
        </div>

        {/* --- FILTER PANEL --- */}
        {isProductsPage && showFilters && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 animate-in slide-in-from-top-2 shadow-xl">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Filter size={20} className="text-purple-600" />
                  Filter by Category
                </h3>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="text-sm px-3 py-1 border bg-gray-50 text-gray-600 border-gray-200 hover:bg-white hover:border-gray-300 rounded-xl font-medium flex items-center gap-1 transition-colors"
                  >
                    Clear <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                 <button
                    onClick={() => setSelectedCategory("All")}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                      selectedCategory === "All"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-white hover:border-gray-300"
                    }`}
                  >
                    All Items
                  </button>
                  
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-white hover:border-gray-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                 <span>{filteredItems.length} items found</span>
                 {selectedCategory !== "All" && <span>Filtered by: <span className="text-purple-600 font-bold">{selectedCategory}</span></span>}
              </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 font-medium">Loading collection...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-red-600 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 text-white rounded-xl">Try Again</button>
          </div>
        ) : filteredItems.length === 0 ? (
           <div className="py-20 text-center bg-gray-50 rounded-3xl border border-gray-100">
             <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="text-lg text-gray-500 font-medium">No products found in this category.</p>
             <button 
               onClick={() => setSelectedCategory("All")}
               className="mt-4 text-purple-600 font-bold hover:underline"
             >
               View all products
             </button>
           </div>
        ) : (
          <>
            {/* --- MOBILE VIEW: SWIPERS (Smart Loop) --- */}
            <div className="block md:hidden space-y-8">
              {mobileChunks.map((chunk, chunkIndex) => {
                
                // LOGIC UPDATE: 
                // If chunk has less than 3 items, do not loop and do not duplicate.
                // If chunk has 3 or more items, enable loop and duplicate to satisfy Swiper requirements.
                
                const isSmallChunk = chunk.length < 3;
                const shouldLoop = !isSmallChunk;
                
                let displaySlides = [...chunk];

                if (shouldLoop) {
                    while (displaySlides.length < 12) {
                        displaySlides = [...displaySlides, ...chunk];
                    }
                }

                return (
                  <div key={`swiper-row-${chunkIndex}`} className="w-full pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <Swiper
                      effect={"coverflow"}
                      grabCursor={true}
                      centeredSlides={true}
                      loop={shouldLoop} // Conditional Loop
                      slidesPerView={"auto"}
                      spaceBetween={5}
                      coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 0,
                        modifier: 1,
                        scale: 0.85,
                        slideShadows: false,
                      }}
                      modules={[EffectCoverflow, Autoplay]}
                      className="w-full py-4 pb-8"
                    >
                      {displaySlides.map((product, index) => {
                        const uniqueKey = `mobile-swipe-${chunkIndex}-${product._id || product.id}-${index}`;
                        return (
                          <SwiperSlide
                            key={uniqueKey}
                            className="!w-[80%] sm:!w-[350px] py-5 md:py-2"
                          >
                            {renderProductCard(product, index, true, uniqueKey)}
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                );
              })}
            </div>

            {/* --- DESKTOP VIEW: GRID (Unchanged) --- */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {desktopItems.map((product, index) =>
                renderProductCard(product, index, false, `desktop-${product._id || product.id}`)
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Products;