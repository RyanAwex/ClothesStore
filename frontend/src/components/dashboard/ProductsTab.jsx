import React from "react";
import { Plus } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductsTab = ({ products, loading, setShowProductModal, startEdit, deleteProduct }) => (
  <div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Products
        </h2>
        <p className="text-gray-600">Manage your product catalog</p>
      </div>
      <button
        onClick={() => setShowProductModal(true)}
        className="mt-4 sm:mt-0 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
      >
        <Plus className="w-5 h-5" />
        Add Product
      </button>
    </div>

    {loading ? (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={startEdit}
            onDelete={deleteProduct}
          />
        ))}
      </div>
    )}
  </div>
);

export default ProductsTab;