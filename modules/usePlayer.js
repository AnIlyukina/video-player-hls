import { getTime } from "./useTimeFormatting";

const usePlayer = () => {
  const player = document.querySelector(".player");
  const video = player.querySelector(".player__video");
  const playButton = player.querySelector(".player__play");
  const playerConsole = player.querySelector(".player__console");
  const time = player.querySelector(".player__time");
  const fullscreen = player.querySelector(".player__fullscreen");
  const playOrPause = player.querySelector(".play-pause-btn");
  const fullScreenBtn = player.querySelector(".fullscreen-btn");

  // ползунок
  const progress = document.querySelector(".progress");
  const progressPlayed = document.querySelector(".progress__played");
  const progressBuffered = document.querySelector(".progress__buffered");
  const progressPlayedBtn = document.querySelector(".progress__played-btn");

  // элементы для выбора ширины плеера
  const videoWidth = player.style.width;
  const videoSizeOptions = document.querySelectorAll("#videoSize option");
  const videoSize = document.querySelector("#videoSize");

  if (videoWidth) {
    videoSizeOptions.forEach((option, index) => {
      if (option.value === videoWidth) {
        videoSize.selectedIndex = index;
      }
    });
  }

  function toggleVideoStatus() {
    if (video.paused) {
      video.play();
      playOrPause.src = "./assets/icons/pause.png";
      return;
    }
    video.pause();
    playOrPause.src = "./assets/icons/play.png";
  }

  function changeCurrentTime(event) {
    const widthProgress = progress.clientWidth;
    const currentTime = (video.duration * event.layerX) / widthProgress;
    video.currentTime = currentTime;
  }

  function updateProgressPlayed() {
    progressPlayed.style.width =
      (video.currentTime / video.duration) * 100 + "%";
  }

  function updateProgressBuffered(buffered) {
    progressBuffered.style.width =
      (video.currentTime / video.duration + buffered / video.duration) * 100 +
      "%";
  }

  function updateTime() {
    time.textContent = `${getTime(video.currentTime)} / ${getTime(
      video.duration
    )}`;
  }

  function toogleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      fullScreenBtn.src = "./assets/icons/fullscreen-icon.png";
    } else {
      player.requestFullscreen();
      fullScreenBtn.src = "./assets/icons/screen-icon.png";
    }
  }

  function changeSize(value) {
    player.style.width = value;
  }

  playButton.addEventListener("click", toggleVideoStatus);
  video.addEventListener("click", toggleVideoStatus);
  fullscreen.addEventListener("click", toogleFullScreen);

  fullscreen.addEventListener("click", toogleFullScreen);

  playerConsole.addEventListener("mousemove", () => {
    progressPlayedBtn.style.opacity = "100%";
  });
  playerConsole.addEventListener("mouseout", () => {
    progressPlayedBtn.style.opacity = "0";
  });

  progress.addEventListener("click", (event) => {
    changeCurrentTime(event);
  });

  return {
    updateTime,
    changeSize,
    updateProgressPlayed,
    updateProgressBuffered,
    video,
  };
};

export default usePlayer;
