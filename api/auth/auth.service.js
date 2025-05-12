const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../models/account");

// Dùng biến môi trường cho SECRET_KEY để bảo mật
const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

const register = async ({ user, password, currency, description = "", balance = 0 }) => {
  // Kiểm tra user đã tồn tại chưa
  const existing = await Account.findOne({ user });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const account = new Account({
    user,
    password: hashedPassword,
    currency,
    description,
    balance,
    transactions: [],
  });

  await account.save();
  return { message: "User registered successfully" };
};

const login = async ({ user, password }) => {
  // Lấy user và bao gồm trường password
  const account = await Account.findOne({ user }).select("+password");
  if (!account) {
    throw new Error("Invalid username or password");
  }

  const isMatch = await bcrypt.compare(password, account.password);
  if (!isMatch) {
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: "1h" });
  return { token };
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = { register, login, verifyToken };
