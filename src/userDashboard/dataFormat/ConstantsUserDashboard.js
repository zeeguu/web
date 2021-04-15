const PERIOD_OPTIONS = {
    WEEK: "Week",
    MONTH: "Month",
    YEAR: "Year",
    YEARS: 'Years'
};

const ACTIVITY_TIME_FORMAT_OPTIONS = {
    SECONDS: "Seconds",
    MINUTES: "Minutes",
    HOURS: "Hours"
};

const TOP_TABS = {
  BAR_GRAPH: "Activity",
  LINE_GRAPH: "Words"
}

//date format used for making sure dates are translated 
//in the same way when working with the data
//this is _not_ the date format used for formatting dates to be shown on the graphs or datepicker 
const DATE_FORMAT = "yyyy-MM-dd"; 

const BAR_GRAPH_KEYS = {
  READING: "reading_time",
  EXERCISES: "exercises_time",
  INDEX_BY: "date",
  LEGEND_BOTTOM: "dates",
  LEGEND_LEFT: "time count"
}

const USER_DASHBOARD_TITLES = {
  MAIN_TITLE: "Your Dashboard",
  BAR_GRAPH_TITLE: "Your time spent on reading and exercises",
  LINE_GRAPH_TITLE: "Your number of translated words"
}

const USER_DASHBOARD_TEXTS = {
  BAR_GRAPH_HELPER_TEXT: "Here you can see your activity for a specific period of time and a specific time format. Use the options below to choose between Week/Month/Year/Years view and Seconds/Minutes/Hours time format. You can also select the end date for the time interval",
  LINE_GRAPH_HELPER_TEXT: "Here you can see how many words you translated during a specific period of time. Use the options below to choose between Week/Month/Year/Years view and the end date for the time interval.",
}

export {

    PERIOD_OPTIONS,
    DATE_FORMAT,
    BAR_GRAPH_KEYS,
    ACTIVITY_TIME_FORMAT_OPTIONS,
    TOP_TABS,
    USER_DASHBOARD_TITLES,
    USER_DASHBOARD_TEXTS

};