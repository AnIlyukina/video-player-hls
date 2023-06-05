import "./assets/style.scss";

import Hls from "hls.js";

import { getBuffer, timeRangesToString } from "./modules/useTimeFormatting";

import usePlayer from "./modules/usePlayer";

const {
  updateTime,
  changeSize,
  updateProgressPlayed,
  updateProgressBuffered,
  setDisplayPlayer,
  video,
} = usePlayer();

// инпут для манифеста
const stream = document.querySelector("#stream");

// статусы, ошибки, данные о потоке
const playerStatus = document.querySelector("#playerStatus");
const playerErrors = document.querySelector("#playerErrors");
const streamData = document.querySelector("#streamData");

const loading = document.querySelector('.loading')

// hls, дефолтное src видео
let hls;
const defaultVideoSrc =
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8";
let videoSrc = "";

if (defaultVideoSrc) {
  videoSrc = defaultVideoSrc;
  stream.value = videoSrc;
  loadStream();
}

function clearStreamInfo() {
  playerStatus.textContent = "";
  playerErrors.textContent = "";
  streamData.textContent = "Данные не получены";
}

function loadStream() {
  clearStreamInfo();
  toggleLoading(true)

  // isSupported() - метод, который проверяет поддерживает ли браузер расширение MediaSource
  if (!Hls.isSupported()) {
    addErrors("— Hts.js не поддерживается браузером.");
    return;
  }

  addStatus("— Hts.js поддерживается браузером.");

  // убиваем hls, если он запущен
  if (hls) {
    hls.destroy();
    hls = null;
  }

  hls = new Hls();

  hls.on(Hls.Events.MEDIA_ATTACHED, function () {
    addStatus("— MediaSource готов, видео и hls.js связаны друг с другом.");
  });

  hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
    toggleLoading(false)
    addStatus(
      `— Манифест (поток) успешно загружен, ${data.levels.length} quality levels`
    );

    clearInterval(hls.bufferTimer);
    // устанавливает setInterval для получения данных о потоке
    hls.bufferTimer = setInterval(getStreamData, 100);
  });

  // загружаем манифест, ресурс
  hls.loadSource(videoSrc);

  // связываем все вместе
  hls.attachMedia(video);

  // обрабатываем ошибки(не все, выбрала часть из доки)
  handleHLSErrors();

  hls.on(Hls.Events.DESTROYING, () => {
    clearInterval(hls.bufferTimer);
  });
}

function handleHLSErrors() {
  hls.on(Hls.Events.ERROR, function (event, data) {
    const errorDetails = data.details;

    switch (errorDetails) {
      case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
        addErrors("— Сбой загрузки манифеста(потока)");
        break;
      case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
        addErrors("— Сбой загрузки манифеста(потока) из-за тйам-аута");
        break;
      case Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR:
        addErrors("— Несовместимость видео кодеки с MediaSource");
        break;
      case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
        addErrors("— Сбой расшифровки фрагмента");
        break;
      default:
        break;
    }

    // попытка восстановить фатальную ошибку
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.MEDIA_ERROR:
          addErrors("— Фатальная ошибка носителя");
          hls.recoverMediaError();
          break;
        case Hls.ErrorTypes.NETWORK_ERROR:
          addErrors("— Фатальная сетевая ошибка");
          break;
        default:
          // cannot recover
          hls.destroy();
          break;
      }
    }
  });
}

function getStreamData() {
  const playedBlocks = timeRangesToString(video.played);
  const bufferedBlocks = timeRangesToString(video.buffered);
  const buffer = getBuffer(video.currentTime, video.buffered);

  streamData.textContent = `Продолжительность потока (сек): ${video.duration}.
Запас буфера (сек): ${buffer}.
Бло­ки муль­ти­ме­дий­ных дан­ных:
- которые были проигранны, сек (played): ${playedBlocks ? playedBlocks : 0}
- загруженные в буфер, сек (buffered): ${bufferedBlocks}`;

  updateTime();

  updateProgressPlayed();
  updateProgressBuffered(buffer);
}

function toggleLoading (value) {
  loading.style.display = value ? 'block' : 'none';
  setDisplayPlayer(value);
}

function addStatus(text) {
  playerStatus.textContent += text + "\n";
}

function addErrors(text) {
  playerErrors.textContent += text + "\n";
}

function changeStream(value) {
  videoSrc = value;
  loadStream();
}

// слушатели
// на изменение потока
stream.addEventListener("change", (event) => {
  changeStream(event.target.value);
});

// на изменение ширины проигрывателя
videoSize.addEventListener("change", (event) => {
  changeSize(event.target.value);
});
