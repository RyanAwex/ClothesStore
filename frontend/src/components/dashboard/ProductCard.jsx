import React from "react";
import { getProductImageUrl } from "../../utils/supabase";

const ProductCard = ({ product, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
    <div
      className="bg-gray-50 flex items-center justify-center p-4"
      style={{ aspectRatio: "1 / 1" }}
    >
      <img
        src={getProductImageUrl(product.variants?.[0]?.image)}
        alt={product.name}
        className="w-full h-full object-cover rounded-xl"
      />
    </div>
    <div className="p-4 pt-3 relative">
      <div className="flex items-start">
        <div className="min-w-0">
          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex justify-start flex-wrap gap-1 mt-1">
                {product.categories.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-xl border border-pink-300"
                  >
                    {c}
                  </span>
                ))}
                {product.categories.length > 2 && (
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                    +{product.categories.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          <h3 className="font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
        </div>
      </div>
      <p className="text-lg font-bold text-purple-600 mt-1">
        MAD {product.price}
      </p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-purple-50 text-purple-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default ProductCard;