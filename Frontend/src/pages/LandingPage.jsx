import { Button } from "../components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Search,
  FileText,
  Zap,
  Star,
  Laptop,
  Camera,
  Gamepad2,
  Smartphone,
  DollarSign,
  Shield,
  Truck,
  RotateCcw,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import Categories from "../components/Categories";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function GadgetRentalLanding() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const zoomIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      >
        <div className="landingcontainer flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-green-800">GadgetFlow</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#categories" className="text-sm font-medium hover:text-green-600 transition-colors">
              Categories
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-green-600 transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-green-600 transition-colors">
              Reviews
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-green-600 transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/login")}
              variant="ghost"
              className="hidden md:inline-flex text-green-700 hover:text-green-800"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              className="bg-green-600 hover:bg-green-700"
            >
              Get Started
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 py-2 space-y-2 bg-white border-b shadow-sm">
            <a href="#categories" className="block text-sm font-medium text-gray-700 hover:text-green-600">
              Categories
            </a>
            <a href="#how-it-works" className="block text-sm font-medium text-gray-700 hover:text-green-600">
              How It Works
            </a>
            <a href="#testimonials" className="block text-sm font-medium text-gray-700 hover:text-green-600">
              Reviews
            </a>
            <a href="#contact" className="block text-sm font-medium text-gray-700 hover:text-green-600">
              Contact
            </a>
            <Button
              onClick={() => {
                navigate("/login");
                setIsMobileMenuOpen(false);
              }}
              variant="ghost"
              className="w-full text-green-700 hover:text-green-800"
            >
              Sign In
            </Button>
          </div>
        )}

      </motion.header>

      {/* Continue with rest of the JSX (Hero Section, How it Works, Categories, etc.) */}
      {/* Ensure all <Image> components are converted to <img> with src pointing to public folder if applicable */}
      {/* Replace all <Link href=...> with <a href=...> */}
      <HeroSection />
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <Categories />
      <WhyChooseUs />
      <Testimonials />
      <div id="contact">
        <ContactUs />
      </div>
      <Footer />
    </div>
  );
}
