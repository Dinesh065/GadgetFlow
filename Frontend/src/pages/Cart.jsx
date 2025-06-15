import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const handleProceedToBuy = () => {
    navigate('/checkout');
  };

  // Sample product data with unique IDs
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Concept Kart KZ EDX Pro IEM Earphone",
      description: "HiFi Stereo Special Dual Magnetic Circuit...",
      price: 1139,
      originalPrice: 1999,
      discount: 43,
      image: "../src/assets/ps5.jpg", // Fixed image path
      quantity: 1,
    },
    {
      id: 2,
      name: "Another Product",
      description: "Another product description...",
      price: 1500,
      originalPrice: 2500,
      discount: 40,
      image: "../src/assets/ps5.jpg",
      quantity: 1,
    },
  ]);

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart(cart.map(item => 
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  // Remove item
  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-100 p-6 md:p-12 min-h-screen">
      <div className="mt-20 max-w-6xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>

        {cart.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left - Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                  <input type="checkbox" className="w-5 h-5" />
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="text-green-600 font-bold">
                      ₹{item.price}{" "}
                      <span className="line-through text-gray-500">₹{item.originalPrice}</span>
                      <span className="text-red-600 ml-2">-{item.discount}%</span>
                    </p>
                    <div className="flex items-center mt-2">
                      <button className="px-2 py-1 border rounded-md text-lg" onClick={() => decreaseQuantity(item.id)}>
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button className="px-2 py-1 border rounded-md text-lg" onClick={() => increaseQuantity(item.id)}>
                        +
                      </button>
                      <button className="ml-4 text-red-600" onClick={() => removeItem(item.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right - Summary */}
            <div className="h-fit p-6 rounded-lg shadow-md bg-gray-100">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <p className="flex justify-between text-gray-700">
                Subtotal ({cart.length} items):{" "}
                <span className="font-bold">₹{totalPrice}</span>
              </p>
              <label className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <input type="checkbox" className="w-4 h-4" /> This order contains a gift
              </label>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700 transition" onClick={handleProceedToBuy}>
                Proceed to Buy
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
