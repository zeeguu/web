export const convertTime = (accumulatedTime, setTime) => {
  //console.log("converting " + accumulatedTime + " seconds into:");
  const hours = Math.floor(accumulatedTime / 3600);
  const minutes = Math.floor((accumulatedTime / 60) % 60);
  const seconds = Math.floor(accumulatedTime - minutes * 60)
  const timestring = hours + "h " + minutes + "m " + seconds + "s";
  setTime(Math.round(accumulatedTime) + "S")
/*   if (accumulatedTime < 60) {
    console.log(accumulatedTime+"s")
    setTime(accumulatedTime + "s");;
  } else {
    console.log(timestring);
    hours < 1 ? setTime(minutes + "m " + seconds + "s") : setTime(hours + "h " + minutes + "m");
  } */
};
