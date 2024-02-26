require("express-async-errors");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const routeNotFound = require("./middlewares/notFound");
const userRoute = require("./routes/user");
const shopRoute = require("./routes/shop");
const productRoute = require("./routes/product");
const eventRoute = require("./routes/event");
const couponRoute = require("./routes/coupon");
const paymentRoute = require("./routes/payment");
const orderRoute = require("./routes/order");
const conversationRoute = require("./routes/conversation");
const messagesRoute = require("./routes/message");
const withdrawRoute = require("./routes/withdraw");

const app = express();

app.set("trust proxy", 1);
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// );
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(cookieParser(process.env.JWT_SECRET));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use("/", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Welcome to e-commerce ");
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/shop", shopRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/event", eventRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/conversation", conversationRoute);
app.use("/api/v1/messages", messagesRoute);
app.use("/api/v1/withdraw", withdrawRoute);

app.use(routeNotFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
