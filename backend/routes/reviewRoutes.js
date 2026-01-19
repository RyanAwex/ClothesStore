import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getReviews);
router.post("/", verifyToken, verifyAdmin, upload.single("image"), addReview);
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  updateReview,
);
router.delete("/:id", verifyToken, verifyAdmin, deleteReview);

export default router;
