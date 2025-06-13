import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import SellerAddItemForm from "../pages/SellerAddNewItemForm";
import axios from "axios";
import { API_BASE_URL } from "../config";

const categories = ["All", "Electronics", "Vehicles", "Furniture", "Books", "Others"];
const availabilityOptions = ["All", "Available", "Rented"];
const sortOptions = ["Newest", "Oldest", "Price High–Low", "Price Low–High"];

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    availability: "All",
    sort: "Newest", // default
  });
  const [pendingFilters, setPendingFilters] = useState({ ...filters });

  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/items/getItemsForML`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = response.data.items;
      setListings(items);
      setFilteredListings(items); // ✅ show all initially
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch seller items:", error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setPendingFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setFilters({ ...pendingFilters }); // this triggers filtering effect
  };

  useEffect(() => {
    let filtered = [...listings];

    if (filters.category !== "All") {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.availability !== "All") {
      filtered = filtered.filter(item => item.status === filters.availability);
    }

    switch (filters.sort) {
      case "Newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "Oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "Price High–Low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "Price Low–High":
        filtered.sort((a, b) => a.price - b.price);
        break;
    }

    setFilteredListings(filtered);
  }, [filters, listings]);

  const handleEditSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API_BASE_URL}/items/${editingItem._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update UI
      setListings(prev =>
        prev.map(item => item._id === editingItem._id ? res.data.updatedItem : item)
      );

      setEditingItem(null); // Close the edit form
    } catch (error) {
      console.error("Edit failed", error);
    }
  };

  // 1. Modify toggleAvailability() to update on backend too
  const toggleAvailability = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "Available" ? "Rented" : "Available";

      const response = await axios.patch(
        `${API_BASE_URL}/items/${id}/status`,
        { availability: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // setListings((prev) =>
      //   prev.map((item) =>
      //     item._id === id ? { ...item, availability: response.data.status } : item
      //   )
      // );
      await fetchItems();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  // 2. Modify handleDeleteItem to delete from backend
  const handleDeleteItem = async (id) => {
    const confirmDelete = window.confirm("Delete this item?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setListings((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // 3. Modify handleDeleteSelected to delete multiple items from backend
  const handleDeleteSelected = async () => {
    const confirmDelete = window.confirm("Delete selected items?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/items/delete-multiple`,
        { ids: selectedItems },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setListings((prev) => prev.filter((item) => !selectedItems.includes(item._id)));
      setSelectedItems([]);
      setSelectMode(false);
    } catch (error) {
      console.error("Batch delete failed", error);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(itemId => itemId !== id); // remove
      } else {
        return [...prevSelected, id]; // add
      }
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Listings</h1>

      <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4 flex flex-wrap justify-center gap-4 mb-6">
        <div className="relative w-48">
          <select
            name="availability"
            value={pendingFilters.availability}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md shadow-sm appearance-none bg-white text-gray-700 focus:outline-none"
          >
            <option value="All" disabled hidden>Availability</option>
            {availabilityOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <span className="absolute top-3 right-3 pointer-events-none text-gray-400">▼</span>
        </div>

        <div className="relative w-48">
          <select
            name="category"
            value={pendingFilters.category}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md shadow-sm appearance-none bg-white text-gray-700 focus:outline-none"
          >
            <option value="All" disabled hidden>Category</option>
            {categories.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <span className="absolute top-3 right-3 pointer-events-none text-gray-400">▼</span>
        </div>

        <div className="relative w-48">
          <select
            name="sort"
            value={pendingFilters.sort}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md shadow-sm appearance-none bg-white text-gray-700 focus:outline-none"
          >
            <option value="All" disabled hidden>Sort by</option>
            {sortOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <span className="absolute top-3 right-3 pointer-events-none text-gray-400">▼</span>
        </div>

        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-yellow-400 rounded-md hover:bg-yellow-500 transition font-semibold"
        >
          Apply Filters
        </button>

        <button
          onClick={() => setSelectMode(!selectMode)}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition font-semibold"
        >
          {selectMode ? "Cancel" : "Select"}
        </button>
      </div>

      {selectedItems.length > 0 && (
        <div className="text-center mb-4">
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete Selected ({selectedItems.length})
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse border p-4 rounded-md shadow-sm bg-white">
              <div className="h-40 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(item => (
            <div
              key={item._id}
              className={`border p-4 rounded-md shadow-sm relative bg-white ${selectedItems.includes(item._id) ? "ring-2 ring-blue-400" : ""}`}
            >
              {selectMode && (
                <input
                  type="checkbox"
                  className="absolute top-2 left-2"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleCheckboxChange(item._id)}
                />
              )}
              <img src={item.images?.[0]} alt={item.name} className="h-40 w-full object-cover rounded mb-2" />
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.category} • ₹{item.price}</p>
              <p className="text-sm text-gray-500 mb-2">Due Date: {new Date(item.dueDate).toLocaleDateString()}</p>
              <button
                onClick={() => toggleAvailability(item._id, item.status)}
                className="text-xs text-blue-600 underline mb-2"
              >
                Mark as {item.status === "Available" ? "Rented" : "Available"}
              </button>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FiTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>)}

      {editingItem && (
        <div className="mt-12 pt-12">
          <SellerAddItemForm
            itemData={editingItem}
            onSubmit={handleEditSubmit}
            onClose={() => setEditingItem(null)}
          // onSubmit={(updatedItem) => {
          //   setListings(prev =>
          //     prev.map(item => item._id === updatedItem._id ? updatedItem : item)
          //   );
          //   setEditingItem(null);
          // }}
          />
        </div>
      )}
    </div>
  );
};

export default ManageListings;
