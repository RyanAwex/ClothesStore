import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Truck, MapPin, Phone, Mail, User } from "lucide-react";
import SharedHeader from "../components/SharedHeader";
import { useCart } from "../hooks/useCart";
import { useAuthStore } from "../stores/authStore";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_ORDERS =
  import.meta.env.VITE_MODE === "development"
    ? `http://localhost:5000/api/orders`
    : `${API_URL}/api/orders`;
const BASE_URL =
  import.meta.env.VITE_MODE === "development"
    ? "http://localhost:5000"
    : API_URL;

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const user = useAuthStore((s) => s.user);

  const buyNowItem = location.state?.buyNowItem;
  const items = buyNowItem ? [buyNowItem] : cartItems;

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [formData, setFormData] = useState({
    customerName: user?.name || user?.email?.split("@")[0] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    cardName: "",
    cardNumber: "",
    cvv: "",
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderItems = items.map((item) => ({
      productId: item.productId || item.id,
      name: item.name,
      color: item.color || item.variant?.color,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
    }));

    const payload = {
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      location: `${formData.address}, ${formData.city}`,
      paymentMethod,
      items: orderItems,
      total,
    };

    try {
      await axios.post(API_ORDERS, payload);
      alert("Order placed successfully!");
      if (!buyNowItem) {
        clearCart();
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <SharedHeader />
        <div className="flex flex-col items-center justify-center mt-20 px-4">
          <h1 className="text-2xl font-bold text-gray-700 mb-2">
            No items to checkout
          </h1>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader />
      <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Items
              </h2>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center mb-4 pb-4 border-b last:border-b-0"
                >
                  <img
                    src={
                      buyNowItem
                        ? `${BASE_URL}${item.variant.image}`
                        : `${BASE_URL}${item.variant.image}`
                    }
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Color: {item.color || item.variant?.color} | Size:{" "}
                      {item.size}
                    </p>
                    <p className="text-lg font-bold text-amber-800">
                      ${item.price} x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
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
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Payment Method
              </h2>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="cash"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="cash" className="flex items-center">
                    <Truck className="mr-2" size={20} />
                    Cash on Delivery
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="card" className="flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    Credit/Debit Card
                  </label>
                </div>
                {paymentMethod === "card" && (
                  <div className="mt-2 text-sm text-gray-600">
                    We accept: Mastercard, Visa, American Express
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="inline mr-1" size={16} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="inline mr-1" size={16} />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="inline mr-1" size={16} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="inline mr-1" size={16} />
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  {paymentMethod === "card" && (
                    <>
                      <hr className="my-6" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Card Information
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            required
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-amber-800 text-white py-3 px-4 rounded-lg hover:bg-amber-900 transition font-semibold disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod === "card"
                      ? "Pay Now"
                      : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
