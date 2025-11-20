import { useEffect, useState } from "react";
import { getLeaveHistory, cancelLeave } from "../services/leaveService";

function LeaveHistory() {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const data = await getLeaveHistory();
    setHistory([...data]);
  };

  useEffect(() => {
    loadHistory();

    const onUpdate = () => loadHistory();
    window.addEventListener("leaveUpdated", onUpdate);

    return () => window.removeEventListener("leaveUpdated", onUpdate);
  }, []);

  const cancelRequest = async (id) => {
    if (!confirm("Are you sure you want to cancel this leave request?"))
      return;

    const res = await cancelLeave(id);

    if (!res.success) {
      alert(res.message || "Unable to cancel leave");
      return;
    }

    loadHistory();
    window.dispatchEvent(new Event("leaveUpdated"));
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
            <tr>
              <td colSpan="6" className="text-gray-500 py-4">
                No leave history found
              </td>
            </tr>
          ) : (
            history.map((item) => (
              <tr key={item._id}>
                <td className="border p-2">{item.fromDate}</td>
                <td className="border p-2">{item.toDate}</td>
                <td className="border p-2">{item.days}</td>
                <td className="border p-2">{item.reason}</td>

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

                    {item.remark && (
                      <span className="text-xs text-gray-600 mt-1 italic">
                        {item.remark}
                      </span>
                    )}
                  </div>
                </td>

                <td className="border p-2">
                  {item.status === "Pending" ? (
                    <button
                      onClick={() => cancelRequest(item._id)}
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
