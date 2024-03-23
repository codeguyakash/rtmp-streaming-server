const express = require("express");
const http = require("http");
const path = require("path");
const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
app.use(express.static(path.resolve("./public")));

// app.get("/", (req, res) => {});
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log(`Socket Connected-${socket.id}`);
  socket.on("binarydata", (stream) => {
    console.log(`Binary Stream Comming...${stream}`);
  });
});

server.listen(PORT, () => {
  console.log(`[Server Running...${PORT}]`);
});
