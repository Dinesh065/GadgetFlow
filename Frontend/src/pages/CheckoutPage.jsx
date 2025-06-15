import React from 'react';
import OrderSuccessPopup from "../components/OrderSuccessPopup";
import { useState } from 'react';

const CheckoutPage = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handlePayment = () => {
    // Simulate payment process
    setTimeout(() => {
      setShowPopup(true);
    }, 500);
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Breadcrumb */}
      <p className="mt-20 text-gray-500 text-sm mb-4">Home / <span className="text-black font-medium">Checkout</span></p>

      <div className="lg:mx-48 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Review + Delivery */}
        <div className="col-span-2 space-y-8">
          {/* Review Item */}
          <div className="border border-gray-200 bg-white p-6 rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Review Item And Shipping</h2>
            <div className="flex items-center gap-6">
              <img src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-max-select-pink-202011?wid=532&hei=582&fmt=png-alpha&.v=1604021221000" alt="AirPods Max" className="w-28 h-28" />
              <div>
                <h3 className="font-bold text-lg">Airpods- Max</h3>
                <p>Color: Pink</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-bold text-lg">$549.00</p>
                <p>Quantity: 01</p>
              </div>
            </div>
          </div>

          {/* Returning Customer */}
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <label>Returning Customer?</label>
          </div>

          {/* Delivery Info */}
          <div className="border border-gray-200 bg-white p-6 rounded shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Delivery Information</h2>
              <button className="bg-gray-200 text-sm px-4 py-1 rounded">Save Information</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name*" className="border p-2 rounded" />
              <input type="text" placeholder="Last Name*" className="border p-2 rounded" />
              <input type="text" placeholder="Address*" className="col-span-2 border p-2 rounded" />
              <input type="text" placeholder="City/ Town*" className="border p-2 rounded" />
              <input type="text" placeholder="Zip Code*" className="border p-2 rounded" />
              <input type="text" placeholder="Mobile*" className="border p-2 rounded" />
              <input type="email" placeholder="Email*" className="border p-2 rounded" />
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="border border-gray-200 bg-white p-6 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {/* Coupon */}
          <div className="relative flex mb-6">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              className="border p-2 rounded-full w-full"
            />
            <button className="h-full absolute right-0 bg-green-600 text-white px-4 rounded-full">Apply coupon</button>
          </div>

          {/* Payment Options */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Payment Details</h3>
            <div className="space-y-2">
              <label className="block"><input type="radio" name="payment" /> Cash on Delivery</label>
              <label className="block"><input type="radio" name="payment" /> Shopcart Card</label>
              <label className="block"><input type="radio" name="payment" /> Paypal</label>
              <label className="block">
                <input type="radio" name="payment" defaultChecked /> Credit or Debit card
              </label>
            </div>
          </div>

          {/* Card Info */}
          <div className="h-fit space-y-4">
            {/* Cost Breakdown */}
            <div className="border-t mt-6 pt-4 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>$549.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax(10%)</span>
                <span>$54.90</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping Cost</span>
                <span>-$0.00</span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between font-semibold text-black text-base">
                <span>Total</span>
                <span>= $494.10</span>
              </div>
            </div>

            {/* Pay Button */}
            <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold text-sm" onClick={handlePayment}>
              Pay $494.10
            </button>

            <OrderSuccessPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
