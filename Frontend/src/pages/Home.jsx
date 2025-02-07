import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Placeholder logo URL - replace with your own logo URL later
const logoUrl = "https://via.placeholder.com/150?text=GadgetFlow";

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white min-h-screen flex flex-col justify-center items-center">
      
      {/* Logo */}
      <motion.div
        className="absolute top-4 left-4 p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src={logoUrl} alt="GadgetFlow Logo" className="h-12 w-auto" />
      </motion.div>

      {/* Header Section */}
      <motion.div
        className="text-center pt-20 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold leading-tight mb-4">
          Rent Gadgets. Simplified.
        </h1>
        <p className="text-lg mb-6">
          Access the latest electronics on-demand, rent gadgets with ease, and enjoy the freedom of smart rentals.
        </p>
        
        {/* Interactive Role Selection */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <Link
            to="/login"
            className="px-8 py-3 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 bg-green-500 text-black rounded-lg shadow-lg hover:bg-green-400 transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        className="relative w-full h-96"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <img
          src="https://via.placeholder.com/1500x800/0000FF/808080?text=Smart+Rentals"
          alt="Gadgets"
          className="object-cover w-full h-full opacity-70 rounded-xl"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      </motion.div>

      {/* Feature Section */}
      <motion.div
        className="w-full py-20 bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-yellow-500 mb-10">
            Why Choose Our Smart Rental System?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg hover:scale-105 transform transition-all"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Wide Selection</h3>
              <p className="text-gray-600">
                Rent laptops, cameras, gaming consoles, and more! All the latest gadgets at your fingertips.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg hover:scale-105 transform transition-all"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Affordable Pricing</h3>
              <p className="text-gray-600">
                Rent gadgets for as long as you need with no hidden fees. Transparent pricing you can trust.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg hover:scale-105 transform transition-all"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast & Secure</h3>
              <p className="text-gray-600">
                Quick delivery, safe transactions, and guaranteed returns. Rent with confidence!
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features for Renters and Sellers */}
      <motion.div
        className="w-full py-20 bg-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-yellow-500 mb-10">
            Features for Renters and Sellers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg hover:scale-105 transform transition-all"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">For Renters</h3>
              <p className="text-gray-600">
                Rent laptops, cameras, gaming consoles, and more. Flexible pricing, instant availability, and secure transactions.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg hover:scale-105 transform transition-all"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">For Sellers</h3>
              <p className="text-gray-600">
                Manage your rental inventory, track requests, and earn money. You control the gadgets you want to list for rent.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Call-to-Action Section */}
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
      >
        <h2 className="text-4xl font-semibold mb-6">
          Ready to Rent Your Next Gadget?
        </h2>
        <p className="text-lg mb-6">
          Browse our vast collection, choose your gadget, and start renting today. Your next gadget is just a click away.
        </p>
        <Link
          to="/categories"
          className="px-12 py-4 bg-yellow-500 text-black rounded-lg shadow-xl hover:bg-yellow-400 transition-all duration-300"
        >
          Start Renting Now
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
