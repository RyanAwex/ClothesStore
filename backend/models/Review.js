import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    image: { type: String },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
