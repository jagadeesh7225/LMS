// LeaveForm component: user selects dates, adds a reason, and applies for leave.

import { useState, useEffect } from "react";
import {
  applyLeave,
  getLeaveHistory,
  getLeaveBalance,
} from "../services/leaveService";

function LeaveForm() {
  // form fields
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  // previous leaves + balance
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  // load leaves + balance when component opens
  useEffect(() => {
    getLeaveHistory().then((data) => setHistory(data));
    getLeaveBalance().then((bal) => setBalance(bal));
  }, []);

  // find how many days the user selected
  const calculateDays = () => {
    if (!fromDate || !toDate) return 0;

    const start = new Date(fromDate);
    const end = new Date(toDate);

    // +1 because both dates are counted
    const diff = (end - start) / (1000 * 3600 * 24) + 1;

    return diff > 0 ? diff : 0;
  };

  const totalDays = calculateDays();

  // check if the selected dates clash with any old leave
  const isOverlapping = () => {
    const newFrom = new Date(fromDate);
    const newTo = new Date(toDate);

    return history.some((leave) => {
      // skip rejected and cancelled leaves
      if (leave.status === "Rejected" || leave.status === "Cancelled")
        return false;

      const oldFrom = new Date(leave.fromDate);
      const oldTo = new Date(leave.toDate);

      return oldFrom <= newTo && newFrom <= oldTo;
    });
  };

  // handle submit
  const submitLeave = () => {
    if (!fromDate || !toDate) {
      alert("Please select both dates.");
      return;
    }

    if (totalDays <= 0) {
      alert("Invalid date range.");
      return;
    }

    if (!reason.trim()) {
      alert("Please enter a reason.");
      return;
    }

    if (isOverlapping()) {
      alert("These dates clash with an existing leave request.");
      return;
    }

    if (totalDays > balance) {
      alert(`Only ${balance} leave(s) remaining.`);
      return;
    }

    // apply leave now
    applyLeave({
      fromDate,
      toDate,
      reason,
      days: totalDays,
    }).then(() => {
      alert("Leave applied.");

      // reset form
      setFromDate("");
      setToDate("");
      setReason("");
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>

      {/* show leave balance */}
      <p className="font-semibold mb-2 text-gray-700">
        Remaining Leaves: <span className="text-blue-600">{balance}</span>
      </p>

      {/* date inputs */}
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

      {/* total days */}
      <p className="mt-2 text-sm font-semibold">Total Days: {totalDays}</p>

      {/* warning if selected days exceed balance */}
      {totalDays > balance && (
        <p className="text-red-600 text-sm font-bold mt-1">
          You only have {balance} leave(s) but selected {totalDays} day(s).
        </p>
      )}

      {/* reason input */}
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full border p-2 rounded mt-3"
        placeholder="Enter reason"
        rows={3}
      />

      {/* submit button */}
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
