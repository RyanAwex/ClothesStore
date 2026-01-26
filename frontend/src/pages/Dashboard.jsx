import React, { useEffect, useState } from "react";
import SharedHeader from "../components/shared/SharedHeader";
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
  X,
  DollarSign,
  Settings,
} from "lucide-react";
import { CATEGORIES } from "../utils/categories";

// Import dashboard components
import {
  Sidebar,
  StatCard,
  ProductCard,
  OverviewTab,
  ProductsTab,
  OrdersTab,
  ReviewsTab,
  ProductModal,
  CategoryEditorModal,
  EditReviewModal,
} from "../components/dashboard";

function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
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
    isFeatured: false,
  });

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
        is_featured: productForm.isFeatured,
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
      isFeatured: false,
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
      isFeatured: product.is_featured || false,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex pt-20">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSidebarOpen={setSidebarOpen}
          tabs={tabs}
          sidebarOpen={sidebarOpen}
        />

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
            <OverviewTab
              products={products}
              orders={orders}
              reviews={reviews}
              setActiveTab={setActiveTab}
              setShowProductModal={setShowProductModal}
            />
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <ProductsTab
              products={products}
              loading={loading}
              setShowProductModal={setShowProductModal}
              startEdit={startEdit}
              deleteProduct={deleteProduct}
            />
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              updateOrderStatus={updateOrderStatus}
              deleteOrder={deleteOrder}
            />
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <ReviewsTab
              reviews={reviews}
              openEditReviewModal={openEditReviewModal}
              deleteReview={deleteReview}
            />
          )}
        </main>
      </div>

      <ProductModal
        showProductModal={showProductModal}
        editingProduct={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        showCategoryPicker={showCategoryPicker}
        setShowCategoryPicker={setShowCategoryPicker}
        loading={loading}
        onSubmit={handleProductSubmit}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
          resetProductForm();
        }}
        openCategoryPicker={openCategoryPicker}
        closeCategoryPicker={closeCategoryPicker}
        toggleCategory={toggleCategory}
        addVariant={addVariant}
        updateVariant={updateVariant}
        removeVariant={removeVariant}
        toggleSize={toggleSize}
      />

      <CategoryEditorModal
        optionsOpenProductId={optionsOpenProductId}
        categoryEditorSelections={categoryEditorSelections}
        setCategoryEditorSelections={setCategoryEditorSelections}
        closeCategoryEditor={closeCategoryEditor}
        toggleEditorCategory={toggleEditorCategory}
        saveProductCategories={saveProductCategories}
        updatingCategoryId={updatingCategoryId}
      />

      <EditReviewModal
        showReviewModal={showReviewModal}
        editingReview={editingReview}
        reviewForm={reviewForm}
        setReviewForm={setReviewForm}
        updateReview={updateReview}
        onClose={() => {
          setShowReviewModal(false);
          setEditingReview(null);
          setReviewForm({ rating: 5, review: "" });
        }}
      />
    </div>
  );
}

export default Dashboard;
