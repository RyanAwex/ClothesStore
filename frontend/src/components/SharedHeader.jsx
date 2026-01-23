import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  Heart,
  Settings,
  LogOut,
  Crown,
  Shirt,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuthStore } from "../stores/authStore";

function SharedHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const isHome = location.pathname === "/";
  const isAuth =
    location.pathname === "/auth" ||
    location.pathname === "/verify-email" ||
    location.pathname === "/checkout" ||
    location.pathname === "/forgot-password";
  const isDashboard = location.pathname === "/dashboard";

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenuOpen]);

  // Prevent background scroll when menu open; restore previous overflow on close/unmount
  // Also manage focus so we don't hide a focused element behind aria-hidden.
  const prevOverflow = useRef(null);
  useEffect(() => {
    if (menuOpen) {
      prevOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // focus first focusable element inside the menu (close button or first control)
      setTimeout(() => {
        if (menuRef.current) {
          const first = menuRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          if (first && typeof first.focus === "function") first.focus();
        }
      }, 0);
    } else if (prevOverflow.current !== null) {
      document.body.style.overflow = prevOverflow.current;
      prevOverflow.current = null;
      // If focus remained inside the closed menu, move it back to the menu toggle
      try {
        if (
          menuRef.current &&
          menuRef.current.contains(document.activeElement)
        ) {
          menuButtonRef.current && menuButtonRef.current.focus();
        }
      } catch (e) {
        // ignore focus errors
        console.log(e.message);
      }
    }

    return () => {
      if (prevOverflow.current !== null) {
        document.body.style.overflow = prevOverflow.current;
        prevOverflow.current = null;
      }
    };
  }, [menuOpen]);

  const handleNavigate = (path) => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    navigate(path);
  };

  const handleSearchSubmit = (e) => {
    e && e.preventDefault();
    setMenuOpen(false);
    setUserMenuOpen(false);
    // For now navigate to products; query handling can be added later
    navigate("/products");
  };

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const logout = useAuthStore((s) => s.logout);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);

  const handleLogout = async () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    try {
      await logout();
    } catch (e) {
      console.log(e.message);
    }
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete account? This cannot be undone.")) return;
    setMenuOpen(false);
    setUserMenuOpen(false);
    try {
      await deleteAccount();
    } catch (e) {
      console.log(e.message);
    }
    navigate("/");
  };

  const handleDashboard = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    navigate("/dashboard");
  };

  return (
    <>
      <style>{`input[type="search"]::-webkit-search-cancel-button { display: none; }`}</style>
      <header className="fixed top-0 left-0 w-full z-30 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isHome ? (
              <button
                onClick={() => navigate(-1)}
                aria-label="Back"
                className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="flex items-baseline gap-2 text-gray-900 font-black text-xl sm:text-2xl hover:scale-105 transition-transform duration-200"
                aria-label="Home"
              >
                {/* <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div> */}
                <div>
                  <div className="text-gray-900">Lux</div>
                  <div className="text-xs font-semibold text-gray-500 -mt-1">
                    By Stylish
                  </div>
                </div>
              </button>
            )}
          </div>

          {!isAuth && !isDashboard && (
            <>
              <div className="flex items-center justify-end gap-3">
                <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 w-64 shadow-sm hover:shadow-md transition-all duration-200 focus-within:shadow-lg focus-within:border-purple-300">
                  <div className="shrink-0">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search products..."
                    value={headerSearch}
                    onChange={(e) => setHeaderSearch(e.target.value)}
                    className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400 ml-3 focus:ring-0"
                  />
                  {headerSearch && (
                    <button
                      onClick={() => setHeaderSearch("")}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition shrink-0"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Cart Button */}
                {document.location.pathname !== "/cart" && (
                  <div className="relative">
                    <button
                      onClick={() => navigate("/cart")}
                      className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 hover:shadow-md relative"
                      aria-label="Cart"
                    >
                      <ShoppingCart size={20} />
                    </button>
                    {cartItemCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                        {cartItemCount}
                      </div>
                    )}
                  </div>
                )}

                {/* User Menu */}
                {isAuthenticated ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
                      aria-label="User menu"
                    >
                      <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                              <User size={18} className="text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {user?.name || user?.email?.split("@")[0]}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user?.email}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <button
                            onClick={() => handleNavigate("/profile")}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3"
                          >
                            <User size={18} className="text-gray-600" />
                            My Profile
                          </button>

                          <button
                            onClick={() => handleNavigate("/products")}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3"
                          >
                            <Shirt size={18} className="text-gray-600" />
                            All Products
                          </button>

                          <button
                            onClick={() => handleNavigate("/favorites")}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3"
                          >
                            <Heart size={18} className="text-gray-600" />
                            Favorites
                          </button>

                          <button
                            onClick={() => handleNavigate("/settings")}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3"
                          >
                            <Settings size={18} className="text-gray-600" />
                            Settings
                          </button>

                          {isAdmin && (
                            <button
                              onClick={handleDashboard}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3"
                            >
                              <Crown size={18} className="text-amber-600" />
                              Admin Dashboard
                            </button>
                          )}
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center gap-3 text-red-600"
                          >
                            <LogOut size={18} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/auth")}
                    className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                  >
                    Sign In
                  </button>
                )}

                {/* <button
                  ref={menuButtonRef}
                  onClick={() => setMenuOpen((s) => !s)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 hover:shadow-md lg:hidden"
                  aria-label="Menu"
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button> */}
              </div>
            </>
          )}

          {isDashboard && (
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onMenuClick}
                className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 hover:shadow-md lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Drawer */}
      {/* <aside
        ref={menuRef}
        className={`fixed top-0 right-0 h-full z-50 w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-100 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="h-full flex flex-col">
          <div className="h-16 sm:h-18 flex items-center justify-between px-6 mb-6 border-b border-gray-100">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div>
                <div className="text-lg font-black text-gray-900">Lux</div>
                <div className="text-xs font-semibold text-gray-500 -mt-1">
                  By Stylish
                </div>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded-xl hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="px-6 mb-6">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <Search size={18} className="text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm w-full text-gray-700"
              />
              <button
                type="submit"
                className="text-sm text-amber-800 font-semibold hover:text-amber-600 transition"
              >
                Search
              </button>
            </div>
          </form>

          <ul className="flex-1 flex flex-col gap-1 px-6">
            <li>
              <button
                onClick={() => handleNavigate("/")}
                className="w-full text-left px-4 py-4 rounded-2xl hover:bg-gray-50 transition flex items-center gap-4 font-medium"
              >
                🏠 Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate("/products")}
                className="w-full text-left px-4 py-4 rounded-2xl hover:bg-gray-50 transition flex items-center gap-4 font-medium"
              >
                🛍️ All Products
              </button>
            </li>
            {document.location.pathname !== "/cart" && (
              <li>
                <button
                  onClick={() => handleNavigate("/cart")}
                  className="w-full text-left px-4 py-4 rounded-2xl hover:bg-gray-50 transition flex items-center gap-4 font-medium"
                >
                  🛒 Cart
                  {cartItemCount > 0 && (
                    <span className="text-xs w-6 h-6 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </li>
            )}
            {document.location.pathname !== "/checkout" && (
              <li>
                <button
                  onClick={() => handleNavigate("/checkout")}
                  className="w-full text-left px-4 py-4 rounded-2xl hover:bg-gray-50 transition flex items-center gap-4 font-medium"
                >
                  💳 Checkout
                </button>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <button
                  onClick={() => handleNavigate("/profile")}
                  className="w-full text-left px-4 py-4 rounded-2xl hover:bg-gray-50 transition flex items-center gap-4 font-medium"
                >
                  👤 My Profile
                </button>
              </li>
            )}
          </ul>

          <div className="mt-auto px-6 pb-6">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <button
                    onClick={handleDashboard}
                    className="w-full mb-3 px-6 py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    👑 Admin Dashboard
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/auth");
                }}
                className="w-full mb-3 px-6 py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🚀 Sign In
              </button>
            )}
          </div>
        </nav>
      </aside> */}
    </>
  );
}

export default SharedHeader;
