const Banner = () => {
  return (
    <div className="z-100 relative w-5/6 h-[300px] md:h-[400px] bg-cover bg-center flex items-center md:px-12 mx-auto"
      style={{ backgroundImage: "url('src/assets/ps5.jpg')" }}>
      
      {/* Overlay */}
      <div className="absolute inset-0"></div>

      {/* Text Content */}
      <div className="relative z-10 max-w-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-green-900">
          Grab Up to 50% Off On Selected Headphones
        </h2>
        <button className="mt-4 bg-green-700 text-white px-6 py-3 rounded-full text-lg hover:bg-green-800 transition">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Banner;
