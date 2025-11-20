import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaveBalance } from "../services/leaveService";
import LeaveForm from "../components/LeaveForm";
import LeaveHistory from "../components/LeaveHistory";
import DashboardCard from "../components/DashboardCard";
import LogoutButton from "../components/logoutButton";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  // SESSION TIMER (same logic)
  useEffect(() => {
    const loginTime = Number(localStorage.getItem("loginTime")) || Date.now();
    const sessionLimit = 30 * 60 * 1000;

    localStorage.setItem("loginTime", loginTime);

    const update = () => {
      const remaining = sessionLimit - (Date.now() - loginTime);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    };

    update();
    const timer = setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // USER ROLE CHECK + LOAD BALANCE
  useEffect(() => {
    const logged = localStorage.getItem("user");
    if (!logged) return navigate("/");

    const user = JSON.parse(logged);
    if (user.role !== "user") return navigate("/");

    const loadBalance = async () => {
      const b = await getLeaveBalance();
      setBalance(b);
    };

    loadBalance();

    window.addEventListener("leaveUpdated", loadBalance);
    return () => window.removeEventListener("leaveUpdated", loadBalance);
  }, []);

  const mm = Math.max(0, Math.floor(timeLeft / 1000 / 60))
    .toString()
    .padStart(2, "0");
  const ss = Math.max(0, Math.floor((timeLeft / 1000) % 60))
    .toString()
    .padStart(2, "0");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>

        <div className="text-right">
          <div className="text-sm text-gray-700 font-semibold">
            ⏳ Session ends in: {mm}:{ss}
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        <DashboardCard label="Remaining Leave Balance" value={balance} />
        <LeaveForm />
        <LeaveHistory />
      </div>
    </div>
  );
}

export default Dashboard;
