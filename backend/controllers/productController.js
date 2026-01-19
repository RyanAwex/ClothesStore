import Product from "../models/Product.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json(products);
  } catch (error) {
    console.log("Error while fetching the Products: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log("Error while fetching the product: ", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addProduct = async (req, res) => {
  const { name, price, description, details, variants, sizes } = req.body;

  if (!name || price === undefined || !description || !variants) {
    return res.status(400).json({
      success: false,
      message: "Name, Price, Description and Variants are required",
    });
  }

  const parsedPrice = Number(price);
  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Price must be a positive number" });
  }

  try {
    let parsedVariants = JSON.parse(variants);
    // Upload each image to Cloudinary if present
    const uploadedVariants = await Promise.all(
      parsedVariants.map(async (v, idx) => {
        if (req.files && req.files[idx]) {
          const file = req.files[idx];
          const uploadRes = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ resource_type: "image" }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
              })
              .end(file.buffer);
          });
          if (uploadRes && uploadRes.secure_url) {
            return { color: v.color, image: uploadRes.secure_url };
          }
        }
        // If no image is provided, return null for image
        return { color: v.color, image: v.image || null };
      }),
    );
    // Validate that every variant has an image
    if (uploadedVariants.some((v) => !v.image)) {
      return res
        .status(400)
        .json({ success: false, message: "Each variant must have an image." });
    }
    const newProduct = new Product({
      name,
      price: parsedPrice,
      description,
      details,
      variants: uploadedVariants,
      sizes: sizes ? JSON.parse(sizes) : [],
    });
    await newProduct.save();
    res
      .status(201)
      .json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log("Error while adding the product: ", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { name, price, description, details, variants, sizes } = req.body;
  const { id } = req.params;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) {
      const parsed = Number(price);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Price must be a positive number" });
      }
      product.price = parsed;
    }
    if (description !== undefined) product.description = description;
    if (details !== undefined) product.details = details;
    if (variants !== undefined) {
      let parsedVariants = JSON.parse(variants);
      const uploadedVariants = await Promise.all(
        parsedVariants.map(async (v, idx) => {
          if (req.files && req.files[idx]) {
            const file = req.files[idx];
            const uploadRes = await new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream({ resource_type: "image" }, (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                })
                .end(file.buffer);
            });
            if (uploadRes && uploadRes.secure_url) {
              return { color: v.color, image: uploadRes.secure_url };
            }
          }
          return { color: v.color, image: v.image || null };
        }),
      );
      // Validate that every variant has an image
      if (uploadedVariants.some((v) => !v.image)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Each variant must have an image.",
          });
      }
      product.variants = uploadedVariants;
    }
    if (sizes !== undefined) product.sizes = JSON.parse(sizes);

    await product.save();

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("Error while updating the product: ", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product id is required" });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete associated images
    if (deleted.variants && deleted.variants.length > 0) {
      deleted.variants.forEach((variant) => {
        if (variant.image) {
          const imagePath = path.join("public", variant.image);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log(`Error deleting image ${imagePath}:`, err.message);
            } else {
              console.log(`Deleted image: ${imagePath}`);
            }
          });
        }
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error while deleting the product: ", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
