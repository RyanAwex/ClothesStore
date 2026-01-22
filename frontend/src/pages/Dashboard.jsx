import React, { useEffect, useState } from "react";
import SharedHeader from "../components/SharedHeader";
import { useAuthStore } from "../stores/authStore";
import supabase, {
  uploadProductImage,
  getProductImageUrl,
} from "../utils/supabase";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Star,
  Plus,
  Edit,
  Trash2,
  Menu,
  X,
  Upload,
  Eye,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    variants: [{ color: "", imageFile: null, imagePreview: null }],
    sizes: [],
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images and prepare variants
      const variantsWithImages = await Promise.all(
        productForm.variants.map(async (variant, index) => {
          let imagePath = variant.image;
          if (variant.imageFile) {
            const fileName = `products/${Date.now()}-${index}-${variant.imageFile.name}`;
            imagePath = await uploadProductImage(variant.imageFile, fileName);
          }
          return {
            color: variant.color,
            image:
              imagePath ||
              "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081",
          };
        }),
      );

      const productData = {
        name: productForm.name,
        price: parseFloat(productForm.price),
        description: productForm.description,
        variants: variantsWithImages,
        sizes: productForm.sizes,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
      }

      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
      fetchProducts();
    } catch (error) {
      alert(error.message || "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      price: "",
      description: "",
      variants: [{ color: "", imageFile: null, imagePreview: null }],
      sizes: [],
    });
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      price: String(product.price || ""),
      description: product.description || "",
      variants: (product.variants || []).map((v) => ({
        ...v,
        imageFile: null,
        imagePreview: null,
      })),
      sizes: product.sizes || [],
    });
    setShowProductModal(true);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      fetchProducts();
    } catch (error) {
      alert("Error deleting product");
    }
  };

  const addVariant = () => {
    setProductForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { color: "", imageFile: null, imagePreview: null },
      ],
    }));
  };

  const updateVariant = (index, field, value) => {
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v,
      ),
    }));
  };

  const removeVariant = (index) => {
    setProductForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const toggleSize = (size) => {
    setProductForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
        <img
          src={getProductImageUrl(product.variants?.[0]?.image)}
          alt={product.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
        <p className="text-lg font-bold text-amber-600 mt-1">
          MAD {product.price}
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => startEdit(product)}
            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => deleteProduct(product.id)}
            className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex pt-20">
        {/* Sidebar */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
        >
          <div className="p-6 pt-20 lg:pt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">
              Admin Dashboard
            </h1>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 lg:ml-0">
          {/* Overview Tab */}
          {activeTab === "overview" && (
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
                  value="MAD 0"
                  icon={DollarSign}
                  color="bg-green-500"
                />
                <StatCard
                  title="Total Orders"
                  value="0"
                  icon={ShoppingCart}
                  color="bg-purple-500"
                />
                <StatCard
                  title="Total Reviews"
                  value="0"
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
                      <div key={product.id} className="flex items-center gap-3">
                        <img
                          src={getProductImageUrl(product.variants?.[0]?.image)}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
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
                      className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
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
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
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
                  className="mt-4 sm:mt-0 bg-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Orders
                </h2>
                <p className="text-gray-600">
                  Orders functionality coming soon
                </p>
              </div>
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Orders Management
                </h3>
                <p className="text-gray-600">
                  This feature is not yet implemented.
                </p>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Reviews
                </h2>
                <p className="text-gray-600">
                  Reviews functionality coming soon
                </p>
              </div>
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Reviews Management
                </h3>
                <p className="text-gray-600">
                  This feature is not yet implemented.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                    resetProductForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-24 resize-none"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
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
                    className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-colors"
                  >
                    + Add Variant
                  </button>
                </div>
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
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-amber-500"
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
                  className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                    resetProductForm();
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
