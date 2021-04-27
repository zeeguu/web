/**
 * Constants used for the UserDashboard module
 */

import udstrings from "../../i18n/userDashboard";

const OPTIONS = {
  WEEK: udstrings.last7days,
  MONTH: "Last 30 days",
  YEAR: "Last 12 months",
  YEARS: "Available Years",
  CUSTOM: "Other time period",
};

const PERIOD_OPTIONS = {
  WEEK: "7 days",
  MONTH: "30 days",
  YEAR: "12 months",
  YEARS: "Available years",
};

const ACTIVITY_TIME_FORMAT_OPTIONS = {
  MINUTES: "Minutes",
  HOURS: "Hours",
};

const TOP_TABS = {
  BAR_GRAPH: "Activity",
  LINE_GRAPH: "Words",
};

//date format used for making sure dates are translated
//in the same way when working with the data
//this is _not_ the date format used for formatting dates to be shown on the graphs or datepicker
const DATE_FORMAT = "yyyy-MM-dd";

const BAR_GRAPH_KEYS = {
  READING: "reading_time",
  EXERCISES: "exercises_time",
  INDEX_BY: "date",
  LEGEND_BOTTOM: "date",
  LEGEND_LEFT: "",
};

const LINE_GRAPH_BOTTOM_LEGEND = {
  WEEK: "Word Count Week",
  MONTH: "Word Count 30 Days",
  YEAR: "Word Count 12 Months",
  YEARS: "Word Count Available Years",
};

const USER_DASHBOARD_TITLES = {
  MAIN_TITLE: "Your Dashboard",
  BAR_GRAPH_TITLE: "Your time spent on reading and exercises",
  LINE_GRAPH_TITLE: "Your number of translated words",
};

export {
  PERIOD_OPTIONS,
  DATE_FORMAT,
  BAR_GRAPH_KEYS,
  ACTIVITY_TIME_FORMAT_OPTIONS,
  TOP_TABS,
  USER_DASHBOARD_TITLES,
  OPTIONS,
  LINE_GRAPH_BOTTOM_LEGEND,
};
