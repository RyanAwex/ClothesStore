import React from "react";
import { X, Settings, Star, Trash2 } from "lucide-react";
import { getProductImageUrl } from "../../utils/supabase";
import { CATEGORIES } from "../../utils/categories";

const ProductModal = ({
  showProductModal,
  editingProduct,
  productForm,
  setProductForm,
  showCategoryPicker,
  setShowCategoryPicker,
  loading,
  onSubmit,
  onClose,
  openCategoryPicker,
  closeCategoryPicker,
  toggleCategory,
  addVariant,
  updateVariant,
  removeVariant,
  toggleSize,
}) => {
  if (!showProductModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={productForm.name}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price (MAD)"
              value={productForm.price}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <textarea
            placeholder="Product Description"
            value={productForm.description}
            onChange={(e) =>
              setProductForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
            required
          />

          {/* Variants */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Variants
            </h4>
            <div className="space-y-4">
              {productForm.variants.map((variant, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">
                      Variant {index + 1}
                    </span>
                    {productForm.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Color"
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(index, "color", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />

                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            updateVariant(index, "imageFile", file);
                            updateVariant(
                              index,
                              "imagePreview",
                              URL.createObjectURL(file),
                            );
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                    </div>
                  </div>

                  {(variant.imagePreview || variant.image) && (
                    <div className="mt-3">
                      <img
                        src={
                          variant.imagePreview ||
                          getProductImageUrl(variant.image)
                        }
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addVariant}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
              >
                + Add Variant
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={openCategoryPicker}
              className="w-full py-3 px-4 border-2 border-purple-400 bg-purple-50 rounded-lg text-purple-700 font-semibold flex items-center justify-center gap-2 hover:bg-purple-100 hover:border-purple-600 hover:text-purple-900 transition-colors shadow-sm"
              title="Options"
            >
              <Settings className="w-5 h-5 text-purple-500" />
              <span>Add Product Categories</span>
            </button>
            {showCategoryPicker && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">Select Categories</span>
                  <button type="button" onClick={closeCategoryPicker} className="text-red-500 hover:text-red-600 hover:underline">Close</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium text-left cursor-pointer ${
                        productForm.categories.includes(cat)
                          ? "bg-purple-100 text-purple-800 border-purple-200"
                          : "bg-white text-gray-700 border-gray-300 hover:border-purple-500"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Featured Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setProductForm(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
              className={`w-full py-3 px-4 border-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm ${
                productForm.isFeatured
                  ? "border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:border-yellow-600 hover:text-yellow-900"
                  : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
              }`}
              title="Toggle Featured Product"
            >
              <Star className={`w-5 h-5 ${productForm.isFeatured ? "fill-current text-yellow-500" : "text-gray-500"}`} />
              <span>{productForm.isFeatured ? "Featured Product" : "Mark as Featured"}</span>
            </button>
          </div>

          {/* Sizes */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Sizes
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`py-2 px-4 rounded-lg border font-medium transition-colors ${
                    productForm.sizes.includes(size)
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-purple-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : editingProduct
                  ? "Update Product"
                  : "Create Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;