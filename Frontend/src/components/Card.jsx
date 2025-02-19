import React from "react";

const Card = (props) => {
  return (
    <div className="w-72 h-[420px] bg-white shadow-md rounded-md m-4 p-3 relative">
      <img
        src={props.image}
        alt={props.name}
        className="w-[90%] h-[180px] mx-auto rounded-md -mt-12 shadow-lg"
      />
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h4 className="text-lg font-semibold">{props.name}</h4>
            <h3 className="text-xl font-bold text-blue-600">{props.price}</h3>
          </div>
          <div>
            <a
              href="/"
              className="inline-block px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition"
            >
              View Details
            </a>
          </div>
        </div>
        <hr className="my-2" />
        <p className="text-gray-700 text-sm mb-4">{props.description}</p>
        <div className="flex">
          <button className="w-full py-2 bg-gradient-to-r from-blue-300 to-blue-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition hover:scale-105 active:scale-95">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
