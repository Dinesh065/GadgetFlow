import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const EarningsPage = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/payment/earnings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEarnings(res.data);
      } catch (err) {
        console.error("Failed to fetch earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  return (
    <div className="pt-20">
      <div className="p-6 max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
          My Earnings
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading earnings...</p>
        ) : earnings.length === 0 ? (
          <p className="text-center text-gray-500">No earnings yet.</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Item Name</th>
                <th className="p-3 border">Amount (₹)</th>
                <th className="p-3 border">Buyer</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((entry) => (
                <tr key={entry._id} className="text-center text-sm">
                  <td className="p-3 border">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="p-3 border">{entry.itemName}</td>
                  <td className="p-3 border">{entry.amount}</td>
                  <td className="p-3 border">{entry.buyerName}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${entry.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../config";

// const EarningsPage = () => {
//   const [earnings, setEarnings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEarnings = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${API_BASE_URL}/payment/earnings`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setEarnings(res.data);
//       } catch (err) {
//         console.error("Failed to fetch earnings:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEarnings();
//   }, []);

//   const handleDownloadInvoice = async (paymentId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${API_BASE_URL}/payment/invoice/${paymentId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: 'blob', // Important to handle PDF
//       });

//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `invoice-${paymentId}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Error downloading invoice:", error);
//       alert("Failed to download invoice.");
//     }
//   };

//   return (
//     <div className="pt-20">
//       <div className="p-6 max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-xl">
//         <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
//           My Earnings
//         </h2>

//         {loading ? (
//           <p className="text-center text-gray-600">Loading earnings...</p>
//         ) : earnings.length === 0 ? (
//           <p className="text-center text-gray-500">No earnings yet.</p>
//         ) : (
//           <table className="w-full border border-gray-300">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 border">Date</th>
//                 <th className="p-3 border">Item Name</th>
//                 <th className="p-3 border">Amount (₹)</th>
//                 <th className="p-3 border">Buyer</th>
//                 <th className="p-3 border">Status</th>
//                 <th className="p-3 border">Invoice</th>
//               </tr>
//             </thead>
//             <tbody>
//               {earnings.map((entry) => (
//                 <tr key={entry._id} className="text-center text-sm">
//                   <td className="p-3 border">{new Date(entry.date).toLocaleDateString()}</td>
//                   <td className="p-3 border">{entry.itemName}</td>
//                   <td className="p-3 border">{entry.amount}</td>
//                   <td className="p-3 border">{entry.buyerName}</td>
//                   <td className="p-3 border">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-semibold ${entry.status === "Paid"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-yellow-100 text-yellow-700"
//                         }`}
//                     >
//                       {entry.status}
//                     </span>
//                   </td>
//                   <td className="p-3 border">
//                     <button
//                       className="text-blue-600 hover:underline"
//                       onClick={() => handleDownloadInvoice(entry._id)}
//                     >
//                       View Invoice
//                     </button>
//                   </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EarningsPage;
