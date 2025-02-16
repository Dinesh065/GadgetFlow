import React, { useState } from "react";
import "./SearchBar.css"; // Import CSS file

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = () => {
    alert(`Searching for: ${query} in ${category}`);
  };

  const handleClear = () => setQuery("");

  return (
    <div className="search-wrapper">
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        {query && <button className="clear-btn" onClick={handleClear}>✖</button>}
        <button className="search-btn" onClick={handleSearch}>🔍 Search</button>
      </div>

      {/* Filter Dropdown */}
      <select
        className="category-filter"
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
