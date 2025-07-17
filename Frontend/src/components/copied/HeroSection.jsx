import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Shield, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="landingcontainer px-4 md:px-6 grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        <motion.div initial="initial" animate="animate" className="space-y-8">
          <motion.div variants={fadeInUp}>
            <Badge className="bg-green-100 text-green-800">🎯 Premium Electronics Available</Badge>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl font-bold tracking-tight">
            Rent Smart. <span className="text-green-600">Save More.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-[600px]">
            Explore premium electronics at affordable rental prices.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex gap-4">
            <Button className="bg-green-600 hover:bg-green-700">Browse Rentals</Button>
            <Button variant="outline" className="border-green-600 text-green-600">Learn More</Button>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2"><Shield className="h-4 w-4 text-green-500" /><span>Verified</span></div>
            <div className="flex items-center space-x-2"><Truck className="h-4 w-4 text-green-500" /><span>Free Delivery</span></div>
            <div className="flex items-center space-x-2"><RotateCcw className="h-4 w-4 text-green-500" /><span>Easy Returns</span></div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-3xl opacity-20 " />
          <img
            src="/images/heroimg.jpg" // Replace with actual image path
            alt="Hero Image"
            width="800"
            height="600"
            className="relative rounded-2xl shadow-2xl"
            />

        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
