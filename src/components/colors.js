let zeeguuVeryLightYellow = "#fafad2";
let zeeguuVeryLightOrange = "hsl(46, 90%, 90%)";
let zeeguuTransparentLightYellow = "#ffe59e10";
let zeeguuLightYellow = "#ffe59e";
let zeeguuVarmYellow = "#ffd047";
let zeeguuSalmonOrange = "#f8bb86";
let zeeguuTransparentLightOrange = "hsl(54,100%,95%)";
let zeeguuTransparentMediumOrange = "#ffbe007a";
let zeeguuOrange = "#ffbb54";
let zeeguuDarkOrange = "#9c7130";
let lightBlue = "#54cdff";
let lighterBlue = "#CCDEFF";
let darkBlue = "#2f77ad";
let blue100 = "hsl(216, 100%, 97%)";
let blue200 = "hsl(216, 100%, 89%)";
let blue300 = "hsl(216, 100%, 81%)";
let blue400 = "hsl(216, 100%, 74%)";
let blue500 = "hsl(216, 100%, 66%)";
let blue800 = "hsl(216, 100%, 40%)";
let veryLightGrey = "#efefef";
let lightGrey = "#c1c1c1";
let darkGrey = "#808080";
let veryDarkGrey = "#575757";
let almostBlack = "#444444";
let zeeguuRed = "#d7263d";
let zeeguuRedTransparent = "hsl(352, 70%, 50%, 11%)";
let zeeguuDarkRed = "hsl(352, 70%, 43%)";
let errorRed = "red";
let zeeguuViolet = "#4a0d67";
let darkGreen = "#006400";
let alertGreen = "#4caf50"; //careful when changing this color. It is defined to match the color in the success-alert to undo feedback submits.
let matchGreen = "#B3F78F";
let translationHover = "#2f76ac";
let lightOrange = "#ffe5b9";
let brown = "#A46A00";
let white = "#FFFFFF";
let buttonBorder = "#3079b0";
let gray = "999999";
//black - the css standard color is used throughout the repo.
//white - the css standard color is used throughout the repo.

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
  zeeguuVeryLightYellow,
  zeeguuVeryLightOrange,
  zeeguuTransparentLightYellow,
  zeeguuLightYellow,
  zeeguuVarmYellow,
  zeeguuSalmonOrange,
  zeeguuTransparentLightOrange,
  zeeguuTransparentMediumOrange,
  zeeguuOrange,
  zeeguuDarkOrange,
  lightBlue,
  lighterBlue,
  darkBlue,
  blue100,
  blue200,
  blue300,
  blue400,
  blue500,
  blue800,
  veryLightGrey,
  lightGrey,
  darkGrey,
  veryDarkGrey,
  almostBlack,
  zeeguuRed,
  zeeguuRedTransparent,
  zeeguuDarkRed,
  errorRed,
  zeeguuViolet,
  darkGreen,
  alertGreen,
  matchGreen,
  lightOrange,
  translationHover,
  brown,
  buttonBorder,
  white,
  gray,
  setColors,
};
