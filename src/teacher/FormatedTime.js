export const convertTime = (seconds, setTime) =>{
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.ceil((seconds/ 60) % 60);
    hours < 1
      ? setTime(minutes + "m")
      : setTime(hours + "h " + minutes + "m");
  }