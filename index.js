require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { userRoute } = require("./routes/user.route");
const { productRoute } = require("./routes/product.route");
const { cartRoute } = require("./routes/cart.route");

const { connection } = require("./db");

const app = express();
app.use(cors());

app.use(express.json());

app.use(morgan("tiny"));

app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);

app.listen(process.env.PORT, async () => {
  await connection;
  console.log("server started");
});
