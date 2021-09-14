let lightOrange = "#ffd047";
let veryPaleOrange = "#ffbe007a";
let zeeguuOrange = "#ffbb54";
let lightBlue = "#54cdff";
let darkBlue = "#4492b3";
let darkGrey = "#808080";
let lightGrey = "#c1c1c1";

const setColors = (isOnStudentSide) => {
  let light_color = lightOrange;
  let dark_color = zeeguuOrange;
  if (!isOnStudentSide) {
    light_color = lightBlue;
    dark_color = darkBlue;
  }

  return { light_color, dark_color };
};

export {
  lightOrange,
  veryPaleOrange,
  zeeguuOrange,
  lightBlue,
  darkBlue,
  darkGrey,
  lightGrey,
  setColors,
};
