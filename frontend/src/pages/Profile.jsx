import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  MessageSquare,
  LogOut,
  Trash2,
} from "lucide-react";
import SharedHeader from "../components/shared/SharedHeader";
import { useAuthStore } from "../stores/authStore";
import supabase from "../utils/supabase";

function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    productId: "",
    rating: 5,
    review: "",
  });

  useEffect(() => {
    if (user) {
      fetchUserOrders();
      fetchUserReviews();

      // Set up real-time subscription for orders
      const ordersSubscription = supabase
        .channel("user_orders_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `email=eq.${user.email}`,
          },
          (payload) => {
            console.log("User order change detected:", payload);
            fetchUserOrders(); // Refresh orders when user's orders change
          },
        )
        .subscribe();

      // Set up real-time subscription for reviews
      const reviewsSubscription = supabase
        .channel("user_reviews_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "reviews",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("User review change detected:", payload);
            fetchUserReviews(); // Refresh reviews when user's reviews change
          },
        )
        .subscribe();

      // Cleanup subscriptions on unmount
      return () => {
        ordersSubscription.unsubscribe();
        reviewsSubscription.unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      // For now, we'll fetch all orders and filter by email on client side
      // In a real app, you'd want to add user_id to orders table
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          *,
          products (
            id,
            name
          )
        `,
        )
        .eq("user_email", user.email)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canReviewOrder = (order) => {
    return order.status === "delivered";
  };

  const hasReviewedProduct = (productId) => {
    return reviews.some((review) => review.product_id === productId);
  };

  const openReviewModal = (order, productId) => {
    setSelectedOrder(order);
    setReviewForm({
      productId,
      rating: 5,
      review: "",
    });
    setShowReviewModal(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      // Get product name for the review
      const product = selectedOrder.items.find(
        (item) => item.productId === reviewForm.productId,
      );

      const reviewData = {
        product_id: reviewForm.productId,
        user_id: user.id,
        user_name:
          user.user_metadata?.name || user.email?.split("@")[0] || "Anonymous",
        user_email: user.email,
        rating: reviewForm.rating,
        review: reviewForm.review,
        is_verified: true, // Since they have a completed order
      };

      const { error } = await supabase.from("reviews").insert([reviewData]);

      if (error) throw error;

      setShowReviewModal(false);
      fetchUserReviews(); // Refresh reviews
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete account? This cannot be undone.")) return;
    try {
      await deleteAccount();
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to view your profile
          </h2>
          <Link
            to="/auth"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader />

      <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your orders and reviews</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Account Info
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">
                    {user.user_metadata?.name || user.email?.split("@")[0]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="font-medium">{orders.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="font-medium">{reviews.length}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Orders and Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                My Orders
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                  <Link
                    to="/products"
                    className="text-amber-600 hover:text-amber-700 mt-2 inline-block"
                  >
                    Start shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-medium">
                              Order #{order.id.slice(-8)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600">
                            MAD {order.total}
                          </p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>
                              {item.name} (x{item.quantity})
                            </span>
                            {canReviewOrder(order) &&
                              !hasReviewedProduct(item.productId) && (
                                <button
                                  onClick={() =>
                                    openReviewModal(order, item.productId)
                                  }
                                  className="text-amber-600 hover:text-amber-700 flex items-center gap-1"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Review
                                </button>
                              )}
                            {hasReviewedProduct(item.productId) && (
                              <span className="text-green-600 text-xs">
                                Reviewed
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Reviews */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                My Reviews
              </h2>

              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          {review.products?.name || "Product"}
                        </h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">
                        "{review.review}"
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                        {review.is_verified && (
                          <span className="ml-2 text-green-600">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Write a Review
              </h3>
            </div>

            <form onSubmit={submitReview} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewForm.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewForm.review}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, review: e.target.value })
                  }
                  placeholder="Share your experience with this product..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-24 resize-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
