let zeeguuVeryLightYellow = "#fafad2";
let zeeguuVeryLightOrange = "hsl(46, 90%, 90%)";
let zeeguuTransparentLightYellow = "#ffe59e10";
let zeeguuLightYellow = "#ffe59e";
let zeeguuWarmYellow = "#ffd047";
let zeeguuSalmonOrange = "#f8bb86";
let zeeguuTransparentLightOrange = "hsl(54,100%,95%)";
let zeeguuTransparentMediumOrange = "#ffbe007a";
let zeeguuOrange = "#ffbb54";
let zeeguuDarkOrange = "#9c7130";
let lightBlue = "#54cdff";
let lighterBlue = "#CCDEFF";
let darkBlue = "#2f77ad";

/* 
  A NEW APPROACH TO DEFINING AND NAMING COLORS:

  All the latest shades of blue below were defined and named using this guide:
  https://www.refactoringui.com/previews/building-your-color-palette 

  The numerical values in the name of each shade describe its brightness level on a scale:
  - blue100 is the brightest
  - blue900 is the darkest

  All other colors in the application will be revised using the same pattern on an ongoing basis.
*/
const blue100 = "hsl(216, 100%, 97%)";
const blue200 = "hsl(216, 100%, 89%)";
const blue300 = "hsl(216, 100%, 81%)";
const blue400 = "hsl(216, 100%, 74%)";
const blue500 = "hsl(216, 100%, 66%)";
const blue600 = "hsl(216, 100%, 57%)";
const blue700 = "hsl(216, 100%, 48%)";
const blue800 = "hsl(216, 100%, 40%)";
const blue900 = "hsl(216, 100%, 31%)";

const blue700_transparent = "hsl(216, 100%, 48%, 60%)";

const orange100 = "hsl(36, 100%, 96%)";
const orange200 = "hsl(36, 100%, 85%)";
const orange300 = "hsl(36, 100%, 75%)";
const orange400 = "hsl(36, 100%, 65%)";
const orange500 = "hsl(36, 100%, 55%)";
const orange600 = "hsl(36, 100%, 47%)";
const orange700 = "hsl(36, 100%, 40%)";
const orange800 = "hsl(36, 100%, 32%)";
const orange900 = "hsl(36, 100%, 24%)";

const orange600_transparent = "hsl(36, 100%, 47%, 60%)";

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
  let light_color = zeeguuWarmYellow;
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
  zeeguuWarmYellow as zeeguuWarmYellow,
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
  blue600,
  blue700,
  blue800,
  blue900,
  blue700_transparent,
  orange100,
  orange200,
  orange300,
  orange400,
  orange500,
  orange600,
  orange700,
  orange800,
  orange900,
  orange600_transparent,
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
