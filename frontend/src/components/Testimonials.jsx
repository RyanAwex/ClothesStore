import React, { useEffect, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import supabase from "../utils/supabase";

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
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
          .eq("is_verified", true)
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.warn("Failed to load reviews:", error.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Set up real-time subscription for reviews
    const reviewsSubscription = supabase
      .channel("testimonials_reviews")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        (payload) => {
          console.log("Review change detected in testimonials:", payload);
          fetchReviews(); // Refresh testimonials when reviews change
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      reviewsSubscription.unsubscribe();
    };
  }, []);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (loading)
    return (
      <section className="py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-block w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading customer reviews...
          </p>
        </div>
      </section>
    );

  if (reviews.length === 0) return null;

  const currentReview = reviews[currentIndex];

  return (
    <section className="pt-20  relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-linear-to-br from-blue-200 to-purple-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-linear-to-br from-pink-200 to-red-200 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6">
            <Sparkles size={16} className="text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">
              Customer Love
            </span>
            <Sparkles size={16} className="text-purple-600" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            What Our Customers Say
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Real stories from real customers who trust our quality and
            craftsmanship. Join thousands of satisfied shoppers worldwide.
          </p>

          <div className="w-24 h-1 bg-linear-to-r from-purple-400 via-pink-400 to-red-400 rounded-full mx-auto"></div>
        </div>

        {/* Enhanced Testimonials Display */}
        <div className="relative">
          {/* Main Testimonial Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-100 to-pink-100 rounded-full opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-br from-blue-100 to-purple-100 rounded-full opacity-20"></div>

            <div className="relative">
              {/* Quote Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Quote size={32} className="text-white" />
                </div>
              </div>

              {/* Review Content */}
              <div className="text-center mb-8">
                <blockquote className="text-lg md:text-xl font-medium text-gray-800 mb-6 leading-relaxed italic">
                  "{currentReview.review}"
                </blockquote>

                {/* Enhanced Rating */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < currentReview.rating
                          ? "text-amber-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-700">
                    {currentReview.rating}.0
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-4">
                  {currentReview.image ? (
                    <img
                      src={currentReview.image}
                      alt={currentReview.user_name}
                      className="w-10 h-10 rounded-lg object-cover shadow-lg border-2 border-white"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                      <span className="text-white font-bold text-lg sm:text-xl">
                        {currentReview.user_name?.charAt(0).toUpperCase() ||
                          "?"}
                      </span>
                    </div>
                  )}

                  <div className="text-left">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                      {currentReview.user_name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 font-medium">
                        Verified Customer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevReview}
                className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-200 hover:scale-110"
                aria-label="Previous review"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>

              {/* Review Indicators */}
              <div className="flex items-center gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? "bg-linear-to-r from-purple-500 to-pink-500 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-200 hover:scale-110"
                aria-label="Next review"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-black text-gray-900 mb-2">10K+</div>
            <div className="text-sm text-gray-600 font-medium">
              Happy Customers
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-gray-900 mb-2">4.9★</div>
            <div className="text-sm text-gray-600 font-medium">
              Average Rating
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-gray-900 mb-2">98%</div>
            <div className="text-sm text-gray-600 font-medium">
              Satisfaction Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-gray-900 mb-2">24/7</div>
            <div className="text-sm text-gray-600 font-medium">
              Customer Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
