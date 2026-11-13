const express = require('express');
const cors = require('cors');
const authRouter = require("./routes/auth.routes");
const transactionsRouter = require("./routes/transactions.routes.js"); 
const accountRouter = require("./routes/account.routes.js"); 
const cookieParser = require('cookie-parser');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

// CORS — Allow frontend (Vite :5173) to reach the backend with cookies
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true  // Required for JWT HttpOnly cookie auth
}));

app.use(express.json());
app.use(cookieParser());

// Expose OpenAPI JSON specification
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

// Swagger documentation UI
const swaggerUiOptions = {
    customSiteTitle: "Banking Management System API Docs",
    customCss: ".swagger-ui .topbar { display: flex; }",
    swaggerOptions: {
        persistAuthorization: true,
        docExpansion: "list",
        filter: true
    }
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Bank Routes
app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/account", accountRouter);

module.exports = app;
