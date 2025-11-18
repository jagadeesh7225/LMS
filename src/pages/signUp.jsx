// SignupPage: User creates a new account with name, employee ID, email, and password.
// Has strong password validation and prevents duplicate accounts.

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [name, setName] = useState("");
  const [empId, setEmpId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // errors shown below inputs
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [empIdError, setEmpIdError] = useState("");

  const navigate = useNavigate();

  // Strong Password Rules
  const validateStrongPassword = (pwd) => {
    const err = [];
    if (pwd.length < 8) err.push("At least 8 characters");
    if (!/[A-Z]/.test(pwd)) err.push("At least one uppercase letter");
    if (!/[a-z]/.test(pwd)) err.push("At least one lowercase letter");
    if (!/[0-9]/.test(pwd)) err.push("At least one number");
    if (!/[!@#$%^&*]/.test(pwd)) err.push("At least one special character");
    return err;
  };

  // Employee ID Validation
  const validateEmpId = (value) => {
    const id = value.trim();

    if (id === "") {
      setEmpIdError("Employee ID is required");
    } else if (!/^\d+$/.test(id)) {
      setEmpIdError("Employee ID must contain only numbers");
    } else if (id.length < 3) {
      setEmpIdError("Employee ID must be at least 3 digits");
    } else {
      setEmpIdError("");
    }

    setEmpId(id);
  };

  // Signup Function
  const handleSignup = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedId = empId.trim();

    if (!trimmedName) return alert("Please enter your full name.");
    if (!trimmedEmail) return alert("Please enter an email.");
    if (!trimmedId) return alert("Please enter Employee ID.");

    // stop if employee ID has error
    if (empIdError) return alert(empIdError);

    // check password requirements
    const pwErrors = validateStrongPassword(password);
    if (pwErrors.length > 0) {
      setPasswordErrors(pwErrors);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // avoid duplicate account
    const exists = users.find(
      (u) => u.email === trimmedEmail || u.employeeId === trimmedId
    );

    if (exists) {
      alert("User with this Email or Employee ID already exists.");
      return;
    }

    // add new user
    users.push({
      name: trimmedName,
      email: trimmedEmail,
      employeeId: trimmedId,
      password,
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Please login.");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-purple-200">
      <div className="bg-white p-8 rounded-xl w-80 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Signup</h2>

        {/* Full Name */}
        <input
          type="text"
          placeholder="Enter full name"
          className="w-full border p-2 rounded mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Employee ID */}
        <input
          type="text"
          placeholder="Enter Employee ID (min 3 digits)"
          className="w-full border p-2 rounded mb-1"
          value={empId}
          onChange={(e) => validateEmpId(e.target.value)}
        />
        {empIdError && (
          <p className="text-xs text-red-600 mb-2">{empIdError}</p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Create strong password"
          className="w-full border p-2 rounded mb-2"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordErrors(validateStrongPassword(e.target.value));
          }}
        />

        {/* Password rule list */}
        {passwordErrors.length > 0 && (
          <div className="text-xs text-red-600 mb-3">
            <p>Password must include:</p>
            <ul className="list-disc ml-5">
              {passwordErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Signup button */}
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Create Account
        </button>

        {/* Link to login */}
        <p className="text-xs text-gray-600 mt-3 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
