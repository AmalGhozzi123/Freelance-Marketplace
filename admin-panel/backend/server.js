import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import freelancerRoute from "./routes/freelancerRoutes.js";
import usersRoute from "./routes/userRoutes.js"; 
import serviceRoute from"./routes/gig.route.js";
import ordersRoute from "./routes/order.route.js";
import authRoute from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 8807;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/admin/users", usersRoute);
app.use("/admin/freelancers", freelancerRoute);
app.use("/admin/services",serviceRoute);
app.use("/admin/orders",ordersRoute);
app.use("/admin",authRoute);
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
