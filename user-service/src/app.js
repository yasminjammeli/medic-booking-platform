const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const startGrpcServer = require('./grpc/server');

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/users", authRoutes);

startGrpcServer();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`User-service running on port ${PORT}`));
