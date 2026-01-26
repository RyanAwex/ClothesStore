import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Shield,
  Lock,
  CheckCircle,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import SharedHeader from "../components/shared/SharedHeader";
import { useCart } from "../hooks/useCart";
import { useAuthStore } from "../stores/authStore";
import supabase, { getProductImageUrl } from "../utils/supabase";

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
  const [errors, setErrors] = useState({});

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 300 ? 0 : 30; // Updated to match cart logic
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim())
      newErrors.customerName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    if (paymentMethod === "card") {
      if (!formData.cardName.trim())
        newErrors.cardName = "Cardholder name is required";
      if (!formData.cardNumber.trim())
        newErrors.cardNumber = "Card number is required";
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
      if (!formData.expiryDate.trim())
        newErrors.expiryDate = "Expiry date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const orderItems = items.map((item) => ({
      productId: item.productId || item.id,
      name: item.name,
      color: item.color || item.variant?.color,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
    }));

    const orderData = {
      customer_name: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      location: `${formData.address}, ${formData.city}`,
      payment_method: paymentMethod,
      items: orderItems,
      total: total,
      status: "pending",
    };

    try {
      const { error } = await supabase.from("orders").insert([orderData]);
      if (error) throw error;

      alert("Order placed successfully!");
      if (!buyNowItem) {
        clearCart();
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message || "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
        <SharedHeader />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 bg-red-400 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-red-300 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-200 rounded-full"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 md:p-16 max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-linear-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} className="text-red-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                No Items to Checkout
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                You need to add some items to your cart before you can proceed
                to checkout.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/products")}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold"
                >
                  <ShoppingBag size={20} />
                  View Cart
                </button>
              </div>
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
      <div className="relative overflow-hidden bg-linear-to-r from-red-50 to-pink-50">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-red-300 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-purple-300 rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
              Secure Checkout
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Complete your purchase with confidence
            </p>
            <div className="w-24 h-1 bg-linear-to-r from-red-400 to-pink-400 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary & Items */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={20} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Items
                </h2>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={getProductImageUrl(item.variant?.image || "")}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: (
                                item.color ||
                                item.variant?.color ||
                                "#ccc"
                              ).toLowerCase(),
                            }}
                          ></div>
                          {item.color || item.variant?.color}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Size:</span> {item.size}
                        </span>
                      </div>
                      <p className="text-lg font-black text-amber-600 mt-1">
                        MAD {item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-linear-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Subtotal ({items.length} items)
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
                  <span className="text-red-600">MAD {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-linear-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <Lock size={20} className="text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Payment Details
                </h2>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Method
                </h3>

                <div className="space-y-3">
                  <label className="group flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-linear-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <Truck size={20} className="text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Cash on Delivery
                        </div>
                        <div className="text-sm text-gray-600">
                          Pay when you receive your order
                        </div>
                      </div>
                    </div>
                    {paymentMethod === "cash" && (
                      <CheckCircle size={20} className="text-green-600" />
                    )}
                  </label>

                  <label className="group flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <CreditCard size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Credit/Debit Card
                        </div>
                        <div className="text-sm text-gray-600">
                          Visa, Mastercard, American Express
                        </div>
                      </div>
                    </div>
                    {paymentMethod === "card" && (
                      <CheckCircle size={20} className="text-blue-600" />
                    )}
                  </label>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={20} className="text-gray-600" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                          errors.customerName
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.customerName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.customerName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                          errors.email
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                          errors.phone
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="+212 XXX XXX XXX"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-gray-600" />
                    Shipping Address
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                          errors.address
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="123 Main Street, Apartment 4B"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                          errors.city
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Casablanca"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Information */}
                {paymentMethod === "card" && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard size={20} className="text-gray-600" />
                      Card Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                            errors.cardName
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="John Doe"
                        />
                        {errors.cardName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cardName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                            errors.cardNumber
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                              errors.cvv
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            }`}
                            placeholder="123"
                          />
                          {errors.cvv && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.cvv}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                              errors.expiryDate
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            }`}
                            placeholder="MM/YY"
                          />
                          {errors.expiryDate && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.expiryDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentMethod === "card"
                        ? "Complete Payment"
                        : "Place Order"}
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield size={14} />
                    SSL Secured
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock size={14} />
                    256-bit Encryption
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={14} />
                    Secure Checkout
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

export default Checkout;
