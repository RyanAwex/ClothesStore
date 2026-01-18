import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Products from "./Products";

// Example product data (should match Products.jsx)
const products = [
  {
    id: 1,
    name: "Luxury Jacket",
    price: "$49.99",
    images: ["jacket.jpg", "jacket.jpg", "jacket.jpg"],
    description:
      "A premium luxury jacket made from the finest materials. Perfect for any occasion.",
    details: "Material: 100% Wool. Lining: Silk. Care: Dry clean only.",
    colors: ["#000", "#BC9F8D", "#fff"],
  },
  // Add more products as needed
];

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id)) || products[0];
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const nextImg = () => setImgIdx((i) => (i + 1) % product.images.length);
  const prevImg = () =>
    setImgIdx((i) => (i - 1 + product.images.length) % product.images.length);

  return (
    <div className="flex flex-col relative">
      {/* Slider Section */}
      <div className="relative w-full flex flex-col items-center pt-8 px-2">
        <div className="relative w-full max-w-100 max-h-100 mx-auto flex items-center justify-center">
          {/* <button
            className="absolute left-0 top-1/2 -translate-y-1/2 shadow-lg p-2 rounded-full z-20 cursor-pointer"
            onClick={prevImg}
            aria-label="Previous image"
          >
            <ArrowLeft className=" w-6 h-6" />
          </button> */}

          <img
            src="public/logo.jpg"
            alt="Product"
            className="w-full h-full object-cover rounded-lg shadow-lg border-4 border-slate-200"
          />

          {/* <button
            className="absolute right-0 top-1/2 -translate-y-1/2 shadow-lg p-2 rounded-full z-20 cursor-pointer"
            onClick={nextImg}
            aria-label="Next image"
          >
            <ArrowRight className=" w-6 h-6" />
          </button> */}

          {/* <button
            className="absolute left-0 top-2 shadow-lg p-2 rounded-full z-30 cursor-pointer"
            onClick={() => navigate(-1)}
            aria-label="Return"
          >
            <X className=" w-5 h-5" />
          </button> */}
        </div>
      </div>

      {/* Product Info Section */}
      <div className="flex flex-col items-center mt-6 px-4">
        <h1 className="font-bold text-2xl mb-2 text-center drop-shadow-lg">
          {product.name}
        </h1>
        <p className=" text-center mb-2 max-w-xs">{product.description}</p>
        <p className=" text-xl font-semibold mb-4">{product.price}</p>
        {/* Colors */}
        <div className="flex gap-3 mb-4">
          {product.colors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color
                  ? "border-amber-800 scale-110"
                  : "border-slate-200"
              } transition`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
        {/* Actions */}
        <div className="flex gap-3 w-full max-w-xs mb-6">
          <button className="flex-1 px-4 py-2 bg-amber-800 rounded-lg text-white shadow-lg cursor-pointer hover:bg-amber-900 transition">
            Add to Cart
          </button>
          <button className="flex-1 px-4 py-2  text-amber-800 rounded-lg shadow-lg cursor-pointer hover:bg-amber-100 transition">
            Buy Now
          </button>
        </div>
      </div>

      {/* Other Products Section */}
      <div className="rounded-lg p-4 mt-4 w-full mx-auto">
        {/* <h2 className="font-semibold text-lg mb-2">Other Products</h2> */}
        <div className="flex gap-2 overflow-x-auto">
          <Products />
        </div>
      </div>
    </div>
  );
}

export default Product;
