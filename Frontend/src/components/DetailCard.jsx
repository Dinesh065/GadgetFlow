import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";

const DetailCard = ({ gadget = {}, onClose }) => {
  if (!gadget || Object.keys(gadget).length === 0) return null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // simulate loading delay or until all images load
    const img = new Image();
    img.src = gadget.images?.[currentImageIndex];
    img.onload = () => setIsLoading(false);
  }, [currentImageIndex, gadget.images]);

  const handleNext = () => {
    if (gadget.images?.length > 1) {
      setIsLoading(true);
      setCurrentImageIndex((prev) => (prev + 1) % gadget.images.length);
    }
  };

  const handlePrev = () => {
    if (gadget.images?.length > 1) {
      setIsLoading(true);
      setCurrentImageIndex((prev) => (prev - 1 + gadget.images.length) % gadget.images.length);
    }
  };

  const handleThumbnailClick = (index) => {
    setIsLoading(true);
    setCurrentImageIndex(index);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[90vw] h-[80vh] flex flex-col gap-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <FaTimes size={20} />
        </button>

        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Left: Image Gallery */}
          <div className="w-1/2 flex flex-col items-center gap-4">
            <div className="relative w-full h-[60%] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden transition-all duration-500">
              {isLoading ? (
                <div className="animate-pulse bg-gray-300 w-full h-full rounded-lg" />
              ) : (
                <>
                  <img
                    src={gadget.images[currentImageIndex]}
                    alt={gadget.name}
                    className="w-full h-full object-cover rounded-xl border-4 border-gray-500 shadow-lg transition-opacity duration-500"
                  />
                  {gadget.images.length > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-200 transition"
                        onClick={handlePrev}
                      >
                        <FaChevronLeft size={24} />
                      </button>
                      <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-200 transition"
                        onClick={handleNext}
                      >
                        <FaChevronRight size={24} />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto mt-2 w-full justify-center">
              {gadget.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`w-20 h-20 object-cover rounded-lg border-4 cursor-pointer transition-transform duration-300 ${idx === currentImageIndex
                    ? "border-gray-500 scale-110 ring-2 ring-gray-300"
                    : "border-gray-300 hover:scale-105"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Right: Details */}
          {/* Right: Details */}
          <div className="w-1/2 overflow-y-auto pr-2">
            <h2 className="text-3xl font-semibold mb-2">{gadget.name || "No Name"}</h2>
            <p className="text-gray-600 mb-4">{gadget.description || "No description available."}</p>
            <p className="text-xl font-bold text-orange-600 mb-4">
              ₹ {gadget.price ? gadget.price + "/day" : "N/A"}
            </p>

            <div className="space-y-3 text-gray-700 text-sm">
              <p><strong>Due Date:</strong> {gadget.dueDate || "N/A"}</p>
              {/* Days for Rent */}
              <p><strong>Days for Rent:</strong> {gadget.days_for_rent || "N/A"}</p>

              {/* Delivery Options */}
              <p>
                <strong>Delivery Option:</strong>{" "}
                {gadget.deliveryOptions?.delivery
                  ? "Pickup & Delivery"
                  : "Pickup Only"}
              </p>

              {/* Show delivery cost only if delivery is true */}
              {gadget.deliveryOptions?.delivery && (
                <p><strong>Delivery Cost:</strong> ₹ {gadget.deliveryOptions.deliveryCost || "N/A"}</p>
              )}

              <p><strong>Category:</strong> {gadget.category || "N/A"}</p>
              <p><strong>Location:</strong> {gadget.location || "N/A"}</p>
              <p><strong>Availability:</strong> {gadget.availability === "Available" ? "Available" : "Rented"}</p>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
};

export default DetailCard;
