import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import SharedHeader from "../components/SharedHeader";
import { useCart } from "../hooks/useCart";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL =
  import.meta.env.VITE_MODE === "development"
    ? "http://localhost:5000"
    : API_URL;

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <SharedHeader />
        <div className="flex flex-col items-center justify-center mt-20 px-4">
          <ShoppingBag size={64} className="text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-6 text-center">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader />
      <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center sm:items-center p-4 sm:p-6 border-b border-gray-200 last:border-b-0"
                >
                  <img
                    src={`${BASE_URL}${item.variant.image}`}
                    alt={item.name}
                    className="w-24 h-24 sm:w-20 sm:h-20 object-contain rounded-lg mb-4 sm:mb-0 sm:mr-4"
                  />
                  <div className="flex-1 w-full items-center sm:items-start text-center sm:text-left">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Color: {item.variant.color} | Size: {item.size}
                    </p>
                    <p className="text-lg font-bold text-amber-800">
                      ${item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <div className="flex items-center border border-gray-300 rounded-4xl">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-2 hover:bg-gray-100 transition touch-manipulation"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 min-w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-2 hover:bg-gray-100 transition touch-manipulation"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-amber-800">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-amber-800 text-white py-3 px-4 rounded-lg hover:bg-amber-900 transition text-center block font-semibold"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition text-center block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
