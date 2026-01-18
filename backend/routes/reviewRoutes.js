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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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
