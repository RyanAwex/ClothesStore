import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingCart, X } from "lucide-react";
import Products from "../components/shared/Products";
import SharedHeader from "../components/shared/SharedHeader";
import { useCart } from "../hooks/useCart";
import supabase, { getProductImageUrl } from "../utils/supabase";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (!mounted) return;
        setProduct(data);
        setSelectedVariantIndex(0);
      } catch (error) {
        console.error("Error fetching product:", error);
        if (!mounted) return;
        // Product not found or error — go back to listing
        navigate("/products");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id, navigate]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-white">
        <SharedHeader />
        <main className="max-w-5xl mx-auto px-4 pt-20 pb-12">
          <div className="py-20 text-center text-gray-600">
            Loading product…
          </div>
        </main>
      </div>
    );
  }

  // Safety check for variants
  if (!product.variants || product.variants.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <SharedHeader />
        <main className="max-w-5xl mx-auto px-4 pt-20 pb-12">
          <div className="py-20 text-center text-gray-600">
            Product data is incomplete. Please try again later.
          </div>
        </main>
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariantIndex];

  const nextVariant = () =>
    setSelectedVariantIndex((i) => (i + 1) % product.variants.length);
  const prevVariant = () =>
    setSelectedVariantIndex(
      (i) => (i - 1 + product.variants.length) % product.variants.length,
    );

  const handleAddToCart = () => {
    addToCart(product, selectedVariantIndex, selectedSize);
  };

  const handleBuyNow = async () => {
    const item = {
      productId: product.id || null,
      name: product.name,
      color: currentVariant.color,
      size: selectedSize,
      price: product.price,
      quantity: 1,
      variant: currentVariant,
    };

    navigate("/checkout", { state: { buyNowItem: item } });
  };

  return (
    <div className="min-h-screen bg-white">
      <SharedHeader />

      <main className=" px-4 pt-25 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Image / Slider */}
          <div className="w-full flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <button
                onClick={prevVariant}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-r-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition border border-gray-200"
                aria-label="Previous variant"
              >
                <ArrowLeft className="w-4 h-4 text-gray-700" />
              </button>

              <img
                src={getProductImageUrl(currentVariant.image)}
                alt="Product"
                className="w-full h-auto max-h-100 object-contain rounded-lg shadow-sm border border-gray-100"
              />

              <button
                onClick={nextVariant}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-l-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition border border-gray-200"
                aria-label="Next variant"
              >
                <ArrowRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-amber-600 mb-6">
              MAD {product.price}
            </p>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.color}
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                      selectedVariantIndex === index
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-amber-500"
                    }`}
                    aria-label={`Select color ${variant.color}`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Sizes
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => {
                  const isAvailable = product.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`py-2 px-3 rounded-lg border font-medium transition-colors ${
                        selectedSize === size && isAvailable
                          ? "bg-purple-600 text-white border-purple-600"
                          : isAvailable
                            ? "bg-white text-gray-700 border-gray-300 hover:border-amber-500"
                            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <div className="bg-white rounded-xl pt-4 md:px-6 shadow-sm border border-gray-100">
            <Products title="Other Products" excludeId={id} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Product;
