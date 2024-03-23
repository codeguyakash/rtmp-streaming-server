const express = require("express");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 8000;
app.use(express.static(path.resolve("./public")));
const options = [
  '-i',
  '-',
  '-c:v', 'libx264',
  '-preset', 'ultrafast',
  '-tune', 'zerolatency',
  '-r', '25',
  '-g', '50',
  '-keyint_min', '25',
  '-crf', '25',
  '-pix_fmt', 'yuv420p',
  '-sc_threshold', '0',
  '-profile:v', 'main',
  '-level', '3.1',
  '-c:a', 'aac',
  '-b:a', '128k',
  '-ar', '44100', // Audio sample rate
  '-f', 'flv',
  `rtmp://a.rtmp.youtube.com/live2/`,
];

const ffmpegProcess = spawn("ffmpeg", options);

ffmpegProcess.stdin.on('error', (err) => {
  console.error('FFmpeg stdin error:', err);
});

io.on("connection", (socket) => {
  console.log(`Socket Connected-${socket.id}`);
  socket.on("binarydata", (stream) => {
    console.log(`Binary Stream Comming...${stream}`);
    // You may write the binary stream to ffmpegProcess.stdin here
  });
});

server.listen(PORT, () => {
  console.log(`[Server Running...${PORT}]`);
});
