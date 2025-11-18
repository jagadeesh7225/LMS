// LogoutButton: clears user data and sends user back to login page.

import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  // remove user from localStorage and redirect to home/login
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <button
      onClick={logout}
      className="bg-red-600 text-white px-4 py-2 rounded-lg"
    >
      Logout
    </button>
  );
}
