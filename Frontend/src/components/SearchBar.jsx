import React, { useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = () => {
    alert(`Searching for: ${query} in ${category}`);
  };

  const handleClear = () => setQuery("");

  return (
    <div className="flex justify-center items-center gap-4 mt-5 mx-auto flex-wrap">
      {/* Search Bar */}
      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white max-w-[400px] flex-1">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 text-base border-none outline-none"
        />
        {query && (
          <button
            className="bg-transparent border-none text-gray-400 cursor-pointer px-2 font-medium"
            onClick={handleClear}
          >
            ✖
          </button>
        )}
        <button
          className="bg-blue-600 text-white border-none px-4 py-2 cursor-pointer rounded-r-full transition duration-300 ease-in-out hover:bg-blue-800"
          onClick={handleSearch}
        >
          🔍 Search
        </button>
      </div>

      {/* Filter Dropdown */}
      <select
        className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm cursor-pointer outline-none"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">All</option>
        <option value="laptops">Laptops</option>
        <option value="phones">Phones</option>
        <option value="cameras">Cameras</option>
        <option value="gaming">Gaming Consoles</option>
      </select>
    </div>
  );
};

export default SearchBar;
