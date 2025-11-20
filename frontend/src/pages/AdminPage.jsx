import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLeavesAdmin, updateLeaveStatus } from "../services/leaveService";
import LogoutButton from "../components/logoutButton";

function AdminPage() {
  // store all leave requests
  const [leaveData, setLeaveData] = useState([]);

  // for rejection modal
  const [remarkBox, setRemarkBox] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [remark, setRemark] = useState("");

  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0); // session countdown

  // fetch all leaves for admin
  const loadLeaves = async () => {
    const data = await getAllLeavesAdmin();
    setLeaveData(data);
  };

  /*SESSION TIMER*/
  useEffect(() => {
    const loginTime = Number(localStorage.getItem("loginTime")) || Date.now();
    const sessionLimit = 30 * 60 * 1000; // 30 minutes

    // updates countdown every second
    const update = () => {
      const remaining = sessionLimit - (Date.now() - loginTime);
      setTimeLeft(remaining);

      // auto-logout on timeout
      if (remaining <= 0) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    };

    update(); // run once immediately
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  /* LOAD & LIVE UPDATE */
  useEffect(() => {
    // redirect if user isn't admin
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") navigate("/");

    loadLeaves(); // initial fetch

    // reload data when leave updates elsewhere
    const onUpdate = () => loadLeaves();
    window.addEventListener("leaveUpdated", onUpdate);

    // sync across multiple browser tabs
    let ch;
    try {
      ch = new BroadcastChannel("lms_sync");
      ch.onmessage = onUpdate;
    } catch {}

    // cleanup
    return () => {
      window.removeEventListener("leaveUpdated", onUpdate);
      if (ch) ch.close();
    };
  }, []);

  // approve leave instantly (no remark)
  const approve = async (id) => {
    await updateLeaveStatus(id, "Approved", "");
  };

  // reject leave with remark
  const reject = async () => {
    if (!remark.trim()) return alert("Remark required");

    await updateLeaveStatus(currentId, "Rejected", remark);

    setRemark("");
    setRemarkBox(false);
  };

  // time formatting: mm:ss
  const mm = String(Math.floor(timeLeft / 1000 / 60)).padStart(2, "0");
  const ss = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header: Title + logout + timer */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>

        <div className="text-right">
          <p className="text-sm">⏳ Ends in: {mm}:{ss}</p>
          <LogoutButton />
        </div>
      </div>

      {/* Leave request table */}
      <div className="bg-white p-6 rounded-xl shadow-xl overflow-x-auto">
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
            {leaveData.map((item) => {
              const isPending = item.status === "Pending";

              return (
                <tr key={item._id}>
                  <td className="border p-2">{item.userName}</td>
                  <td className="border p-2">{item.empId}</td>
                  <td className="border p-2">{item.email}</td>
                  <td className="border p-2">{item.fromDate}</td>
                  <td className="border p-2">{item.toDate}</td>
                  <td className="border p-2">{item.days}</td>
                  <td className="border p-2">{item.reason}</td>

                  {/* Status badge */}
                  <td className="border p-2">
                    <span
                      className={`px-3 py-1 rounded text-white ${
                        item.status === "Approved"
                          ? "bg-green-500"
                          : item.status === "Rejected"
                          ? "bg-red-500"
                          : item.status === "Cancelled"
                          ? "bg-gray-500"
                          : "bg-yellow-500" // Pending
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Approve / Reject buttons */}
                  <td className="border p-2">
                    <button
                      disabled={!isPending}
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                      onClick={() => approve(item._id)}
                    >
                      Approve
                    </button>

                    <button
                      disabled={!isPending}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setCurrentId(item._id); // store active id
                        setRemarkBox(true);     // open modal
                      }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rejection popup */}
      {remarkBox && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-bold mb-3">Rejection Remark</h3>

            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <button
              className="w-full bg-red-600 text-white py-2 rounded mb-2"
              onClick={reject}
            >
              Submit
            </button>

            <button
              className="w-full bg-gray-500 text-white py-2 rounded"
              onClick={() => setRemarkBox(false)} // close modal
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
