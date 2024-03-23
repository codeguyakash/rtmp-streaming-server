const userVideo = document.getElementById("video");
const startButton = document.getElementById("start-button");

const state = { media: null };
const socket = io();
startButton.addEventListener("click", () => {
  const mediaRecorder = new MediaRecorder(state.media, {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    framerate: 25,
  });
  mediaRecorder.ondataavailable = (event) => {
    console.log("Binary Data", event.data);
    socket.emit("binarydata", event.data);
  };
  mediaRecorder.start(25);
});

window.addEventListener("load", async (e) => {
  try {
    const media = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    state.media = media;
    userVideo.srcObject = media;
  } catch (err) {
    console.error("Error accessing user media:", err);
  }
});
