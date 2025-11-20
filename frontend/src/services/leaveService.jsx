const API_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

// Auto add Bearer token
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/* ---------------------------------------------------
   AUTH
--------------------------------------------------- */
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return await res.json();
};

export const signupUser = async (body) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return await res.json();
};

/* ---------------------------------------------------
   BROADCAST UPDATE TO ALL WINDOWS
--------------------------------------------------- */
const broadcastUpdate = () => {
  window.dispatchEvent(new Event("leaveUpdated"));
  try {
    const ch = new BroadcastChannel("lms_sync");
    ch.postMessage("update");
    ch.close();
  } catch {}
};

/* ---------------------------------------------------
   LEAVES
--------------------------------------------------- */
export const applyLeave = async (data) => {
  const res = await fetch(`${API_URL}/leaves/apply`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (json.success) broadcastUpdate();
  return json;
};

export const getLeaveHistory = async () => {
  const res = await fetch(`${API_URL}/leaves/my-leaves`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  return data.leaves || [];
};

export const cancelLeave = async (id) => {
  const res = await fetch(`${API_URL}/leaves/cancel/${id}`, {
    method: "PUT",
    headers: authHeaders(),
  });

  const json = await res.json();
  if (json.success) broadcastUpdate();
  return json;
};

/* ---------------------------------------------------
   ADMIN
--------------------------------------------------- */
export const getAllLeavesAdmin = async () => {
  const res = await fetch(`${API_URL}/leaves/admin/all`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  return data.leaves || [];
};

export const updateLeaveStatus = async (id, status, remark = "") => {
  const res = await fetch(`${API_URL}/leaves/admin/status/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status, remark }),
  });

  const json = await res.json();
  if (json.success) broadcastUpdate();
  return json;
};

/* ---------------------------------------------------
   BALANCE
--------------------------------------------------- */
export const getLeaveBalance = async () => {
  const leaves = await getLeaveHistory();
  let used = 0;

  leaves.forEach((l) => {
    if (l.status === "Approved") used += l.days;
  });

  return 12 - used;
};
