import React from "react";
import { Star, Edit, Trash2 } from "lucide-react";

const ReviewsTab = ({ reviews, openEditReviewModal, deleteReview }) => (
  <div>
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Reviews Management
      </h2>
      <p className="text-gray-600">
        Manage customer reviews and feedback
      </p>
    </div>

    {reviews.length === 0 ? (
      <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
        <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Reviews Yet
        </h3>
        <p className="text-gray-600">
          Reviews will appear here once customers start leaving
          feedback.
        </p>
      </div>
    ) : (
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {review.user_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.user_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-purple-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditReviewModal(review)}
                  className="text-purple-500 hover:text-purple-700 p-2"
                  title="Edit review"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Delete review"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Product: {review.products?.name || "Unknown Product"}
              </p>
              {review.products?.categories && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {review.products.categories.map((c) => (
                    <span
                      key={c}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-700 italic">
                "{review.review}"
              </p>
            </div>

            {review.image && (
              <div className="mb-4">
                <img
                  src={review.image}
                  alt="Review image"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            <div className="flex items-center gap-4">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  review.is_verified
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {review.is_verified
                  ? "Verified Purchase"
                  : "Unverified"}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ReviewsTab;