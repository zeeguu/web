import { darkBlue, orange600, white } from "../colors";

const sharedNavColors = {
  btnContentDefault: `${white}`,
  btnBorderDefault: "transparent",
  btnBorderHover: `${white}`,
  btnBgActive: `${white}`,
  btnBgDefault: "transparent",
};

const studentNavTheme = {
  ...sharedNavColors,
  navBg: `${orange600}`,
  btnContentActive: `${orange600}`,
};

const teacherNavTheme = {
  ...sharedNavColors,
  navBg: `${darkBlue}`,
  btnContentActive: `${darkBlue}`,
};

export const mainNavTheme = {
  student: studentNavTheme,
  teacher: teacherNavTheme,
};
