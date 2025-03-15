require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { DBCONNECT } = require("./src/db/db");
const app = express();
const PORT = process.env.PORT;

// get router file
const userRoutes = require("./src/routes/user.routes");

// cors configuration
app.use(cors());
// set limit on data
app.use(express.json({ limit: "500kb" }));
// set cookie parser
app.use(cookieParser());
// uncode url
app.use(express.urlencoded({ extended: true }));
// testing route
app.get("/", (req, res) => {
  res.status(200).send({
    status: "success",
    code: 200,
    data: { data: "Server is running..." },
  });
});

// routes entry point
app.use("/api/v1/users", userRoutes);

// DB connection
DBCONNECT()
  .then((res) => {
    console.log("MongoDb conected.");
    app.listen(PORT, (res) => {
      console.log("Server is listining on port: ", PORT);
    });
  })
  .catch((err) => {
    console.log("🚀 ~ DBCONNECT ~ err:", err?.message);
  });
