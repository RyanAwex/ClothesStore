import Product from "../models/Product.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

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
    parsedVariants = parsedVariants.map((v, idx) => ({
      color: v.color,
      image:
        req.files && req.files[idx]
          ? `/uploads/${req.files[idx].filename}`
          : v.image || "",
    }));

    const newProduct = new Product({
      name,
      price: parsedPrice,
      description,
      details,
      variants: parsedVariants,
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
      parsedVariants = parsedVariants.map((v, idx) => {
        if (req.files && req.files[idx] && v.image) {
          // Delete old image
          const oldImagePath = path.join("public", v.image);
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.log(
                `Error deleting old image ${oldImagePath}:`,
                err.message,
              );
            } else {
              console.log(`Deleted old image: ${oldImagePath}`);
            }
          });
        }
        return {
          color: v.color,
          image:
            req.files && req.files[idx]
              ? `/uploads/${req.files[idx].filename}`
              : v.image || "",
        };
      });
      product.variants = parsedVariants;
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
