import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import Lottie from 'lottie-react';
import successAnimation from "../assets/success.json";

const OrderSuccessPopup = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-100 bg-white rounded-3xl p-8 shadow-xl text-center w-96 relative overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
             {/* <Lottie animationData={successAnimation} loop={false} /> */}

            <h2 className="text-xl font-semibold mb-2">Your order has been accepted</h2>
            <p className="text-sm text-gray-600 mb-6">Transaction ID: 8984294820</p>

            <button
              onClick={onClose}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-full"
            >
              Continue Shopping
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessPopup;
