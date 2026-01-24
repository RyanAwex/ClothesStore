import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, Heart, Eye, Sparkles } from "lucide-react";
import supabase, { getProductImageUrl } from "../utils/supabase";

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
          err.message || err,
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

  return (
    <section
      className={`relative mt-16 mb-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${margin}`}
    >
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-10 left-10 w-40 h-40 bg-linear-to-br from-purple-200 to-pink-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-linear-to-br from-pink-200 to-purple-200 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-linear-to-br from-red-100 to-purple-100 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6">
            <Sparkles size={16} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">
              Premium Collection
            </span>
            <Sparkles size={16} className="text-amber-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            {title}
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our carefully curated collection of premium traditional
            garments, crafted with attention to detail and modern comfort.
          </p>

          <div className="w-24 h-1 bg-linear-to-r from-purple-400 via-pink-400 to-red-400 rounded-full mx-auto"></div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-400 rounded-full animate-spin mx-auto"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>
            <p className="text-xl text-gray-600 font-medium">
              Loading amazing products…
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please wait while we fetch the latest collection
            </p>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-linear-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-red-500 text-3xl">⚠️</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((product, index) => (
              <div
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-amber-200 transform hover:-translate-y-2 max-w-[350px] min-w-[312px] w-full mx-auto"
                key={product._id || product.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Enhanced Image Container */}
                <div
                  className="relative overflow-hidden bg-linear-to-br from-gray-50 to-white"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <img
                    src={getProductImageUrl(product.variants?.[0]?.image)}
                    alt="product image"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Enhanced Hover overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                  {/* Action buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
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
                      aria-label="Add to favorites"
                    >
                      <Heart
                        size={18}
                        className={
                          favorites.has(product._id || product.id)
                            ? "fill-current"
                            : ""
                        }
                      />
                    </button>

                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="w-10 h-10 bg-white/90 text-gray-600 hover:text-amber-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                      aria-label="Quick view"
                    >
                      <Eye size={18} />
                    </Link>
                  </div>

                  {/* Enhanced New badge */}
                  <div className="absolute top-4 left-4 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    New Arrival
                  </div>

                  {/* Discount badge */}
                  {/* <div className="absolute bottom-4 left-4 bg-linear-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                    Save 17%
                  </div> */}
                </div>

                {/* Enhanced Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <h3
                      className="text-gray-900 font-bold text-xl overflow-hidden group-hover:text-amber-600 transition-colors duration-200"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-gray-600 text-sm overflow-hidden leading-relaxed"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.description && product.description.length > 100
                        ? product.description.substring(0, 100) + "..."
                        : product.description ||
                          "Premium traditional garment with modern tailoring and exceptional comfort."}
                    </p>
                  </div>

                  {/* Enhanced Rating */}
                  {/* <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 5
                              ? "text-amber-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2 font-medium">
                        (5.0)
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      127 reviews
                    </div>
                  </div> */}

                  {/* Enhanced Price and CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <p className="text-xl font-black text-gray-900">
                        MAD {product.price}
                      </p>
                      <p className="text-sm text-gray-500 line-through font-medium">
                        MAD {(product.price * 1.2).toFixed(0)}
                      </p>
                    </div>

                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="group/btn inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      <ShoppingBag className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Load More Button */}
        {items.length > 0 && !limit && (
          <div className="text-center mt-16">
            <button className="group inline-flex items-center gap-3 bg-white border-2 border-purple-200 text-purple-700 px-8 py-4 rounded-2xl font-bold hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5">
              <Sparkles
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              Load More Products
              <Sparkles
                size={20}
                className="group-hover:-rotate-12 transition-transform"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;
