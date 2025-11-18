// LeaveHistory component: shows all previous leave requests.
// User can cancel only pending leaves.

import { useEffect, useState } from "react";
import { getLeaveHistory, cancelLeave } from "../services/leaveService";

function LeaveHistory() {
  const [history, setHistory] = useState([]);

  // load all leaves from local storage/service
  const loadHistory = () => {
    getLeaveHistory().then((data) => setHistory([...data]));
  };

  // load history once and also refresh when leaveUpdated event triggers
  useEffect(() => {
    loadHistory();

    const onUpdate = () => loadHistory();
    window.addEventListener("leaveUpdated", onUpdate);

    return () => window.removeEventListener("leaveUpdated", onUpdate);
  }, []);

  // cancel leave only if user confirms
  const cancelRequest = (id) => {
    if (!confirm("Are you sure you want to cancel this leave request?")) return;

    cancelLeave(id)
      .then(() => loadHistory())
      .catch((err) => alert(err));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mt-8">
      <h2 className="text-xl font-bold mb-4">Leave History</h2>

      <table className="w-full border text-center">
        <thead>
          <tr className="bg-gray-200 font-semibold">
            <th className="border p-2">From</th>
            <th className="border p-2">To</th>
            <th className="border p-2">Days</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {history.length === 0 ? (
            // show message when no leave history
            <tr>
              <td colSpan="6" className="text-gray-500 py-4">
                No leave history found
              </td>
            </tr>
          ) : (
            history.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.fromDate}</td>
                <td className="border p-2">{item.toDate}</td>
                <td className="border p-2">{item.days}</td>
                <td className="border p-2">{item.reason}</td>

                {/* status badge + optional remark */}
                <td className="border p-2">
                  <div className="flex flex-col items-center">
                    <span
                      className={`px-3 py-1 rounded text-white ${
                        item.status === "Approved"
                          ? "bg-green-500"
                          : item.status === "Rejected"
                          ? "bg-red-500"
                          : item.status === "Cancelled"
                          ? "bg-gray-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {item.status}
                    </span>

                    {/* Show remark only if it exists */}
                    {item.remark && (
                      <span className="text-xs text-gray-600 mt-1 italic">
                        {item.remark}
                      </span>
                    )}
                  </div>
                </td>

                {/* show cancel button only for pending requests */}
                <td className="border p-2">
                  {item.status === "Pending" ? (
                    <button
                      onClick={() => cancelRequest(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">No Action</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveHistory;
