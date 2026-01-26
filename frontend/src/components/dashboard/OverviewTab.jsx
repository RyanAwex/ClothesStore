import React from "react";
import { Plus, Package, ShoppingCart, Star, DollarSign } from "lucide-react";
import { getProductImageUrl } from "../../utils/supabase";
import StatCard from "./StatCard";

const OverviewTab = ({ products, orders, reviews, setActiveTab, setShowProductModal }) => (
  <>
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={Package}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`MAD ${orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0).toFixed(2)}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={ShoppingCart}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Reviews"
          value={reviews.length}
          icon={Star}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Products
          </h3>
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3"
              >
                <img
                  src={getProductImageUrl(
                    product.variants?.[0]?.image,
                  )}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  {product.categories &&
                    product.categories.length > 0 && (
                      <div className="flex justify-start flex-wrap gap-1 mt-1">
                        {product.categories.slice(0, 2).map((c) => (
                          <span
                            key={c}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-xl border border-gray-300"
                          >
                            {c}
                          </span>
                        ))}
                        {product.categories.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            +{product.categories.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  <p className="text-sm text-gray-600 mt-1">
                    MAD {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => {
                setActiveTab("products");
                setShowProductModal(true);
              }}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* removed big categories section - categories are edited per-product via Options */}
  </>
);

export default OverviewTab;