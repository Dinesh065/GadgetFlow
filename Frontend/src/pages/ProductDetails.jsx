import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaStar,
  FaShoppingCart,
  FaCalendarAlt,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams(); // item ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasRequested, setHasRequested] = useState(false);

  const hardcodedReviews = [
    { user: "Alice", rating: 5, comment: "Amazing product and excellent condition!" },
    { user: "Bob", rating: 4, comment: "Fast delivery and very helpful seller." },
    { user: "Charlie", rating: 4, comment: "Worked like new. Will rent again!" },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/buyers/${id}`);
        const item = res.data;
        setProduct(item);
        if (item.images?.length) setSelectedImage(item.images[0]);

        const token = localStorage.getItem("token");
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          const userId = decoded.id;

          const alreadyRequested = item.requests?.some(
            (req) => req.buyerId?._id === userId
          );

          if (alreadyRequested) {
            setHasRequested(true);
            toast("You have already requested this item.", { icon: "⚠️" });
          }
        }
      } catch (err) {
        toast.error("Failed to fetch product details.");
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleProceedToBuy = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/v1/buyers/${id}/request`,
        { message: "Interested in renting this item!" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Request sent successfully!");
      setHasRequested(true); // disable button after successful request
    } catch (err) {
      if (
        err.response?.data?.message?.toLowerCase().includes("already requested")
      ) {
        toast.error("You've already requested this item.");
        setHasRequested(true);
      } else {
        toast.error("Failed to send request. Please try again.");
      }
    }
  };

  const handleAddWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/v1/buyers/addToWishlist/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Item added to wishlist!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Could not add to wishlist."
      );
    }
  };

  if (!product) return <p className="text-center mt-10">Loading product details...</p>;

  const seller = product.ownerId;

  return (
    <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="mt-20 flex flex-col items-center">
        <img
          src={selectedImage}
          alt={product.name}
          className="w-full object-cover rounded-2xl"
        />

        <div className="flex gap-4 mt-4">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Product variant"
              className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img ? "border-green-600" : "border-transparent"
                }`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-20">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <h3 className="text-xl mt-2 font-m">Category: {product.category}</h3>
        <p className="text-gray-500 mt-2">{product.description}</p>
        <div className="text-gray-500 mt-2">
          Delivery Option:
          {product.deliveryOptions?.pickup && <span> Pickup</span>}
          {product.deliveryOptions?.delivery && (
            <span>
              {product.deliveryOptions.pickup ? " &" : ""} Delivery (₹
              {product.deliveryOptions.deliveryCost})
            </span>
          )}
        </div>

        <div className="flex items-center mt-4">
          <FaCalendarAlt className="text-gray-600 mr-2" />
          <p className="text-gray-500">Days: {product.days_for_rent}</p>
        </div>

        <div className="text-2xl font-semibold my-4">
          ₹{product.price} <span className="text-base text-gray-600">/day</span>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            className={`px-6 py-3 rounded-full text-white ${hasRequested ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 transition"}`}
            onClick={handleProceedToBuy}
            disabled={hasRequested}
          >
            {hasRequested ? "Request Sent" : "Send Request"}
          </button>

          <button
            onClick={handleAddWishlist}
            className="border border-green-600 text-green-600 px-6 py-3 rounded-full hover:bg-green-600 hover:text-white transition">
            Add to Wishlist
          </button>
        </div>
      </div>

      {/* Seller Information */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Seller Information</h3>
        <div className="border p-4 rounded-lg mt-2">
          <div className="flex items-center">
            {seller && typeof seller === "object" ? (
              <img
                src={seller.profileImage}
                alt="Seller"
                className="w-14 h-14 rounded-full border mr-3"
              />
            ) : (
              <div className="w-14 h-14 rounded-full border mr-3 bg-gray-200" />
            )}

            {seller && typeof seller === "object" ? (
              <div>
                <h3 className="text-lg font-semibold">
                  {seller.fullName}
                  {seller.isVerified && <FaCheckCircle className="text-blue-500 inline ml-1" />}
                </h3>
                <p className="text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> {product.location}
                </p>
                <p className="text-yellow-500 flex items-center">
                  <FaStar className="mr-1" /> Seller Rating: {seller.rating || "N/A"}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Seller details not available.</p>
            )}

          </div>

          {seller && typeof seller === "object" && (
            <div className="mt-2 text-sm text-gray-700">
              <p><strong>Email:</strong> {seller.email}</p>
              <p><strong>Contact Number:</strong> {seller.contactNumber || "N/A"}</p>
              <p><strong>Joined:</strong> {new Date(seller.createdAt).toLocaleDateString()}</p>
              <p className="mt-2 text-gray-600">{seller.bio || "No bio available."}</p>
            </div>
          )}

        </div>
      </div>
      {/* Reviews */}
      <div className="mt-4 pt-4">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        {product.requests?.length ? (
          product.requests.map((req, idx) => (
            <div key={idx} className="border p-2 rounded-md mt-2">
              <p>
                <strong>{req.buyerId.fullName}</strong> ⭐ {req.rating || 'N/A'}/5
              </p>
              <p className="text-gray-600">{req.comment || req.message}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No reviews yet. Be the first to request!</p>
        )}
      </div>


    </div>
  );
};

export default ProductDetails;
