require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const { DBCONNECT } = require("./src/db/db");
const os = require("node:os");
const cluster = require("node:cluster");
const numCPUs = os.cpus().length;
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
        // return callback(new Error("Unauthorized"));
        return callback(null, true);
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
  socket.on("user-message", (data) => {
    console.log("🚀 ~ socket.on ~ data:", data);
    io.emit("message", data);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected.", socket.id);
  });
});
const PORT = process.env.PORT;
// get router file
const userRoutes = require("./src/routes/user.routes");
const pumpfunRoutes = require("./src/routes/pumpfun.routes");
// set limit on data
app.use(express.json({ limit: "500kb" }));
// set cookie parser
app.use(cookieParser());
// uncode url
app.use(express.urlencoded({ extended: true }));
// allow file to render
app.use(express.static(path.resolve("./public")));
// allow client to access images
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/singleFile", express.static(path.join(__dirname, "singleFile")));
app.use("/multipleFiles", express.static(path.join(__dirname, "multipleFiles")));
// routes entry point
// testing route
app.get("/", (req, res) => {
  res.sendFile("/public/index.html");
});
// all the routes redirection
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/pumpfun", pumpfunRoutes);

// running all core cpus for load balancing
if (cluster.isMaster) {
  // fork workers (one per CPU core)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died.`);
    });
  }
} else {
  // DB connection
  DBCONNECT()
    .then((res) => {
      console.log("MongoDb conected.");
      server.listen(PORT, (res) => {
        console.log(`${process.pid} Server is listining on port: `, PORT);
      });
    })
    .catch((err) => {
      console.log("🚀 ~ DBCONNECT ~ err:", err?.message);
    });
}
