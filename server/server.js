require("dotenv").config({
  path: "C:/Users/Administrator/Documents/Web Dev/Portfolio/FullStack/complete-auth-v2/.env",
});

const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./error/errorHandler");

connectDB();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
