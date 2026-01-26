import React from "react";
import { X, Star } from "lucide-react";

const EditReviewModal = ({
  showReviewModal,
  editingReview,
  reviewForm,
  setReviewForm,
  updateReview,
  onClose,
}) => {
  if (!showReviewModal || !editingReview) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Edit Review</h3>
          <p className="text-sm text-gray-600 mt-1">
            Review by {editingReview.user_name} for{" "}
            {editingReview.products?.name || "Unknown Product"}
          </p>
        </div>

        <form onSubmit={updateReview} className="p-6 space-y-4">
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
                        ? "text-purple-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review
            </label>
            <textarea
              value={reviewForm.review}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, review: e.target.value })
              }
              placeholder="Update the review text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Update Review
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;