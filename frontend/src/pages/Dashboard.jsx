import React, { useEffect, useState } from "react";
import SharedHeader from "../components/SharedHeader";
import { useAuthStore } from "../stores/authStore";
import supabase, {
  uploadProductImage,
  getProductImageUrl,
  deleteProductImages,
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
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Settings,
} from "lucide-react";

function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  // Debug logging
  // useEffect(() => {
  //   console.log("Dashboard Debug:");
  //   console.log("- User:", user);
  //   console.log("- User metadata:", user?.app_metadata);
  //   console.log("- User role:", user?.app_metadata?.role);
  //   console.log("- Is Admin:", isAdmin);
  // }, [user, isAdmin]);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: "",
  });
  const [loading, setLoading] = useState(true);
  const [optionsOpenProductId, setOptionsOpenProductId] = useState(null);
  const [categoryEditorSelections, setCategoryEditorSelections] = useState([]);
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);

  // Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    variants: [{ color: "", imageFile: null, imagePreview: null }],
    sizes: [],
    categories: [],
  });

  // Available categories
  const CATEGORIES = [
    "Djellabas",
    "Caftans",
    "Takchitas",
    "Gandouras",
    "Abayas",
    "Kimonos & Cardigans",
    "Belghas (Slippers)",
    "T-shirts & Tops",
    "Dresses",
    "Shirts & Blouses",
    "Trousers & Jeans",
    "Skirts",
    "Jackets & Coats",
    "Sportswear",
    "Modest Wear",
    "Handbags & Clutches",
    "Heels",
    "Sneakers",
    "Jewelry",
    "Watches",
    "Hijabs & Scarves",
    "Belts",
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchReviews();

    // Set up real-time subscription for orders
    const ordersSubscription = supabase
      .channel("orders_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("Order change detected:", payload);
          fetchOrders(); // Refresh orders when any change occurs
        },
      )
      .subscribe();

    // Set up real-time subscription for reviews
    const reviewsSubscription = supabase
      .channel("reviews_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        (payload) => {
          console.log("Review change detected:", payload);
          fetchReviews(); // Refresh reviews when any change occurs
        },
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      ordersSubscription.unsubscribe();
      reviewsSubscription.unsubscribe();
    };
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

  const fetchOrders = async () => {
    try {
      // console.log(
      //   "Fetching orders... User:",
      //   user,
      //   "Is Admin:",
      //   user?.app_metadata?.role === "admin",
      // );
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching orders:", error);
        throw error;
      }
      // console.log("Orders fetched successfully:", data?.length || 0, "orders");
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          *,
          products (
            id,
            name,
            categories
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
        categories: productForm.categories,
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
      categories: [],
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
      categories: product.categories || [],
    });
    setShowProductModal(true);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // Attempt to delete associated images from storage first.
      const product = products.find((p) => p.id === id);
      if (product) {
        const imagePaths = (product.variants || [])
          .map((v) => v.image)
          .filter(Boolean);

        try {
          await deleteProductImages(imagePaths);
        } catch (err) {
          // Log but continue with DB deletion - storage delete failures
          // shouldn't leave the app in a broken state.
          console.error("Error deleting product images:", err);
        }
      }

      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      fetchProducts();
    } catch (error) {
      alert("Error deleting product");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    console.log("Updating order status:", orderId, newStatus);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) {
        console.error("Error updating order status:", error);
        throw error;
      }
      console.log("Order status updated successfully");
      // fetchOrders(); // Removed since real-time subscription will handle this
    } catch (error) {
      console.error("Error in updateOrderStatus:", error);
      alert("Error updating order status: " + error.message);
    }
  };

  const deleteOrder = async (orderId) => {
    if (
      !confirm(
        "Are you sure you want to cancel and delete this order? This action cannot be undone.",
      )
    )
      return;

    console.log("Attempting to delete order:", orderId);
    console.log("Current user:", user);
    console.log("Is admin:", isAdmin);

    try {
      const { data, error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) {
        console.error("Supabase error deleting order:", error);
        throw error;
      }

      console.log("Order deleted successfully, response:", data);
      alert("Order deleted successfully");
      // fetchOrders(); // Removed since real-time subscription will handle this
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order: " + error.message);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);
      if (error) throw error;
      // fetchReviews(); // Removed since real-time subscription will handle this
    } catch (error) {
      alert("Error deleting review");
    }
  };

  const openEditReviewModal = (review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      review: review.review,
    });
    setShowReviewModal(true);
  };

  const updateReview = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          rating: reviewForm.rating,
          review: reviewForm.review,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingReview.id);

      if (error) throw error;

      setShowReviewModal(false);
      setEditingReview(null);
      setReviewForm({ rating: 5, review: "" });
      // fetchReviews(); // Removed since real-time subscription will handle this
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Error updating review: " + error.message);
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

  const toggleCategory = (category) => {
    setProductForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  // Open the inline category editor for a product
  // For Add/Edit modal: open inline category picker
  const openCategoryPicker = () => setShowCategoryPicker(true);
  const closeCategoryPicker = () => setShowCategoryPicker(false);

  const closeCategoryEditor = () => {
    setOptionsOpenProductId(null);
    setCategoryEditorSelections([]);
  };

  const toggleEditorCategory = (cat) => {
    setCategoryEditorSelections((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const saveProductCategories = async (productId) => {
    setUpdatingCategoryId(productId);
    try {
      const { error } = await supabase
        .from("products")
        .update({ categories: categoryEditorSelections })
        .eq("id", productId);
      if (error) throw error;
      await fetchProducts();
      closeCategoryEditor();
    } catch (err) {
      console.error("Error updating categories:", err);
      alert("Failed to update categories");
    } finally {
      setUpdatingCategoryId(null);
    }
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
      <div
        className="bg-gray-50 flex items-center justify-center p-4"
        style={{ aspectRatio: "4 / 3" }}
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
            onClick={() => startEdit(product)}
            className="flex-1 bg-purple-50 text-purple-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
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
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
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
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Reviews Management
                </h2>
                <p className="text-gray-600">
                  Manage customer reviews and feedback
                </p>
              </div>

              {reviews.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-600">
                    Reviews will appear here once customers start leaving
                    feedback.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">
                              {review.user_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {review.user_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-purple-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">
                                {review.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditReviewModal(review)}
                            className="text-purple-500 hover:text-purple-700 p-2"
                            title="Edit review"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteReview(review.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                            title="Delete review"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Product: {review.products?.name || "Unknown Product"}
                        </p>
                        {review.products?.categories && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {review.products.categories.map((c) => (
                              <span
                                key={c}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-gray-700 italic">
                          "{review.review}"
                        </p>
                      </div>

                      {review.image && (
                        <div className="mb-4">
                          <img
                            src={review.image}
                            alt="Review image"
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            review.is_verified
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {review.is_verified
                            ? "Verified Purchase"
                            : "Unverified"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Inline category editor modal (centered) */}
      {optionsOpenProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Categories</h3>
              <button onClick={closeCategoryEditor} className="text-gray-500">
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleEditorCategory(cat)}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium text-left ${
                    categoryEditorSelections.includes(cat)
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : "bg-white text-gray-700 border-gray-300 hover:border-purple-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeCategoryEditor}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => saveProductCategories(optionsOpenProductId)}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                disabled={updatingCategoryId === optionsOpenProductId}
              >
                {updatingCategoryId === optionsOpenProductId
                  ? "Saving..."
                  : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {showReviewModal && editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Edit Review</h3>
              <p className="text-sm text-gray-600 mt-1">
                Review by {editingReview.user_name} for{" "}
                {editingReview.products?.name || "Unknown Product"}
              </p>
            </div>

            <form onSubmit={updateReview} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewForm.rating
                            ? "text-purple-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review
                </label>
                <textarea
                  value={reviewForm.review}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, review: e.target.value })
                  }
                  placeholder="Update the review text..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Update Review
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setEditingReview(null);
                    setReviewForm({ rating: 5, review: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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
