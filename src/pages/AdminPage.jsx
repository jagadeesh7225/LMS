// AdminPage: Admin can view all leave requests and approve or reject them.
// Also has a session timer that auto-logs out after 30 minutes.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLeaveHistory,
  updateLeaveStatus,
} from "../services/leaveService";
import LogoutButton from "../components/logoutButton";

const channel = new BroadcastChannel("lms_sync");

function AdminPage() {
  const [leaveData, setLeaveData] = useState([]);
  const [remarkBox, setRemarkBox] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [remark, setRemark] = useState("");

  // timer left for auto logout
  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();

  // SESSION TIMER LOGIC
  useEffect(() => {
    // get last login time OR set it now
    const loginTime =
      Number(localStorage.getItem("loginTime")) || Date.now();

    const sessionLimit = 30 * 60 * 1000; // 30 minutes
    localStorage.setItem("loginTime", loginTime);

    // update timer every second
    const update = () => {
      const now = Date.now();
      const remaining = sessionLimit - (now - loginTime);
      setTimeLeft(remaining);

      // if time is over → logout
      if (remaining <= 0) {
        localStorage.removeItem("user");
        localStorage.removeItem("loginTime");
        window.location.href = "/";
      }
    };

    update();
    const interval = setInterval(update, 1000);

    // handle tab switching (prevents timer from freezing)
    document.addEventListener("visibilitychange", update);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // load all leave records
  const loadLeaves = () => {
    getLeaveHistory().then((res) => setLeaveData([...res]));
  };

  // check if admin is logged in and load leaves
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      // if not admin, send user out
      if (user.role !== "admin") {
        navigate("/");
        return;
      }

      loadLeaves();

      // listen to updates from other tabs
      window.addEventListener("leaveUpdated", loadLeaves);
      channel.onmessage = () => loadLeaves();

      return () => {
        window.removeEventListener("leaveUpdated", loadLeaves);
        channel.onmessage = null;
      };
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // convert remaining ms into mm:ss
  const mm = Math.max(0, Math.floor(timeLeft / 1000 / 60))
    .toString()
    .padStart(2, "0");
  const ss = Math.max(0, Math.floor((timeLeft / 1000) % 60))
    .toString()
    .padStart(2, "0");

  // approve leave directly
  const approve = (id) => {
    updateLeaveStatus(id, "Approved", "").then(() => loadLeaves());
  };

  // open rejection popup
  const openRejectBox = (id) => {
    setCurrentId(id);
    setRemark("");
    setRemarkBox(true);
  };

  // submit rejection with remark
  const submitReject = () => {
    if (!remark.trim()) {
      alert("Remark is required.");
      return;
    }

    updateLeaveStatus(currentId, "Rejected", remark).then(() => {
      setRemark("");
      setCurrentId(null);
      setRemarkBox(false);
      loadLeaves();
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>

        {/* Session timer + logout */}
        <div className="text-right">
          <div className="text-sm text-gray-700 font-semibold">
            ⏳ Session ends in: {mm}:{ss}
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Leave table */}
      <div className="bg-white p-6 rounded-2xl shadow-xl overflow-x-auto">
        <table className="w-full border text-center min-w-max">
          <thead>
            <tr className="bg-gray-200 font-semibold">
              <th className="border p-2">Employee Name</th>
              <th className="border p-2">Employee ID</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">From</th>
              <th className="border p-2">To</th>
              <th className="border p-2">Days</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {leaveData.length === 0 ? (
              // no records
              <tr>
                <td colSpan="9" className="text-gray-500 py-4">
                  No leave records found
                </td>
              </tr>
            ) : (
              leaveData.map((item) => {
                const isPending = item.status === "Pending";

                return (
                  <tr key={item.id}>
                    <td className="border p-2">{item.userName}</td>
                    <td className="border p-2">{item.empId}</td>
                    <td className="border p-2">{item.email}</td>
                    <td className="border p-2">{item.fromDate}</td>
                    <td className="border p-2">{item.toDate}</td>
                    <td className="border p-2">{item.days}</td>
                    <td className="border p-2">{item.reason}</td>

                    {/* status badge */}
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

                        {/* remark (if any) */}
                        {item.remark && (
                          <span className="text-xs text-gray-600 mt-1 italic">
                            {item.remark}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* approve / reject buttons */}
                    <td className="border p-2">
                      <div className="inline-flex">
                        <button
                          onClick={() => approve(item.id)}
                          disabled={!isPending}
                          className={`px-3 py-1 rounded mr-2 ${
                            isPending
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-gray-400 text-white cursor-not-allowed"
                          }`}
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => openRejectBox(item.id)}
                          disabled={!isPending}
                          className={`px-3 py-1 rounded ${
                            isPending
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-gray-400 text-white cursor-not-allowed"
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* rejection popup */}
      {remarkBox && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-3 text-center">
              Enter Rejection Remark
            </h3>

            <textarea
              className="w-full border p-2 rounded mb-3"
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter reason for rejection"
            />

            <div className="space-y-2">
              <button
                onClick={submitReject}
                className="w-full bg-red-600 text-white py-2 rounded"
              >
                Submit rejection
              </button>

              <button
                onClick={() => setRemarkBox(false)}
                className="w-full bg-gray-400 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
