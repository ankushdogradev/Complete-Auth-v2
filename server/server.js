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

// app.use(cors());
if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: `http://localhost:3000` }));
}

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
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

// Deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API IS RUNNING.");
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on PORT: ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
