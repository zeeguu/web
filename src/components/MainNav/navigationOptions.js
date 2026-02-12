import NavIcon from "./NavIcon";
import strings from "../../i18n/definitions";
import LocalStorage from "../../assorted/LocalStorage";

export default class NavigationOptions {
  // Student-specific options
  static articles = Object.freeze({
    linkTo: "/articles",
    icon: <NavIcon name="read" />,
    text: strings.articles,
  });

  static exercises = Object.freeze({
    linkTo: "/exercises",
    icon: <NavIcon name="exercises" />,
    text: strings.exercises,
  });

  static dailyAudio = Object.freeze({
    linkTo: "/daily-audio",
    icon: <NavIcon name="dailyAudio" />,
    text: strings.dailyAudio,
  });

  static translate = Object.freeze({
    linkTo: "/translate",
    icon: <NavIcon name="translate" />,
    text: strings.translate,
  });

  static words = Object.freeze({
    linkTo: "/words",
    icon: <NavIcon name="words" />,
    text: strings.words,
  });

  static activity = Object.freeze({
    linkTo: "/activity-history",
    icon: <NavIcon name="history" />,
    text: strings.activity,
  });

  static statistics = Object.freeze({
    linkTo: "/user_dashboard",
    icon: <NavIcon name="statistics" />,
    text: strings.userDashboard,
  });

  static get teacherSite() {
    return Object.freeze({
      linkTo: LocalStorage.getLastVisitedTeacherPage(),
      icon: <NavIcon name="teacherSite" />,
      text: strings.teacherSite,
    });
  }

  // Teacher-specific options
  static myClasses = Object.freeze({
    linkTo: "/teacher/classes",
    icon: <NavIcon name="myClassrooms" />,
    text: strings.myClasses,
  });

  static myTexts = Object.freeze({
    linkTo: "/teacher/texts",
    icon: <NavIcon name="myTexts" />,
    text: strings.myTexts,
  });

  static studentSite = Object.freeze({
    linkTo: "/articles",
    icon: <NavIcon name="studentSite" />,
    text: strings.studentSite,
  });

  //Shared options
  static settings = Object.freeze({
    linkTo: "/account_settings",
    icon: <NavIcon name="settings" />,
    text: strings.settings,
  });
}
