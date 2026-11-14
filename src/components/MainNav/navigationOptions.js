import NavIcon from "./NavIcon";
import strings from "../../i18n/definitions";
import LocalStorage from "../../assorted/LocalStorage";

export function isNavOptionActive(linkTo, currentPath) {
  // Special case: the Read (articles) button should be active for any
  // /articles/* sub-tab and /swiper. linkTo varies (last-visited tab) so
  // match on the /articles prefix instead of equality. Translate likewise.
  if (linkTo?.startsWith("/articles")) {
    return currentPath?.startsWith("/articles") || currentPath?.startsWith("/swiper");
  }
  if (linkTo?.startsWith("/translate")) return currentPath?.startsWith("/translate");
  return currentPath?.startsWith(linkTo);
}

export default class NavigationOptions {
  // Student-specific options
  static get articles() {
    return Object.freeze({
      linkTo: LocalStorage.getLastVisitedReadPath(),
      icon: <NavIcon name="read" />,
      text: strings.articles,
    });
  }

  static exercises = Object.freeze({
    linkTo: "/practice",
    icon: <NavIcon name="exercises" />,
    text: strings.exercises,
  });

  static verbalFlashcards = Object.freeze({
    linkTo: "/verbalFlashcards",
    icon: <NavIcon name="verbalFlashcards" />,
    text: strings.verbalFlashcards,
  });

  static dailyAudio = Object.freeze({
    linkTo: "/daily-audio",
    icon: <NavIcon name="dailyAudio" />,
    text: strings.dailyAudio,
  });

  // Opens the Translate tab last visited (Your texts stays Your texts).
  static get translate() {
    return Object.freeze({
      linkTo: LocalStorage.getLastVisitedTranslatePath(),
      icon: <NavIcon name="translate" />,
      text: strings.translate,
    });
  }

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

  static myWords = Object.freeze({
    linkTo: "/words",
    icon: <NavIcon name="words" />,
    text: strings.myWords,
  });

  static myActivity = Object.freeze({
    linkTo: "/activity-history",
    icon: <NavIcon name="history" />,
    text: strings.myActivity,
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

  static profile = Object.freeze({
    linkTo: "/profile",
    text: strings.titleOwnProfile,
  });
}
