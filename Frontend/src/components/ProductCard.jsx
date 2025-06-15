import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const ProductCard = (props) => {
  const navigate = useNavigate();  
  return (
    <div className="rounded-md w-full relative hover:cursor-pointer shadow-md" onClick={() => navigate(`/product/${props.id}`)} >

      <button className="absolute top-3 right-4 text-gray-400 hover:text-red-500">
        <FaHeart />
      </button>

      <img
        src={props.images[0]}
        alt={props.name}
        className="w-full h-40 object-cover mx-auto rounded-md"
      />

      <h3 className="ml-4 mt-3 text-lg font-semibold text-gray-900">{props.name}</h3>
      <p className="ml-4 text-gray-500 text-sm">{props.description}</p>
      <div className="ml-4 text-green-600 text-sm mt-2">⭐⭐⭐⭐⭐ (121)</div>
      <p className="ml-4 text-gray-900 font-bold text-lg mt-1">{props.price}</p>

      <button className="ml-4 mt-3 mb-5 bg-green-600 text-white px-4 py-2 w-half rounded-full hover:bg-green-700 transition">
        View Details
      </button>
    </div>
  );
};

export default ProductCard;
