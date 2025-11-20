import { useState, useEffect } from "react";
import {
  applyLeave,
  getLeaveHistory,
  getLeaveBalance,
} from "../services/leaveService";

 //LeaveForm Component
 //Handles leave applying, date validation, overlapping check, and UI rendering.
function LeaveForm() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  // Load leave history + leave balance when the component loads
  useEffect(() => {
    getLeaveHistory().then((data) => setHistory(data));
    getLeaveBalance().then((bal) => setBalance(bal));
  }, []);


   //Calculates the total number of selected leave days.

  const calculateDays = () => {
    if (!fromDate || !toDate) return 0;

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const diff = (end - start) / (1000 * 3600 * 24) + 1; // include start and end date

    return diff > 0 ? diff : 0;
  };

  const totalDays = calculateDays();


   //Checks if the selected date range overlaps with existing pending/approved leaves.

  const isOverlapping = () => {
    const newFrom = new Date(fromDate);
    const newTo = new Date(toDate);

    return history.some((leave) => {
      // Skip cancelled and rejected leaves
      if (leave.status === "Cancelled" || leave.status === "Rejected") return false;

      const oldFrom = new Date(leave.fromDate);
      const oldTo = new Date(leave.toDate);

      return oldFrom <= newTo && newFrom <= oldTo;
    });
  };


   //Handles leave submission.

  const submitLeave = async () => {
    if (!fromDate || !toDate) return alert("Please select both dates.");
    if (totalDays <= 0) return alert("Invalid date range.");
    if (!reason.trim()) return alert("Please enter a reason.");
    if (totalDays > balance) return alert(`Only ${balance} leave(s) left.`);
    if (isOverlapping()) return alert("Your selected dates overlap with an existing leave request.");

    const res = await applyLeave({
      fromDate,
      toDate,
      reason,
      days: totalDays,
    });

    // Server-side validation errors
    if (!res.success) {
      alert(res.message || "Error applying leave");
      return;
    }

    alert("Leave applied successfully.");

    // Reset fields
    setFromDate("");
    setToDate("");
    setReason("");

    // Let the rest of the app update
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


//   Naming Conventions 
// • Components are named using PascalCase.
//   Example: LeaveForm.js
// • Variables and functions use camelCase.
//   Example: submitLeave(), calculateDays(), fromDate, leaveBalance
// • If the file is not using PascalCase, then kebab-case can be used.
//   Example: leave-form.js
// • Comments are added only where needed to explain logic clearly.
//   Short inline comments are used for steps like date validation or overlap checks.
// • For functions that handle bigger tasks, JSDoc-style comments are added.
//   Example:
//    * Submits the leave form data to the server
//    * @param {Object} formData - the leave form data to send
//   const submitLeave = (formData) => { ... };
