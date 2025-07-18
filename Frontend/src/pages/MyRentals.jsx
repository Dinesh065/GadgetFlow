import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../config";

const MyRentals = () => {
  const [activeTab, setActiveTab] = useState("inProgress");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [rentals, setRentals] = useState({ inProgress: [], returned: [] });
  const [loading, setLoading] = useState(true);
  const [confirmingReturn, setConfirmingReturn] = useState(null);
  const [confirmingOverdue, setConfirmingOverdue] = useState(null);

  const today = dayjs();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/rentals/getAllRentals`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if token is stored differently
          },
        });
        setRentals(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch rentals.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const applyFilters = (items, type) => {
    let filtered = [...items];

    if (type === "inProgress") {
      if (filter === "in_use") filtered = filtered.filter((i) => i.status === "in_use");
      if (filter === "overdue") filtered = filtered.filter((i) => i.status === "overdue");
      if (categoryFilter !== "all") filtered = filtered.filter((i) => i.category === categoryFilter);
    }

    filtered.sort((a, b) => {
      const dateA = dayjs(type === "returned" ? a.returnedOn : a.startDate);
      const dateB = dayjs(type === "returned" ? b.returnedOn : b.startDate);
      return sortOrder === "newest" ? dateB.diff(dateA) : dateA.diff(dateB);
    });

    return filtered;
  };

  const renderCard = (item, type) => {
    const daysRemaining = dayjs(item.returnDate).diff(today, "day");

    const handleReturnRequest = async (itemId) => {
      try {
        await axios.post(`${API_BASE_URL}/rentals/requestReturn`, { itemId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Return request sent to seller.");
        setConfirmingReturn(null);
        setRentals(prev => ({
          ...prev,
          inProgress: prev.inProgress.map(i => i.id === itemId ? { ...i, status: "waiting_ack" } : i)
        }));
      } catch (err) {
        toast.error("Failed to send return request.");
      }
    };

    const handleOverdueRequest = async (itemId) => {
      try {
        await axios.post(`${API_BASE_URL}/rental/requestOverdueReturn`, { itemId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Overdue return request sent to seller.");
        setConfirmingOverdue(null);
        setRentals(prev => ({
          ...prev,
          inProgress: prev.inProgress.map(i => i.id === itemId ? { ...i, status: "waiting_ack" } : i)
        }));
      } catch (err) {
        toast.error("Failed to send overdue request.");
      }
    };

    return (
      <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-m text-gray-600">Category: {item.category}</p>
          <p className="text-m text-gray-600">Rental Start: {dayjs(item.startDate).format("MMM DD, YYYY")}</p>
          <p className="text-m text-gray-600">Return Date: {dayjs(item.returnDate).format("MMM DD, YYYY")}</p>

          {type === "inProgress" && item.status === "in_use" && (
            <p className="text-sm text-yellow-600">
              {daysRemaining} day{daysRemaining !== 1 && "s"} remaining to return
            </p>
          )}

          {type === "inProgress" && item.status === "overdue" && (
            <>
              <p className="text-sm text-red-600">Overdue by {item.overdueDays} day{item.overdueDays > 1 ? "s" : ""}</p>
              <p className="text-sm text-red-700">Charge: ₹{item.overdueCharge}</p>
            </>
          )}

          {item.status === "waiting_ack" && (
            <p className="text-sm text-blue-500 mt-2">Waiting for seller acknowledgement...</p>
          )}

          {type === "returned" && (
            <p className="text-sm text-green-600">
              Returned On: {dayjs(item.returnedOn).format("MMM DD, YYYY")}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
          <button
            className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-600 hover:text-white transition text-sm"
            onClick={() => window.location.href = `/product/${item.id}`}
          >
            View Details
          </button>
          {type === "inProgress" && item.status === "in_use" && (
            confirmingReturn === item.id ? (
              <div className="border border-green-400 bg-green-50 p-3 rounded-md text-sm w-full sm:w-auto">
                <p className="text-gray-700 mb-2">Have you returned this item?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReturnRequest(item.id)}
                    className="bg-green-700 text-white px-4 py-1 rounded hover:bg-green-800"
                  >
                    Yes, Confirm
                  </button>
                  <button
                    onClick={() => setConfirmingReturn(null)}
                    className="text-gray-600 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingReturn(item.id)}
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition text-sm"
              >
                Return
              </button>
            )
          )}

          {type === "inProgress" && item.status === "overdue" && (
            confirmingOverdue === item.id ? (
              <div className="border border-red-400 bg-red-50 p-3 rounded-md text-sm w-full sm:w-auto">
                <p className="text-red-700 mb-2">Confirm only if item is returned. Overdue charges apply.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOverdueRequest(item.id)}
                    className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-800"
                  >
                    Yes, Confirm
                  </button>
                  <button
                    onClick={() => setConfirmingOverdue(null)}
                    className="text-gray-600 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingOverdue(item.id)}
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition text-sm"
              >
                Pay & Return
              </button>
            )
          )}

        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pt-28 px-4">
      <h1 className="text-2xl font-bold mb-4">My Rentals</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300 pb-2">
        <button
          onClick={() => setActiveTab("inProgress")}
          className={`capitalize px-4 py-2 rounded-t-md font-medium ${activeTab === "inProgress"
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setActiveTab("returned")}
          className={`capitalize px-4 py-2 rounded-t-md font-medium ${activeTab === "returned"
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Successfully Returned
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <label className="text-sm font-medium mr-2">Sort by:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {activeTab === "inProgress" && (
          <>
            <div>
              <label className="text-sm font-medium mr-2">Show:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="in_use">In Process</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mr-2">Category:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="Camera">Camera</option>
                <option value="Gaming">Gaming</option>
                <option value="Drone">Drone</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {applyFilters(rentals[activeTab], activeTab).length > 0 ? (
          applyFilters(rentals[activeTab], activeTab).map((item) =>
            renderCard(item, activeTab)
          )
        ) : (
          <p className="text-gray-600">No rentals found.</p>
        )}
      </div>
    </div>
  );
};

export default MyRentals;
