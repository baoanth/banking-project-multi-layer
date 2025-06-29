  // server.js

  const express = require("express");
  const cors = require("cors");
  const bodyParser = require("body-parser");
  const connectDB = require("./config/db");
  const accountRoutes = require("./routes/account.routes");
  const authRoutes = require("./auth/auth.routes");
  const pkg = require("./package.json");
  require("dotenv").config();

  // 📄 Swagger:
  const swaggerUi = require("swagger-ui-express");
  const swaggerSpec = require("./config/swagger");

  // Initialize app
  const app = express();
  const port = process.env.PORT || 5000;

  // Connect to MongoDB
  connectDB();

  // Middleware
  app.use(cors({ origin: /http:\/\/(localhost|127\.0\.0\.1)/ }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
 

  // Swagger API Docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  //app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Health Check or Base API info
  app.get("/api", (req, res) => {
    res.json({
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      author: pkg.author,
    });
  });

  // Main API routes
  app.use("/api", accountRoutes);
  app.use("/api/auth", authRoutes);
  // 404 Handler (optional)
  app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Global Error Handler (optional)
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  });

  // Start server
  app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
  });
