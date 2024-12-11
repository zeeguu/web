import NavIcon from "./NavIcon";
import strings from "../../i18n/definitions";

export default class StudentOptions {
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
}
