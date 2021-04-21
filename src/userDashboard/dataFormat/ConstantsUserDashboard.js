const PERIOD_OPTIONS = {
    WEEK: "Week",
    MONTH: "Month",
    YEAR: "Year",
    YEARS: 'Years'
};

const ACTIVITY_TIME_FORMAT_OPTIONS = {
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

export {

    PERIOD_OPTIONS,
    DATE_FORMAT,
    BAR_GRAPH_KEYS,
    ACTIVITY_TIME_FORMAT_OPTIONS,
    TOP_TABS,
    USER_DASHBOARD_TITLES,

};