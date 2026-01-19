import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Search, ShoppingCart, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuthStore } from "../stores/authStore";

function SharedHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const isHome = location.pathname === "/";
  const isAuth =
    location.pathname === "/auth" ||
    location.pathname === "/verify-email" ||
    // location.pathname === "/checkout" ||
    location.pathname === "/forgot-password";

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
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
    navigate(path);
  };

  const handleSearchSubmit = (e) => {
    e && e.preventDefault();
    setMenuOpen(false);
    // For now navigate to products; query handling can be added later
    navigate("/products");
  };

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);

  const handleLogout = async () => {
    setMenuOpen(false);
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
    try {
      await deleteAccount();
    } catch (e) {
      console.log(e.message);
    }
    navigate("/");
  };

  const handleDashboard = () => {
    setMenuOpen(false);
    navigate("/dashboard");
  };

  return (
    <>
      <style>{`input[type="search"]::-webkit-search-cancel-button { display: none; }`}</style>
      <header className="fixed top-0 left-0 w-full z-30 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isHome ? (
              <button
                onClick={() => navigate(-1)}
                aria-label="Back"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="flex items-baseline gap-1 text-gray-900 font-bold text-lg sm:text-xl"
                aria-label="Home"
              >
                Lux
                <span className="text-xs font-semibold text-gray-500">
                  By Stylish
                </span>
              </button>
            )}
          </div>

          {!isAuth && (
            <>
              <div className="flex items-center justify-end gap-2">
                <div className="hidden md:flex items-center bg-white border border-gray-300 rounded-full px-3 py-2 w-56 shadow-sm hover:shadow-md transition-shadow">
                  <div className="shrink-0">
                    <Search size={16} className="text-gray-400 mr-2" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search products"
                    value={headerSearch}
                    onChange={(e) => setHeaderSearch(e.target.value)}
                    className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400 focus:ring-0"
                  />
                  {headerSearch && (
                    <button
                      onClick={() => setHeaderSearch("")}
                      className="mr-2 text-gray-400 hover:text-gray-600 transition shrink-0"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                {document.location.pathname !== "/cart" && (
                  <div className="relative">
                    <button
                      onClick={() => navigate("/cart")}
                      className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                      aria-label="Cart"
                    >
                      <ShoppingCart size={18} />
                    </button>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                )}

                <button
                  ref={menuButtonRef}
                  onClick={() => setMenuOpen((s) => !s)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                  aria-label="Menu"
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Backdrop: subtle blur + light overlay when open */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${menuOpen ? "backdrop-blur-sm bg-black/10 pointer-events-auto opacity-100" : "bg-transparent pointer-events-none opacity-0"}`}
        // aria-hidden={!menuOpen}
      />

      {/* Drawer */}
      <aside
        ref={menuRef}
        className={`fixed top-0 right-0 h-full z-50 w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        // aria-hidden={!menuOpen}
      >
        <nav className="h-full flex flex-col px-4 sm:px-6 pb-4">
          <div className="h-14 sm:h-16 flex items-center justify-between mb-4">
            <div className="flex items-end gap-1">
              <div className="text-lg font-bold text-gray-900">Lux</div>
              <div className="text-xs text-gray-500">By Stylish</div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 mr-1 rounded hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
              <Search size={16} className="text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products"
                className="bg-transparent outline-none text-sm w-full text-gray-700"
              />
              <button
                type="submit"
                className="text-sm text-amber-800 font-semibold cursor-pointer hover:underline"
              >
                Search
              </button>
            </div>
          </form>

          <ul className="flex-1 flex flex-col gap-2">
            <li>
              <button
                onClick={() => handleNavigate("/")}
                className="w-full text-left px-3 py-3 rounded hover:bg-gray-50 transition flex items-center gap-3"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate("/products")}
                className="w-full text-left px-3 py-3 rounded hover:bg-gray-50 transition flex items-center gap-3"
              >
                All Products
              </button>
            </li>
            {document.location.pathname !== "/cart" && (
              <li>
                <button
                  onClick={() => handleNavigate("/cart")}
                  className="w-full text-left px-3 py-3 rounded hover:bg-gray-50 transition flex items-center gap-1"
                >
                  Cart
                  {cartItemCount > 0 && (
                    <span className="text-xs w-5 h-5 bg-amber-800 text-white rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </li>
            )}
            {document.location.pathname !== "/checkout" && (
              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/checkout");
                  }}
                  className="w-full text-left px-3 py-3 rounded hover:bg-gray-50 transition flex items-center gap-3"
                >
                  Checkout
                </button>
              </li>
            )}
          </ul>

          <div className="mt-auto">
            {/* <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/products");
              }}
              className="w-full mb-2 px-4 py-3 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition"
            >
              Shop Now
            </button> */}

            {isAuthenticated ? (
              <>
                {user?.isAdmin && (
                  <button
                    onClick={handleDashboard}
                    className="w-full mb-2 px-4 py-3 text-black rounded-lg font-semibold hover:bg-slate-200 border-2 border-slate-200 transition"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full mb-2 px-4 py-3 text-black rounded-lg font-semibold hover:bg-slate-200 border-2 border-slate-200 transition"
                >
                  Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full mb-5 px-4 py-3 text-red-500 rounded-lg font-semibold hover:bg-slate-200 border-2 border-red-500 transition"
                >
                  Delete Account
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/auth");
                }}
                className="w-full mb-5 px-4 py-3 text-black rounded-lg font-semibold hover:bg-slate-200 border-2 border-slate-200 transition"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}

export default SharedHeader;
