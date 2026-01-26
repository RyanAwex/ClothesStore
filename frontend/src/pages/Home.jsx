import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Products from "../components/Products";
import Testimonials from "../components/Testimonials";
import SharedHeader from "../components/SharedHeader";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SharedHeader />
      <Hero />
      <Products title="Our Latest Products" limit={8} />
      <div className="flex justify-center lg:mt-6">
        <Link
          to="/products"
          className="text-md text-gray-900 flex items-center gap-1 hover:underline group"
        >
          View All Products
          <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <Testimonials />

      <Footer />
    </div>
  );
}

export default Home;
