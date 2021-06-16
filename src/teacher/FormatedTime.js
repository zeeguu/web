export const convertTime = (accumulatedTime, setTime) => {
  //console.log("converting " + accumulatedTime + " seconds into:");
  const hours = Math.floor(accumulatedTime / 3600);
  const minutes = Math.floor((accumulatedTime / 60) % 60);
  const seconds = Math.round(accumulatedTime - minutes * 60);
  const timestring = hours + "h " + minutes + "m " + seconds + "s";
  if (accumulatedTime < 60) {
    //console.log(seconds + "s");
    setTime(seconds + "s");
  } else {
    //console.log(timestring);
    hours < 1
      ? setTime(minutes + "m " + seconds + "s")
      : setTime(hours + "h " + minutes + "m");
  }
};

export const convertTimeForActivityBar = (accumulatedTime, setTime) => {
  if (accumulatedTime < 240) {
    setTime("");
  }
  if (240 < accumulatedTime){
    if (accumulatedTime < 600 ) {
    const time = Math.floor((accumulatedTime / 60) % 60)+"m"
    setTime(time);
  } else {
    convertTime(accumulatedTime, setTime);
  }}
};
