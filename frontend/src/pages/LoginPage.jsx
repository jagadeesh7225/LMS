import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  console.log("LoginPage loaded"); // debug log

  // login form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // forgot password modal state
  const [showForgotBox, setShowForgotBox] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  // LOGIN (BACKEND)
  const login = async () => {
    console.log("Login clicked");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // simple input checks
    if (!trimmedEmail || !trimmedPassword) {
      alert("Enter email and password");
      return;
    }

    try {
      // API call to backend login route
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      // if backend returns failure
      if (!data.success) {
        alert(data.message || "Invalid credentials!");
        return;
      }

      // save token to localStorage
      localStorage.setItem("token", data.token);

      // extract user details from token
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      localStorage.setItem("user", JSON.stringify(payload));

      console.log("Decoded user:", payload);

      // redirect based on role
      if (payload.role === "admin") navigate("/admin");
      else navigate("/dashboard");

    } catch (error) {
      console.log("Login error:", error);
      alert("Could not reach server. Check backend.");
    }
  };

  //  UPDATE PASSWORD (LOCAL ONLY) 
  const updatePassword = () => {
    const trimmedFpEmail = fpEmail.trim();
    const trimmedNewPassword = newPassword.trim();

    if (!trimmedFpEmail) return alert("Enter your email");
    if (trimmedNewPassword.length < 4)
      return alert("Password must be at least 4 characters.");

    // get stored users (mock data)
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // find user by email
    const index = users.findIndex((u) => u.email === trimmedFpEmail);
    if (index === -1) return alert("Email not found");

    // update their password
    users[index].password = trimmedNewPassword;
    localStorage.setItem("users", JSON.stringify(users));

    alert("Password updated!");

    // reset fields
    setFpEmail("");
    setNewPassword("");
    setShowForgotBox(false);
  };

  return (
    <div
      onSubmit={(e) => {
        e.preventDefault(); // prevents accidental form submit
        console.log(" Blocked implicit form submit");
      }}
    >
      {/* Main Login Screen */}
      <div className="min-h-screen flex justify-center items-center bg-purple-200">
        <div className="bg-white p-8 rounded-xl w-80 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          {/* Email input */}
          <input
            type="email"
            placeholder="Enter email"
            className="w-full border p-2 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Enter password"
            className="w-full border p-2 rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login button */}
          <button
            type="button"
            onClick={() => {
              console.log("Button clicked");
              login();
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

          {/* Forgot password link */}
          <p
            className="text-sm text-blue-700 text-center mt-3 cursor-pointer underline"
            onClick={() => setShowForgotBox(true)}
          >
            Forgot Password?
          </p>

          {/* Signup link */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-green-700 font-semibold cursor-pointer"
            >
              Signup
            </span>
          </p>

          {/* Demo admin login block */}
          <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300 text-center">
            <p className="text-sm font-semibold">Admin Login</p>
            <p className="text-xs">admin@lms.com</p>
            <p className="text-xs">Admin@123</p>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotBox && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
            <h3 className="text-lg font-bold mb-3 text-center">
              Reset Password
            </h3>

            {/* Email for forgot password */}
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-2 rounded mb-3"
              value={fpEmail}
              onChange={(e) => setFpEmail(e.target.value)}
            />

            {/* New password */}
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border p-2 rounded mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {/* Submit password update */}
            <button
              type="button"
              onClick={updatePassword}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Update Password
            </button>

            {/* Close modal */}
            <button
              type="button"
              onClick={() => setShowForgotBox(false)}
              className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
