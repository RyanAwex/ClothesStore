import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import {
  getProducts,
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getProducts);
router.get("/:id", getProduct);

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.array("variantImages", 10),
  addProduct,
);
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.array("variantImages", 10),
  updateProduct,
);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

export default router;
