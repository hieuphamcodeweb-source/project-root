require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const usersRoute = require("./routes/users");
const productsRoute = require("./routes/products");

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend API Running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});