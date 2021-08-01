require("dotenv").config({
  path: "C:/Users/Administrator/Documents/Web Dev/Portfolio/FullStack/complete-auth-v2/.env",
});

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const schedule = require("node-schedule");
const connectDB = require("./config/db");
const errorHandler = require("./error/errorHandler");
const User = require("./models/userModels");
const authRoutes = require("./routes/authRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", authRoutes);

// >>>>>>> ~ Delete User Data if not verified ~ <<<<<<<
const job = schedule.scheduleJob("0 1 * * *", function () {
  return deleteOldUsers();
});

const deleteOldUsers = () => {
  const current = new Date();
  // subtracting 7 days
  current.setDate(current.getDate() - 7);
  User.deleteMany({ isVerify: false, createdAt: { $lte: current } }, (err) => {
    if (err) return console.log("Error while erasing users " + err);
    console.log("successfully erased data");
  });
};
// >>>>>>> ~ Delete User Data if not verified ~ <<<<<<<

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
