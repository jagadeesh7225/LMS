// Dashboard: This is the main page for normal users.
// It shows leave balance, apply-leave form, and leave history.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaveBalance } from "../services/leaveService";
import LeaveForm from "../components/LeaveForm";
import LeaveHistory from "../components/LeaveHistory";
import DashboardCard from "../components/DashboardCard";
import LogoutButton from "../components/logoutButton";

const channel = new BroadcastChannel("lms_sync");

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // how much time left before auto logout
  const navigate = useNavigate();

  // SESSION TIMER LOGIC
  useEffect(() => {
    const loginTime =
      Number(localStorage.getItem("loginTime")) || Date.now();

    const sessionLimit = 30 * 60 * 1000; // 30 minutes
    localStorage.setItem("loginTime", loginTime);

    const update = () => {
      const now = Date.now();
      const remaining = sessionLimit - (now - loginTime);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        // logout when time is up
        localStorage.removeItem("user");
        localStorage.removeItem("loginTime");
        window.location.href = "/";
      }
    };

    update();
    const interval = setInterval(update, 1000);

    // update timer even when switching tabs
    document.addEventListener("visibilitychange", update);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  // CHECK USER ROLE + LOAD LEAVE BALANCE
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    // only normal users can open this page
    if (user.role !== "user") {
      navigate("/");
      return;
    }

    const loadBalance = () => {
      getLeaveBalance().then((b) => setBalance(b));
    };

    loadBalance();

    // update balance when leave is added or updated
    window.addEventListener("leaveUpdated", loadBalance);
    channel.onmessage = () => loadBalance();

    return () => {
      window.removeEventListener("leaveUpdated", loadBalance);
      channel.onmessage = null;
    };
  }, []);

  // convert timeLeft (ms) to mm:ss format
  const mm = Math.max(0, Math.floor(timeLeft / 1000 / 60))
    .toString()
    .padStart(2, "0");
  const ss = Math.max(0, Math.floor((timeLeft / 1000) % 60))
    .toString()
    .padStart(2, "0");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-6">
      {/* Top bar */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>

        <div className="text-right">
          <div className="text-sm text-gray-700 font-semibold">
            ⏳ Session ends in: {mm}:{ss}
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto space-y-10">
        {/* show current balance */}
        <DashboardCard label="Remaining Leave Balance" value={balance} />

        {/* apply-leave form */}
        <LeaveForm />

        {/* leave history table */}
        <LeaveHistory />
      </div>
    </div>
  );
}

export default Dashboard;
