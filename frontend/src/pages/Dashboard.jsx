import React, { useEffect, useState } from "react";
import SharedHeader from "../components/SharedHeader";
import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const API_PRODUCTS =
  import.meta.env.VITE_MODE === "development"
    ? `http://localhost:5000/api/products`
    : `${API_URL}/api/products`;
const API_ORDERS =
  import.meta.env.VITE_MODE === "development"
    ? `http://localhost:5000/api/orders`
    : `${API_URL}/api/orders`;
const API_REVIEWS =
  import.meta.env.VITE_MODE === "development"
    ? `http://localhost:5000/api/reviews`
    : `${API_URL}/api/reviews`;
const BASE_URL =
  import.meta.env.VITE_MODE === "development"
    ? "http://localhost:5000"
    : API_URL;

function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) navigate("/");
  }, [isAuthenticated, user, navigate]);

  const [active, setActive] = useState("products");

  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  // Form state for add/edit
  const emptyForm = {
    name: "",
    price: "",
    description: "",
    details: "",
    variants: [],
    sizes: [],
  };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Reviews form
  const emptyReviewForm = {
    name: "",
    review: "",
    rating: 5,
  };
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);

  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const res = await axios.get(API_PRODUCTS);
      setProducts(res.data);
    } catch (e) {
      setError(
        e.response?.data?.message || e.message || "Error fetching products",
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const res = await axios.get(API_ORDERS);
      setOrders(res.data);
    } catch (e) {
      setOrdersError(
        e.response?.data?.message || e.message || "Orders API not available",
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    setReviewsError(null);
    try {
      const res = await axios.get(API_REVIEWS);
      setReviews(res.data);
    } catch (e) {
      setReviewsError(
        e.response?.data?.message || e.message || "Error fetching reviews",
      );
    } finally {
      setLoadingReviews(false);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete order?")) return;
    try {
      await axios.delete(`${API_ORDERS}/${id}`);
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.message || e.message || "Error deleting order");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (active === "orders") fetchOrders();
  }, [active]);

  useEffect(() => {
    if (active === "reviews") fetchReviews();
  }, [active]);

  const handleInput = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSizeToggle = (size) => {
    setForm((s) => ({
      ...s,
      sizes: s.sizes.includes(size)
        ? s.sizes.filter((sz) => sz !== size)
        : [...s.sizes, size],
    }));
  };

  const submitAdd = async (e) => {
    e && e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("details", form.details);
    formData.append(
      "variants",
      JSON.stringify(form.variants.map((v) => ({ color: v.color }))),
    );
    formData.append("sizes", JSON.stringify(form.sizes));

    // Append files
    const fileInputs = document.querySelectorAll(
      'input[type="file"][name^="variantImage"]',
    );
    fileInputs.forEach((input) => {
      if (input.files[0]) {
        formData.append(`variantImages`, input.files[0]);
      }
    });

    try {
      await axios.post(API_PRODUCTS, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm(emptyForm);
      setShowAddForm(false);
      fetchProducts();
      setEditingId(null);
    } catch (e) {
      alert(e.response?.data?.message || e.message || "Error adding product");
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name || "",
      price: String(p.price || ""),
      description: p.description || "",
      details: p.details || "",
      variants: Array.isArray(p.variants) ? p.variants : [],
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitEdit = async (e) => {
    e && e.preventDefault();
    if (!editingId) return submitAdd(e);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("details", form.details);
    formData.append(
      "variants",
      JSON.stringify(
        form.variants.map((v) => ({ color: v.color, image: v.image })),
      ),
    );
    formData.append("sizes", JSON.stringify(form.sizes));

    // Append files
    const fileInputs = document.querySelectorAll(
      'input[type="file"][name^="variantImage"]',
    );
    fileInputs.forEach((input) => {
      if (input.files[0]) {
        formData.append(`variantImages`, input.files[0]);
      }
    });

    try {
      await axios.put(`${API_PRODUCTS}/${editingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm(emptyForm);
      setEditingId(null);
      setShowAddForm(false);
      fetchProducts();
    } catch (e) {
      alert(e.response?.data?.message || e.message || "Error updating product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      await axios.delete(`${API_PRODUCTS}/${id}`);
      fetchProducts();
    } catch (e) {
      alert(e.response?.data?.message || e.message || "Error deleting product");
    }
  };

  const handleReviewInput = (k, v) => setReviewForm((s) => ({ ...s, [k]: v }));

  const submitAddReview = async (e) => {
    e && e.preventDefault();
    const formData = new FormData();
    formData.append("name", reviewForm.name);
    formData.append("review", reviewForm.review);
    formData.append("rating", reviewForm.rating);

    const imageInput = document.querySelector(
      'input[type="file"][name="reviewImage"]',
    );
    if (imageInput && imageInput.files[0]) {
      formData.append("image", imageInput.files[0]);
    }

    try {
      await axios.post(API_REVIEWS, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReviewForm(emptyReviewForm);
      setShowAddReviewForm(false);
      fetchReviews();
      setEditingReviewId(null);
    } catch (e) {
      alert(e.response?.data?.message || e.message || "Error adding review");
    }
  };

  const startEditReview = (r) => {
    setEditingReviewId(r._id);
    setReviewForm({
      name: r.name || "",
      review: r.review || "",
      rating: r.rating || 5,
    });
    setShowAddReviewForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitEditReview = async (e) => {
    e && e.preventDefault();
    if (!editingReviewId) return submitAddReview(e);
    const formData = new FormData();
    formData.append("name", reviewForm.name);
    formData.append("review", reviewForm.review);
    formData.append("rating", reviewForm.rating);

    const imageInput = document.querySelector(
      'input[type="file"][name="reviewImage"]',
    );
    if (imageInput && imageInput.files[0]) {
      formData.append("image", imageInput.files[0]);
    }

    try {
      await axios.put(`${API_REVIEWS}/${editingReviewId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReviewForm(emptyReviewForm);
      setEditingReviewId(null);
      setShowAddReviewForm(false);
      fetchReviews();
    } catch (e) {
      alert(e.response?.data?.message || e.message || "Error updating review");
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete review?")) return;
    try {
      await axios.delete(`${API_REVIEWS}/${id}`);
      fetchReviews();
    } catch (e) {
      alert(e.response?.data?.message || e.message || "Error deleting review");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SharedHeader />

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1 bg-white border border-slate-200 shadow-lg rounded-lg p-4 h-fit">
          <h2 className="font-bold text-lg mb-4">Admin</h2>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActive("products")}
              className={`text-left px-3 py-2 rounded ${active === "products" ? "bg-amber-800 text-white" : "hover:bg-gray-50"}`}
            >
              Products
            </button>
            <button
              onClick={() => setActive("orders")}
              className={`text-left px-3 py-2 rounded ${active === "orders" ? "bg-amber-800 text-white" : "hover:bg-gray-50"}`}
            >
              Orders
            </button>
            <button
              onClick={() => setActive("reviews")}
              className={`text-left px-3 py-2 rounded ${active === "reviews" ? "bg-amber-800 text-white" : "hover:bg-gray-50"}`}
            >
              Reviews
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="lg:col-span-3">
          {active === "products" && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-extrabold">Products</h1>
                <div className="flex gap-2">
                  {!showAddForm && !editingId && (
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyForm);
                        setShowAddForm(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-4 py-2 bg-amber-800 text-white rounded-lg font-semibold"
                    >
                      Add Product
                    </button>
                  )}
                </div>
              </div>

              {/* Add / Edit form (shown when adding or editing) */}
              {(showAddForm || editingId) && (
                <form
                  onSubmit={editingId ? submitEdit : submitAdd}
                  className="bg-white border border-slate-200 shadow-lg rounded-lg p-4 mb-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) => handleInput("name", e.target.value)}
                      className="border rounded px-3 py-2"
                    />
                    <input
                      placeholder="Price"
                      value={form.price}
                      onChange={(e) => handleInput("price", e.target.value)}
                      className="border rounded px-3 py-2"
                    />

                    {/* Variants as dynamic list of {color,image} */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Variants
                      </label>
                      <div className="space-y-2">
                        {(form.variants || []).map((v, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row gap-2"
                          >
                            <input
                              placeholder="Color"
                              value={v.color || ""}
                              onChange={(e) => {
                                const next = [...form.variants];
                                next[idx] = {
                                  ...(next[idx] || {}),
                                  color: e.target.value,
                                };
                                handleInput("variants", next);
                              }}
                              className="w-full sm:max-w-20 h-12 border rounded px-3 py-2 sm:flex-1"
                            />
                            <input
                              type="file"
                              name={`variantImage${idx}`}
                              accept="image/*"
                              className="w-full sm:max-w-20 h-12 border rounded px-3 py-2 sm:flex-1"
                            />
                            {v.image && (
                              <div className="text-sm text-gray-600 w-full sm:max-w-20 max-h-12 overflow-hidden">
                                {v.image}
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...form.variants];
                                next.splice(idx, 1);
                                handleInput("variants", next);
                              }}
                              className="px-3 py-2 border rounded bg-red-50 text-red-600 sm:self-center"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            handleInput("variants", [
                              ...(form.variants || []),
                              { color: "", image: "" },
                            ])
                          }
                          className="px-3 py-2 bg-gray-100 rounded w-full sm:w-auto"
                        >
                          Add Variant
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sizes
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                          <label key={size} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={form.sizes.includes(size)}
                              onChange={() => handleSizeToggle(size)}
                              className="mr-2"
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>
                    <textarea
                      placeholder="Short description"
                      value={form.description}
                      onChange={(e) =>
                        handleInput("description", e.target.value)
                      }
                      className="border rounded px-3 py-2 sm:col-span-2"
                    />
                    <textarea
                      placeholder="Details (optional)"
                      value={form.details}
                      onChange={(e) => handleInput("details", e.target.value)}
                      className="border rounded px-3 py-2 sm:col-span-2"
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-800 text-white rounded-lg font-semibold"
                    >
                      {editingId ? "Save Changes" : "Create Product"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyForm);
                        setShowAddForm(false);
                      }}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Products list */}
              <div>
                {loadingProducts ? (
                  <div>Loading products...</div>
                ) : error ? (
                  <div className="text-red-700">{error}</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <div
                        key={p._id}
                        className="bg-white shadow-sm rounded-lg p-4 flex flex-col gap-2"
                      >
                        <div className="h-36 flex items-center justify-center bg-gray-50 rounded">
                          {p.variants && p.variants[0] ? (
                            // If variant is an object with image path, try to show it, otherwise show placeholder
                            <img
                              src={
                                typeof p.variants[0] === "string"
                                  ? p.variants[0]
                                  : p.variants[0].image
                                    ? p.variants[0].image
                                    : ""
                              }
                              alt="img"
                              className="max-h-32 object-contain"
                            />
                          ) : (
                            <div className="text-gray-400">No image</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {p.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            ${p.price}
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            {p.description}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => startEdit(p)}
                            className="px-3 py-2 border rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(p._id)}
                            className="px-3 py-2 bg-red-700 text-white rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {active === "orders" && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-extrabold">Orders</h1>
              </div>

              {loadingOrders ? (
                <div>Loading orders...</div>
              ) : ordersError ? (
                <div className="text-red-500">{ordersError}</div>
              ) : orders.length === 0 ? (
                <div className="text-gray-600">No orders found.</div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o._id || o.id || Math.random()}
                      className="border border-slate-200 shadow-lg rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">
                            {o.name || o.customerName || "Customer"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {o.email || o.customerEmail}
                          </div>
                          <div className="text-sm text-gray-600">
                            {o.phone || o.customerPhone}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(
                            o.createdAt || o.date || Date.now(),
                          ).toLocaleString()}
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-700">
                        <div>
                          Location:{" "}
                          {o.location || o.address || o.shippingAddress || "-"}
                        </div>
                        <div>
                          Payment: {o.paymentMethod || o.payment || "-"}
                        </div>
                        <div className="mt-2">Order Items:</div>
                        <ul className="list-disc pl-5">
                          {(o.items || o.order || o.orderItems || []).map(
                            (it, idx) => (
                              <li key={idx} className="text-sm">
                                {typeof it === "string"
                                  ? it
                                  : `${it.name || it.product || "Item"} — Color: ${it.color || "-"} • Size: ${it.size || "-"}`}
                              </li>
                            ),
                          )}
                        </ul>

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => deleteOrder(o._id || o.id)}
                            className="px-3 py-2 bg-red-700 text-white rounded"
                          >
                            Delete Order
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {active === "reviews" && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-extrabold">Reviews</h1>
                <div className="flex gap-2">
                  {!showAddReviewForm && !editingReviewId && (
                    <button
                      onClick={() => {
                        setEditingReviewId(null);
                        setReviewForm(emptyReviewForm);
                        setShowAddReviewForm(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-4 py-2 bg-amber-800 text-white rounded-lg font-semibold"
                    >
                      Add Review
                    </button>
                  )}
                </div>
              </div>

              {/* Add / Edit review form */}
              {(showAddReviewForm || editingReviewId) && (
                <form
                  onSubmit={
                    editingReviewId ? submitEditReview : submitAddReview
                  }
                  className="bg-white border border-slate-200 shadow-lg rounded-lg p-4 mb-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Customer Name"
                      value={reviewForm.name}
                      onChange={(e) =>
                        handleReviewInput("name", e.target.value)
                      }
                      className="border rounded px-3 py-2"
                    />
                    <select
                      value={reviewForm.rating}
                      onChange={(e) =>
                        handleReviewInput("rating", Number(e.target.value))
                      }
                      className="border rounded px-3 py-2"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                    <div className="sm:col-span-2">
                      <textarea
                        placeholder="Review text"
                        value={reviewForm.review}
                        onChange={(e) =>
                          handleReviewInput("review", e.target.value)
                        }
                        className="border rounded px-3 py-2 w-full h-24"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="file"
                        name="reviewImage"
                        accept="image/*"
                        className="border rounded px-3 py-2 w-full"
                      />
                      {editingReviewId &&
                        reviews.find((r) => r._id === editingReviewId)
                          ?.image && (
                          <div className="mt-2 text-sm text-gray-600">
                            Current image will be replaced if new file selected.
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-800 text-white rounded-lg font-semibold"
                    >
                      {editingReviewId ? "Save Changes" : "Create Review"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReviewId(null);
                        setReviewForm(emptyReviewForm);
                        setShowAddReviewForm(false);
                      }}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews list */}
              <div>
                {loadingReviews ? (
                  <div>Loading reviews...</div>
                ) : reviewsError ? (
                  <div className="text-red-700">{reviewsError}</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((r) => (
                      <div
                        key={r._id}
                        className="bg-white shadow-sm rounded-lg p-4 flex flex-col gap-2"
                      >
                        <div className="h-36 flex items-center justify-center bg-gray-50 rounded">
                          {r.image ? (
                            <img
                              src={`${BASE_URL}${r.image}`}
                              alt="reviewer"
                              className="max-h-32 object-contain rounded"
                            />
                          ) : (
                            <div className="text-gray-400">No image</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{r.name}</h3>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i < r.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                            {r.review}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => startEditReview(r)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteReview(r._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
