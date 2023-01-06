const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const db = require("./db");
const jwt = require("./middlewares/jwt");
const api = require("./routes/api");
const auth = require("./routes/auth");
const diagnostics = require("./routes/diagnostics");
const ChatService = require("./services/chat-service");

// basic dependencies
const app = express();
const httpServer = http.createServer(app);

// services
ChatService.init(new Server(httpServer));

// middlewares
app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*" }));
app.use(jwt);

// routes
app.use("/api/auth", auth);
app.use("/api", api);
app.use("/api", diagnostics);

db.connect().then(() => {
  httpServer.listen(8000, () => console.log("Server listening on port 8000"));
});
