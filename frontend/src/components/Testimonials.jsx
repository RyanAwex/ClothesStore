import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_REVIEWS =
  import.meta.env.VITE_MODE === "development"
    ? `http://localhost:5000/api/reviews`
    : `${API_URL}/api/reviews`;
const BASE_URL =
  import.meta.env.VITE_MODE === "development"
    ? "http://localhost:5000"
    : API_URL;

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API_REVIEWS)
      .then((res) => setReviews(res.data || []))
      .catch((err) => console.warn("Failed to load reviews:", err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="py-8 text-center">Loading testimonials...</div>;
  if (reviews.length === 0) return null;

  return (
    <section className="pt-12 mt-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-8">
          What Our Customers Say
        </h2>
        <div className="overflow-x-auto custom-scrollbar  px-4">
          <div
            className="flex gap-2 sm:gap-6 pb-4"
            style={{ width: "max-content", scrollSnapType: "x mandatory" }}
          >
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white shadow-sm rounded-lg p-6 shrink-0 w-[90vw] sm:w-80 lg:w-96"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  {review.image ? (
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{review.name}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{review.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
