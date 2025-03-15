require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const { DBCONNECT } = require("./src/db/db");
const app = express();
const server = http.createServer(app);
// all about ws
// create WS socket
// strict origin cors configuration
const allowedOrigins = ["http://localhost:9999"];
// socket start io server
const io = new Server(server);
// apis cors configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(new Error("Unauthorized"));
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Unauthorized"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-API-Key",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
// send error when client is not authorized
app.use((err, req, res, next) => {
  if (err?.message == "Unauthorized") {
    return res
      .status(403)
      .json({ code: 403, success: false, error: "Unauthorized request!!" });
  }
});
// connection
io.on("connection", (socket) => {
  console.log("A new user has connected", socket.id);
  // socket.on("user-message", (data) => {
  //   io.emit("message", data);
  // });
});
const PORT = process.env.PORT;
// get router file
const userRoutes = require("./src/routes/user.routes");
// set limit on data
app.use(express.json({ limit: "500kb" }));
// set cookie parser
app.use(cookieParser());
// uncode url
app.use(express.urlencoded({ extended: true }));
// allow file to render
app.use(express.static(path.resolve("./public")));
// routes entry point
// testing route
app.get("/", (req, res) => {
  res.sendFile("/public/index.html");
});
// all the routes redirection
app.use("/api/v1/users", userRoutes);
// DB connection
DBCONNECT()
  .then((res) => {
    console.log("MongoDb conected.");
    server.listen(PORT, (res) => {
      console.log("Server is listining on port: ", PORT);
    });
  })
  .catch((err) => {
    console.log("🚀 ~ DBCONNECT ~ err:", err?.message);
  });
