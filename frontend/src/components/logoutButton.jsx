import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  // clears user session and redirects to login page
  const logout = () => {
    localStorage.removeItem("token");      // remove auth token
    localStorage.removeItem("user");       // remove stored user data
    localStorage.removeItem("loginTime");  // remove login timer info

    navigate("/"); // send user back to login/home page
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
