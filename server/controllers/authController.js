import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = "JWT_SECRET_KEY";

/* -----------------------------------------------
   SIGNUP
------------------------------------------------ */
export const signup = async (req, res) => {
  try {
    const { name, email, employeeId, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      empId: employeeId, // <<< FIXED
      password: hash,
      role: "user",
    });

    res.json({ success: true, message: "Signup successful" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

/* -----------------------------------------------
   LOGIN
------------------------------------------------ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ADMIN LOGIN
    if (email === "admin@lms.com" && password === "Admin@123") {
      const token = jwt.sign(
        {
          name: "Admin",
          empId: "ADMIN001",
          email,
          role: "admin",
        },
        JWT_SECRET,
        { expiresIn: "30m" }
      );

      return res.json({ success: true, token });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, message: "Invalid credentials" });

    // Generate token with clean user fields
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        empId: user.empId,
        role: "user",
      },
      JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.json({ success: true, token });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};
