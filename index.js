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
  '-r', `${25}`,
  '-g', `${25 * 2}`,
  '-keyint_min', 25,
  '-crf', '25',
  '-pix_fmt', 'yuv420p',
  '-sc_threshold', '0',
  '-profile:v', 'main',
  '-level', '3.1',
  '-c:a', 'aac',
  '-b:a', '128k',
  '-ar', 128000 / 4,
  '-f', 'flv',
  `rtmp://a.rtmp.youtube.com/live2/asasas-asaseuk-ssss-as6sm1-trrb-cxkt`,
];

const ffmpegProcess = spawn("ffmpeg", options);

ffmpegProcess.stdout.on("data",(data)=>{
  console.log(`ffmpeg stdout`,data)
})

ffmpegProcess.stdin.on("error", (err) => {
  console.error("FFmpeg stdin error:", err);
});
ffmpegProcess.stderr.on("data", (data) => {
  console.error("FFmpeg stderr error:", data);
});
ffmpegProcess.on("close", (code) => {
  console.error("FFmpeg process exitedd code:", code);
});

io.on("connection", (socket) => {
  console.log(`Socket Connected-${socket.id}`);
  socket.on("binarydata", (stream) => {
    ffmpegProcess.stdin.write(stream, (err) => {
      console.log("Err", err);
    });
    console.log(`Binary Stream Comming...${stream}`);
  });
});

server.listen(PORT, () => {
  console.log(`[Server Running...${PORT}]`);
});
