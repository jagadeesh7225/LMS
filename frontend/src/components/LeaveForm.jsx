import { useState, useEffect } from "react";
import {
  applyLeave,
  getLeaveHistory,
  getLeaveBalance,
} from "../services/leaveService";

function LeaveForm() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    getLeaveHistory().then((data) => setHistory(data));
    getLeaveBalance().then((bal) => setBalance(bal));
  }, []);

  const calculateDays = () => {
    if (!fromDate || !toDate) return 0;

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diff = (end - start) / (1000 * 3600 * 24) + 1;

    return diff > 0 ? diff : 0;
  };

  const totalDays = calculateDays();

  const isOverlapping = () => {
  const newFrom = new Date(fromDate);
  const newTo = new Date(toDate);

  return history.some((leave) => {
    // ❌ Ignore cancelled and rejected 
    if (leave.status === "Cancelled" || leave.status === "Rejected") return false;

    // ✔ Block only Pending & Approved
    const oldFrom = new Date(leave.fromDate);
    const oldTo = new Date(leave.toDate);

    return oldFrom <= newTo && newFrom <= oldTo;
  });
};


  const submitLeave = async () => {
    if (!fromDate || !toDate) return alert("Please select both dates.");
    if (totalDays <= 0) return alert("Invalid date range.");
    if (!reason.trim()) return alert("Please enter a reason.");
    if (totalDays > balance) return alert(`Only ${balance} leave(s) left.`);

    // This will be overridden by backend check also
    if (isOverlapping()) {
      alert("Your selected dates overlap with an existing leave request.");
      return;
    }

    const res = await applyLeave({
      fromDate,
      toDate,
      reason,
      days: totalDays,
    });

    // NEW: Proper backend error popup
    if (!res.success) {
      alert(res.message || "Error applying leave");
      return;
    }

    // Success
    alert("Leave applied successfully.");
    setFromDate("");
    setToDate("");
    setReason("");
    window.dispatchEvent(new Event("leaveUpdated"));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>

      <p className="font-semibold mb-2 text-gray-700">
        Remaining Leaves: <span className="text-blue-600">{balance}</span>
      </p>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          min={today}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          min={fromDate || today}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <p className="mt-2 text-sm font-semibold">Total Days: {totalDays}</p>

      {totalDays > balance && (
        <p className="text-red-600 text-sm font-bold mt-1">
          You only have {balance} leave(s) but selected {totalDays}.
        </p>
      )}

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full border p-2 rounded mt-3"
        placeholder="Enter reason"
        rows={3}
      />

      <button
        onClick={submitLeave}
        disabled={totalDays > balance || totalDays === 0}
        className={`mt-4 w-full py-2 rounded-lg ${
          totalDays > balance
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        Submit Leave Request
      </button>
    </div>
  );
}

export default LeaveForm;
