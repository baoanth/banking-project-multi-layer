const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const accountRoutes = require("./routes/account.routes");
const pkg = require("./package.json");

// Init app
const app = express();
const port = process.env.PORT || 5000;

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: /http:\/\/(localhost|127\.0\.0\.1)/ }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/api", (req, res) => {
  res.send(`${pkg.description} v${pkg.version}`);
});
app.use("/api", accountRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});