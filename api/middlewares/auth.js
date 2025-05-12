const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization header:", authHeader);  // Kiểm tra giá trị header

  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  console.log("Token:", token);  // Kiểm tra token

  if (!token) return res.status(401).json({ error: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gán thông tin người dùng vào request
    next();
  } catch (err) {
    console.log(err);  // In lỗi chi tiết ra console để kiểm tra thêm
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
