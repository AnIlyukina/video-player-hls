import "./assets/style.scss";

import Hls from "hls.js";

// видеоплеер
const video = document.querySelector(".player__video");

// инпут для манифеста
const stream = document.querySelector("#stream");

// hls 
let hls;
const defaultVideoSrc =
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8";
let videoSrc = "";


if (defaultVideoSrc) {
  videoSrc = defaultVideoSrc;
  stream.value = videoSrc;
  loadStream();
}


function loadStream() {

  // isSupported() - метод, который проверяет поддерживает ли браузер расширение MediaSource
  if (!Hls.isSupported()) {
    console.log('печаль')
    return;
  }

  // убиваем hls, если он запущен
  if (hls) {
    hls.destroy();
    hls = null;
  }

  hls = new Hls();

  hls.on(Hls.Events.MEDIA_ATTACHED, function () {
    console.log("video and hls.js are now bound together !");
  });

  hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
    console.log("manifest loaded, found " + data.levels.length + " quality level");
  });

  // загружаем манифест, ресурс
  hls.loadSource(videoSrc);

  // связываем все вместе
  hls.attachMedia(video);
}


function changeStream(value) {
  videoSrc = value;
  loadStream();
}




// слушатели 

// при изменении потока
stream.addEventListener('change', (event) => {
  changeStream(event.target.value)
})