import React from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Heart,
  Shield,
  Truck,
  RefreshCw,
} from "lucide-react";
import SharedHeader from "../components/SharedHeader";
import { useCart } from "../hooks/useCart";
import { getProductImageUrl } from "../utils/supabase";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 300 ? 0 : 30; // Free shipping over MAD 300
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br mt-10 from-gray-50 via-white to-gray-50">
        <SharedHeader />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 bg-purple-400 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-300 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-200 rounded-full"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 md:p-16 max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-linear-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag size={32} className="text-amber-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">0</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't found anything you love yet. Let's change
                that!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ShoppingBag
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  Start Shopping
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold"
                >
                  <Heart size={20} />
                  Browse Collections
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600 text-sm">On orders over MAD 300</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Secure Checkout
              </h3>
              <p className="text-gray-600 text-sm">SSL encrypted & protected</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 mt-16">
      <SharedHeader />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-purple-50 to-pink-50">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-purple-300 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-yellow-300 rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
              Shopping Cart
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
            <div className="w-24 h-1 bg-linear-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Product Image */}
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                        <img
                          src={getProductImageUrl(item.variant.image)}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-gray-300"
                            style={{
                              backgroundColor: item.variant.color.toLowerCase(),
                            }}
                          ></div>
                          {item.variant.color}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Size:</span> {item.size}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-black text-amber-600">
                          MAD {item.price}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-amber-600 hover:bg-white rounded-lg transition-all duration-200"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-amber-600 hover:bg-white rounded-lg transition-all duration-200"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 font-medium"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-linear-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={20} className="text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Subtotal ({cartItems.length} items)
                  </span>
                  <span className="font-semibold text-gray-900">
                    MAD {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">
                    MAD {tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {shipping === 0 ? "Free" : `MAD ${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Add MAD {(300 - subtotal).toFixed(2)} more for free
                    shipping!
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-amber-600">MAD {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="group w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  to="/products"
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold"
                >
                  <ShoppingBag size={20} />
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield size={14} />
                    Secure
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck size={14} />
                    Fast Delivery
                  </div>
                  <div className="flex items-center gap-1">
                    <RefreshCw size={14} />
                    Easy Returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
