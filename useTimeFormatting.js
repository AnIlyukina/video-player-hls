export function getTime(time) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor((time / 60 / 60) % 24);

  return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
}

const addZero = (num) => {
  if (num <= 9) {
    return "0" + num;
  } else {
    return num;
  }
};

export function getBuffer(currentTime, buffered) {
  let buffer = "";
  for (let i = 0; i < buffered.length; i++) {
    if (i === buffered.length - 1) {
      buffer = buffered.end(i) - currentTime;
    }
  }
  return buffer;
}

// из доки взяла
export function timeRangesToString (r) {
  let log = "";
  for (let i = 0; i < r.length; i++) {
    log += "[" + r.start(i) + ", " + r.end(i) + "]";
    log += " ";
  }
  return log;
}
