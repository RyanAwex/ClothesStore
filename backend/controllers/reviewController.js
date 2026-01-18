import Review from "../models/Review.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    return res.status(200).json(reviews);
  } catch (error) {
    console.log("Error while fetching reviews: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addReview = async (req, res) => {
  const { name, review, rating } = req.body;

  if (!name || !review || rating === undefined) {
    return res.status(400).json({
      success: false,
      message: "Name, Review, and Rating are required",
    });
  }

  const parsedRating = Number(rating);
  if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return res
      .status(400)
      .json({ success: false, message: "Rating must be between 1 and 5" });
  }

  try {
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newReview = new Review({
      name,
      review,
      rating: parsedRating,
      image,
    });

    await newReview.save();

    res
      .status(201)
      .json({ success: true, message: "Review added successfully" });
  } catch (error) {
    console.log("Error while adding review: ", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateReview = async (req, res) => {
  const { name, review, rating } = req.body;
  const { id } = req.params;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Review id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review id" });
    }

    const reviewDoc = await Review.findById(id);
    if (!reviewDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (req.file && reviewDoc.image) {
      // Delete old image
      const oldImagePath = path.join("public", reviewDoc.image);
      fs.unlink(oldImagePath, (err) => {
        if (err)
          console.log(`Error deleting old image ${oldImagePath}:`, err.message);
      });
    }

    if (name !== undefined) reviewDoc.name = name;
    if (review !== undefined) reviewDoc.review = review;
    if (rating !== undefined) {
      const parsed = Number(rating);
      if (!Number.isFinite(parsed) || parsed < 1 || parsed > 5) {
        return res
          .status(400)
          .json({ success: false, message: "Rating must be between 1 and 5" });
      }
      reviewDoc.rating = parsed;
    }
    if (req.file) reviewDoc.image = `/uploads/${req.file.filename}`;

    await reviewDoc.save();

    return res.status(200).json({ success: true, review: reviewDoc });
  } catch (error) {
    console.log("Error while updating review: ", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Review id is required" });
    }

    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Delete image
    if (deleted.image) {
      const imagePath = path.join("public", deleted.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.log(`Error deleting image ${imagePath}:`, err.message);
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.log("Error while deleting review: ", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
