import React, { useEffect } from "react";
import Products from "./components/Products";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Product from "./pages/Product";
import SharedHeader from "./components/SharedHeader";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./stores/authStore";
import ForgotPassword from "./pages/ForgotPassword";
import supabase from "./utils/supabase";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const ProtectedRoute = ({ children }) => {
  const isAdmin = useAuthStore((s) => s.isAdmin);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You must be an Admin to access this page.
          </p>
          <Link
            to="/auth"
            className="px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

const SecuredDashboard = () => {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        useAuthStore.setState({
          user: session.user,
          isAuthenticated: true,
          isAdmin: session.user?.app_metadata?.role === "admin",
        });
      } else if (event === "SIGNED_OUT") {
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="w-full min-h-screen relative mx-auto bg-white">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/products"
          element={
            <>
              <SharedHeader />
              <Products title="All Products" margin="mt-20" />
            </>
          }
        />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<SecuredDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
