// leaveService.js
// Handles all leave operations: apply, approve, reject, cancel, and saving to localStorage.

// used to sync changes across tabs
const channel = new BroadcastChannel("lms_sync");

// load saved leave balance or use default 12
export let leaveBalance =
  JSON.parse(localStorage.getItem("leaveBalance")) ?? 12;

// load saved leave history or empty array
export let leaves =
  JSON.parse(localStorage.getItem("leaves")) ?? [];

// save updated leaveBalance + leaves to localStorage
// also notify all tabs/pages
const save = () => {
  localStorage.setItem("leaveBalance", JSON.stringify(leaveBalance));
  localStorage.setItem("leaves", JSON.stringify(leaves));

  channel.postMessage("update");
  window.dispatchEvent(new Event("leaveUpdated"));
};

// APPLY LEAVE (USER APPLYING A NEW LEAVE)
export const applyLeave = (data) => {
  // get logged-in user details
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Unknown",
    empId: "N/A",
    email: "N/A",
  };

  // create a new leave entry
  const newLeave = {
    id: Date.now(), // unique ID
    fromDate: data.fromDate,
    toDate: data.toDate,
    reason: data.reason || "",
    days: data.days || 0,
    status: "Pending", // default
    remark: "", // no remark yet
    appliedAt: new Date().toISOString(),

    // save correct user info
    userName: user.name,
    empId: user.empId,
    email: user.email,
  };

  leaves.push(newLeave);
  save();

  return Promise.resolve(newLeave);
};

// GETTERS (LEAVE BALANCE + LEAVE HISTORY)
export const getLeaveBalance = () => Promise.resolve(leaveBalance);

export const getLeaveHistory = () => Promise.resolve([...leaves]);

// ADMIN: APPROVE OR REJECT LEAVE
export const updateLeaveStatus = (id, status, remark = "") => {
  const index = leaves.findIndex((l) => l.id === id);
  if (index === -1) return Promise.resolve();

  const leave = leaves[index];

  // deduct leave balance only when admin approves the leave
  if (status === "Approved" && leave.status !== "Approved") {
    leaveBalance -= leave.days;
    if (leaveBalance < 0) leaveBalance = 0;
  }

  // update values
  leave.status = status;

  leave.remark =
    remark || (status === "Cancelled" ? "Cancelled by user" : "");

  save();
  return Promise.resolve();
};


  // USER: CANCEL LEAVE REQUEST
export const cancelLeave = (id) => {
  const index = leaves.findIndex((l) => l.id === id);
  if (index === -1) return Promise.reject("Leave not found");

  const leave = leaves[index];

  // only pending leaves can be cancelled
  if (leave.status !== "Pending") {
    return Promise.reject("Only pending leaves can be cancelled.");
  }

  leave.status = "Cancelled";
  leave.remark = "Cancelled by user";

  save();
  return Promise.resolve(true);
};
