import NavIcon from "./NavIcon";
import strings from "../../i18n/definitions";

export default class NavigationOptions {
  // Student-specific options
  static articles = Object.freeze({
    linkTo: "/articles",
    icon: <NavIcon name="home" />,
    text: strings.articles,
    isOnStudentSide: true,
  });

  static exercises = Object.freeze({
    linkTo: "/exercises",
    icon: <NavIcon name="exercises" />,
    text: strings.exercises,
    isOnStudentSide: true,
  });

  static words = Object.freeze({
    linkTo: "/words",
    icon: <NavIcon name="words" />,
    text: strings.words,
    isOnStudentSide: true,
  });

  static history = Object.freeze({
    linkTo: "/history",
    icon: <NavIcon name="history" />,
    text: strings.history,
    isOnStudentSide: true,
  });

  static statistics = Object.freeze({
    linkTo: "/user_dashboard",
    icon: <NavIcon name="statistics" />,
    text: strings.userDashboard,
    isOnStudentSide: true,
  });

  static teacherSite = Object.freeze({
    linkTo: "/teacher/classes",
    icon: <NavIcon name="teacherSite" />,
    text: strings.teacherSite,
    isOnStudentSide: true,
  });

  // Teacher-specific options
  static myClasses = Object.freeze({
    linkTo: "/teacher/classes",
    icon: <NavIcon name="myClassrooms" />,
    text: strings.myClasses,
    isOnStudentSide: false,
  });

  static myTexts = Object.freeze({
    linkTo: "/teacher/texts",
    icon: <NavIcon name="myTexts" />,
    text: strings.myTexts,
    isOnStudentSide: false,
  });

  static studentSite = Object.freeze({
    linkTo: "/articles",
    icon: <NavIcon name="studentSite" />,
    text: strings.studentSite,
    isOnStudentSide: false,
  });

  //Shared options
  static settings = Object.freeze({
    linkTo: "/account_settings",
    icon: <NavIcon name="settings" />,
    text: strings.settings,
    isOnStudentSide: true,
  });
}
