import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingCart, X } from "lucide-react";
import Products from "../components/Products";
import SharedHeader from "../components/SharedHeader";
import { useCart } from "../hooks/useCart";
import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const API_URL = import.meta.env.VITE_API_URL;
const API_ORDERS =
  import.meta.env.VITE_MODE === "development"
    ? `http://localhost:5000/api/orders`
    : `${API_URL}/api/orders`;
const API_PRODUCTS =
  import.meta.env.VITE_MODE === "development"
    ? `http://localhost:5000/api/products`
    : `${API_URL}/api/products`;
const BASE_URL =
  import.meta.env.VITE_MODE === "development"
    ? "http://localhost:5000"
    : API_URL;

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const { addToCart } = useCart();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    let mounted = true;
    // try backend first
    axios
      .get(`${API_PRODUCTS}/${id}`)
      .then((res) => {
        if (!mounted) return;
        setProduct(res.data);
        setSelectedVariantIndex(0);
      })
      .catch(() => {
        // product not found or API error — go back to listing
        navigate("/products");
      })
      .finally(() => mounted && setLoading(false));

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
      productId: product._id || null,
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
    <div className="relative min-h-screen bg-white">
      <SharedHeader />

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Image / Slider */}
          <div className="w-full flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <button
                onClick={prevVariant}
                className="absolute left-0 top-1/2 -translate-y-1/2  w-10 h-10 bg-gray-100 rounded-r-full flex items-center justify-center shadow hover:bg-gray-200 transition"
                aria-label="Previous variant"
              >
                <ArrowLeft className="w-4 h-4 text-gray-700" />
              </button>

              <img
                src={currentVariant.image}
                alt="Product"
                className="w-full h-auto max-h-100 object-contain rounded-lg shadow-sm border border-gray-100"
              />

              <button
                onClick={nextVariant}
                className="absolute right-0 top-1/2 -translate-y-1/2  w-10 h-10 bg-gray-100 rounded-l-full flex items-center justify-center shadow hover:bg-gray-200 transition"
                aria-label="Next variant"
              >
                <ArrowRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {product.name}
            </h1>
            <p className="mt-2 text-gray-600">{product.description}</p>
            <p className="mt-4 text-xl font-semibold text-amber-800">
              ${product.price}
            </p>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Colors</h4>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.color}
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`px-3 py-1 rounded-full border transition text-sm ${
                      selectedVariantIndex === index
                        ? "bg-amber-800 text-white border-amber-800"
                        : "bg-white text-gray-700 border-gray-200"
                    }`}
                    aria-label={`Select color ${variant.color}`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => {
                  const isAvailable = product.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`px-3 py-1 rounded border text-sm transition ${
                        selectedSize === size && isAvailable
                          ? "bg-amber-800 text-white border-amber-800"
                          : isAvailable
                            ? "bg-white text-gray-700 border-gray-200"
                            : "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full sm:flex-1 px-4 py-3 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full sm:flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-800 hover:shadow-sm transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <h3 className="text-lg font-semibold mb-4">You may also like</h3>
          <Products title="Other Products" excludeId={id} />
        </section>
      </main>
    </div>
  );
}

export default Product;
