import jwt from "jsonwebtoken";

const JWT_SECRET = "JWT_SECRET_KEY";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.json({ success: false, message: "No token" });

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      name: decoded.name,
      email: decoded.email,
      empId: decoded.empId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.json({ success: false, message: "Invalid or expired token" });
  }
};
