let zeeguuLightYellow = "#ffe59e";
let zeeguuVeryLightYellow = "#fafad2";
let zeeguuTransparentLightYellow = "#ffe59e10";
let zeeguuVarmYellow = "#ffd047";
let zeeguuTransparentLightOrange = "#ffbb5440";
let zeeguuTransparentMediumOrange = "#ffbe007a";
let zeeguuSalmonOrange = "#f8bb86";
let zeeguuOrange = "#ffbb54";
let zeeguuDarkOrange = "#9c7130";
let lightBlue = "#54cdff";
let darkBlue = "#4492b3";
let almostBlack = "#444444";
let darkGrey = "#808080";
let veryDarkGrey = "#575757";
let lightGrey = "#c1c1c1";
let veryLightGrey = "#efefef";
let almostWhite = "f1f1f1";
let zeeguuRed = "#d7263d";
let zeeguuViolet = "#4a0d67";
let alertGreen = "#4caf50"; //careful when changing this color. It is defined to match the success-alert to undo feedback submits.
//red = css standard color used
//black = css standard color used
//white = css standard color used

const setColors = (isOnStudentSide) => {
  let light_color = zeeguuVarmYellow;
  let dark_color = zeeguuOrange;
  if (!isOnStudentSide) {
    light_color = lightBlue;
    dark_color = darkBlue;
  }

  return { light_color, dark_color };
};

export {
  zeeguuRed,
  zeeguuViolet,
  alertGreen,
  zeeguuVeryLightYellow,
  zeeguuLightYellow,
  zeeguuVarmYellow,
  zeeguuTransparentLightYellow,
  zeeguuTransparentLightOrange,
  zeeguuTransparentMediumOrange,
  zeeguuSalmonOrange,
  zeeguuOrange,
  zeeguuDarkOrange,
  lightBlue,
  darkBlue,
  almostBlack,
  darkGrey,
  veryDarkGrey,
  lightGrey,
  veryLightGrey,
  almostWhite,
  setColors,
};
