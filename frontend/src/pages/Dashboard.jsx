import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaveBalance } from "../services/leaveService";
import LeaveForm from "../components/LeaveForm";
import LeaveHistory from "../components/LeaveHistory";
import DashboardCard from "../components/DashboardCard";
import LogoutButton from "../components/logoutButton";

function Dashboard() {
  const [balance, setBalance] = useState(0);   // stores user leave balance
  const [timeLeft, setTimeLeft] = useState(0); // session countdown timer
  const navigate = useNavigate();

  // SESSION TIMER 
  useEffect(() => {
    const loginTime = Number(localStorage.getItem("loginTime")) || Date.now();
    const sessionLimit = 30 * 60 * 1000; // 30 minutes

    localStorage.setItem("loginTime", loginTime); // ensure loginTime persists

    // updates the timer every second
    const update = () => {
      const remaining = sessionLimit - (Date.now() - loginTime);
      setTimeLeft(remaining);

      // auto logout when session expires
      if (remaining <= 0) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    };

    update(); // run immediately
    const timer = setInterval(update, 1000);

    // also update timer when user switches tabs
    document.addEventListener("visibilitychange", update);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  //  USER ROLE CHECK + LOAD BALANCE
  useEffect(() => {
    const logged = localStorage.getItem("user");
    if (!logged) return navigate("/"); // not logged in → redirect

    const user = JSON.parse(logged);
    if (user.role !== "user") return navigate("/"); // only normal user allowed here

    // fetch leave balance
    const loadBalance = async () => {
      const b = await getLeaveBalance();
      setBalance(b);
    };

    loadBalance();

    // refresh balance whenever leave is applied or cancelled
    window.addEventListener("leaveUpdated", loadBalance);

    return () => window.removeEventListener("leaveUpdated", loadBalance);
  }, []);

  // format time mm:ss
  const mm = Math.max(0, Math.floor(timeLeft / 1000 / 60))
    .toString()
    .padStart(2, "0");
  const ss = Math.max(0, Math.floor((timeLeft / 1000) % 60))
    .toString()
    .padStart(2, "0");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-6">
      {/* header: title + session time + logout */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>

        <div className="text-right">
          <div className="text-sm text-gray-700 font-semibold">
            ⏳ Session ends in: {mm}:{ss}
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* main dashboard content */}
      <div className="max-w-5xl mx-auto space-y-10">
        <DashboardCard label="Remaining Leave Balance" value={balance} />

        {/* leave apply form */}
        <LeaveForm />

        {/* past requests table */}
        <LeaveHistory />
      </div>
    </div>
  );
}

export default Dashboard;
