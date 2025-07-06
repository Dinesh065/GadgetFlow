import { useState } from "react";
import dayjs from "dayjs";

const MyRentals = () => {
  const [activeTab, setActiveTab] = useState("inProgress");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const today = dayjs();

  const rentals = {
    inProgress: [
      {
        id: 1,
        name: "Canon EOS 1500D",
        category: "Camera",
        startDate: "2025-06-01",
        returnDate: "2025-06-15",
        status: "in_use",
      },
      {
        id: 2,
        name: "Sony PS5",
        category: "Gaming",
        startDate: "2025-05-20",
        returnDate: "2025-06-01",
        status: "overdue",
        overdueDays: 10,
        overdueCharge: 1000,
      },
    ],
    returned: [
      {
        id: 3,
        name: "DJI Mini Drone",
        category: "Drone",
        startDate: "2025-04-01",
        returnDate: "2025-04-10",
        returnedOn: "2025-04-09",
      },
    ],
  };

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

    return (
      <div
        key={item.id}
        className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition"
      >
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
              <p className="text-sm text-red-600">
                Overdue by {item.overdueDays} day{item.overdueDays > 1 ? "s" : ""}
              </p>
              <p className="text-sm text-red-700">Charge: ₹{item.overdueCharge}</p>
            </>
          )}

          {type === "returned" && (
            <p className="text-sm text-green-600">
              Returned On: {dayjs(item.returnedOn).format("MMM DD, YYYY")}
            </p>
          )}
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0">
          <button className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-600 hover:text-white transition text-sm">
            View Details
          </button>

          {type === "inProgress" && item.status === "in_use" && (
            <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition text-sm">
              Return
            </button>
          )}

          {type === "inProgress" && item.status === "overdue" && (
            <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition text-sm">
              Pay & Return
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pt-20 px-4">
      <h1 className="text-2xl font-bold mb-4">My Rentals</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300 pb-2">
        <button
          onClick={() => setActiveTab("inProgress")}
          className={`capitalize px-4 py-2 rounded-t-md font-medium ${
            activeTab === "inProgress"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setActiveTab("returned")}
          className={`capitalize px-4 py-2 rounded-t-md font-medium ${
            activeTab === "returned"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Successfully Rented
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
