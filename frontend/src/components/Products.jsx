import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import supabase, { getProductImageUrl } from "../utils/supabase";

function Products({ title, margin, excludeId, limit } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <section
      className={`relative mt-16 mb-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${margin}`}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-100 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-amber-50 rounded-full"></div>
      </div>

      <div className="relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            {title}
          </h1>
          <div className="w-16 h-1 bg-amber-400 rounded-full mx-auto"></div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading products…</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {items.map((product) => (
              <div
                className="mx-4 sm:mx-0 group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                key={product._id || product.id}
              >
                {/* Image Container */}
                <div className="relative p-6 h-52 sm:h-64 flex items-center justify-center overflow-hidden">
                  <img
                    src={getProductImageUrl(product.variants?.[0]?.image)}
                    alt="product image"
                    className="max-h-48 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>

                  {/* New badge */}
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    New
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="space-y-2">
                    <h3
                      className="text-gray-900 font-semibold text-lg overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-gray-600 text-sm overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.description && product.description.length > 100
                        ? product.description.substring(0, 100) + "..."
                        : product.description ||
                          "Premium traditional garment with modern tailoring."}
                    </p>
                  </div>

                  {/* Rating */}
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
                    <span className="text-sm text-gray-500 ml-1">(5.0)</span>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900">
                        MAD {product.price}
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        MAD {(product.price * 1.2).toFixed(0)}
                      </p>
                    </div>
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="group/btn inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {/* {items.length > 0 && !limit && (
          <div className="text-center mt-12">
            <button className="bg-white border-2 border-amber-200 text-amber-700 px-8 py-3 rounded-xl font-semibold hover:bg-amber-50 hover:border-amber-300 transition-all duration-200">
              Load More Products
            </button>
          </div>
        )} */}
      </div>
    </section>
  );
}

export default Products;
