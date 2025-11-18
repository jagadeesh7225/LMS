// LoginPage: User enters email + password.
// Supports admin login, user login, and a simple forgot-password popup.

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // forgot-password popup states
  const [showForgotBox, setShowForgotBox] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  // LOGIN
  const login = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      alert("Enter email and password");
      return;
    }

    // Admin login
    if (trimmedEmail === "admin@lms.com" && trimmedPassword === "Admin@123") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Admin",
          empId: "ADMIN001",
          email: trimmedEmail,
          role: "admin",
        })
      );
      navigate("/admin");
      return;
    }

    // Normal user login 
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === trimmedEmail && u.password === trimmedPassword
    );

    if (!user) {
      alert("Invalid credentials!");
      return;
    }

    // store minimal user data
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: user.name,
        empId: user.employeeId,
        email: user.email,
        role: "user",
      })
    );

    navigate("/dashboard");
  };
  // UPDATE PASSWORD
  const updatePassword = () => {
    const trimmedFpEmail = fpEmail.trim();
    const trimmedNewPassword = newPassword.trim();

    if (!trimmedFpEmail) {
      alert("Please enter your email.");
      return;
    }

    if (trimmedNewPassword.length < 4) {
      alert("Password must be at least 4 characters.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex((u) => u.email === trimmedFpEmail);

    if (index === -1) {
      alert("Email not found.");
      return;
    }

    users[index].password = trimmedNewPassword;
    localStorage.setItem("users", JSON.stringify(users));

    alert("Password updated successfully!");

    // reset popup fields
    setFpEmail("");
    setNewPassword("");
    setShowForgotBox(false);
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-purple-200">
        <div className="bg-white p-8 rounded-xl w-80 shadow-lg animate-fadeInSlow">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          {/* email */}
          <input
            type="email"
            placeholder="Enter email"
            className="w-full border p-2 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* password */}
          <input
            type="password"
            placeholder="Enter password"
            className="w-full border p-2 rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

          <p
            className="text-sm text-blue-700 text-center mt-3 cursor-pointer underline"
            onClick={() => setShowForgotBox(true)}
          >
            Forgot Password?
          </p>

          {/* link to signup */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-green-700 font-semibold cursor-pointer"
            >
              Signup
            </span>
          </p>

          {/* admin login info */}
          <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300 text-center">
            <p className="text-sm font-semibold">Admin Login</p>
            <p className="text-xs">admin@lms.com</p>
            <p className="text-xs">Admin@123</p>
          </div>
        </div>
      </div>

      {/*FORGOT PASSWORD POPUP */}
      {showForgotBox && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
            <h3 className="text-lg font-bold mb-3 text-center">
              Reset Password
            </h3>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-2 rounded mb-3"
              value={fpEmail}
              onChange={(e) => setFpEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border p-2 rounded mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={updatePassword}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Update Password
            </button>

            <button
              onClick={() => setShowForgotBox(false)}
              className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginPage;
