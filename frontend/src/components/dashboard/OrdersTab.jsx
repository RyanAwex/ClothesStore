import React from "react";
import { ShoppingCart } from "lucide-react";

const OrdersTab = ({ orders, updateOrderStatus, deleteOrder }) => (
  <div>
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Orders Management
      </h2>
      <p className="text-gray-600">View and manage customer orders</p>
    </div>

    {orders.length === 0 ? (
      <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Orders Yet
        </h3>
        <p className="text-gray-600">
          Orders will appear here once customers start placing them.
        </p>
      </div>
    ) : (
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order.id.slice(-8)}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4 mt-2 lg:mt-0">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "pending"
                      ? "bg-purple-100 text-purple-800"
                      : order.status === "processing"
                        ? "bg-purple-200 text-purple-900"
                        : order.status === "shipped"
                          ? "bg-purple-300 text-purple-900"
                          : order.status === "delivered"
                            ? "bg-purple-400 text-white"
                            : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() +
                    order.status.slice(1)}
                </span>
                <span className="text-lg font-bold text-purple-600">
                  MAD {order.total}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Customer
                </p>
                <p className="text-sm text-gray-600">
                  {order.customer_name}
                </p>
                <p className="text-sm text-gray-600">{order.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Contact
                </p>
                <p className="text-sm text-gray-600">
                  {order.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Payment
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {order.payment_method}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Items
              </p>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600">
                      {item.color} • {item.size} • Qty:{" "}
                      {item.quantity}
                    </span>
                    <span className="text-purple-600 font-medium">
                      MAD {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {order.status !== "delivered" &&
              order.status !== "cancelled" && (
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order.id, "processing")
                      }
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      Start Processing
                    </button>
                  )}
                  {order.status === "processing" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order.id, "shipped")
                      }
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      Mark as Shipped
                    </button>
                  )}
                  {order.status === "shipped" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order.id, "delivered")
                      }
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {order.status !== "cancelled" && (
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default OrdersTab;