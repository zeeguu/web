import { ResponsiveBar } from "@nivo/bar";
import { darkBlue, zeeguuWarmYellow } from "../../components/colors";
import {
  BAR_GRAPH_KEYS,
  DEFAULT_MAX_VALUE_BAR_GRAPH,
  PERIOD_OPTIONS,
  ACTIVITY_TIME_FORMAT_OPTIONS,
} from "../ConstantsUserDashboard";

export default function ReadingAndExercisesTimeGraph({
  data,
  activeCustomTimeInterval,
  activeTimeFormatOption,
}) {
  function getMaxYValueFromData(data) {
    var max = 0;

    data.forEach((entry) =>
      entry.reading_time + entry.exercises_time > max
        ? (max = entry.reading_time + entry.exercises_time)
        : "",
    );

    return max;
  }

  /**
   * Function to determine the highest y value to be shown on the graph.
   *
   * The default values corresponding to time period and count options
   * can be seen in DEFAULT_MAX_VALUE_BAR_GRAPH from ConstantsUserDashboard.
   *
   * If one of the values from the data set received is higher than
   * the corresponding default value for period and count,
   * then set the maxValue to "auto" in the nivo graph,
   * which will set the highest y value to the highest value from the data.
   *
   */

  function getMaxValueForYScale(
    activeCustomTimeInterval,
    activeTimeFormatOption,
    data,
  ) {
    var maxValueFromData = getMaxYValueFromData(data);

    switch (activeCustomTimeInterval) {
      case PERIOD_OPTIONS.WEEK:
        return activeTimeFormatOption === ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES
          ? maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.WEEK.MINUTES
            ? DEFAULT_MAX_VALUE_BAR_GRAPH.WEEK.MINUTES
            : DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO
          : maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.WEEK.HOURS
            ? DEFAULT_MAX_VALUE_BAR_GRAPH.WEEK.HOURS
            : DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO;
      case PERIOD_OPTIONS.MONTH:
        return activeTimeFormatOption === ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES
          ? maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.MONTH.MINUTES
            ? DEFAULT_MAX_VALUE_BAR_GRAPH.MONTH.MINUTES
            : DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO
          : maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.MONTH.HOURS
            ? DEFAULT_MAX_VALUE_BAR_GRAPH.MONTH.HOURS
            : DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO;
      case PERIOD_OPTIONS.YEAR:
        return activeTimeFormatOption === ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES
          ? maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.YEAR.MINUTES
            ? DEFAULT_MAX_VALUE_BAR_GRAPH.YEAR.MINUTES
            : DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO
          : maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.YEAR.HOURS
            ? DEFAULT_MAX_VALUE_BAR_GRAPH.YEAR.HOURS
            : DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO;
      case PERIOD_OPTIONS.YEARS:
        return activeTimeFormatOption === ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES
          ? maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.YEARS.MINUTES
            ? DEFAULT_MAX_VALUE_BAR_GRAPH.YEARS.MINUTES
            : DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO
          : maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.YEARS.HOURS
            ? DEFAULT_MAX_VALUE_BAR_GRAPH.YEARS.HOURS
            : DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO;
      default:
        return DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO;
    }
  }

  return (
    <ResponsiveBar
      data={data}
      keys={[BAR_GRAPH_KEYS.READING, BAR_GRAPH_KEYS.EXERCISES]}
      indexBy={BAR_GRAPH_KEYS.INDEX_BY}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      maxValue={getMaxValueForYScale(
        activeCustomTimeInterval,
        activeTimeFormatOption,
        data,
      )}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          background: "inherit",
          color: darkBlue,
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          background: "inherit",
          color: zeeguuWarmYellow,
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: BAR_GRAPH_KEYS.READING,
          },
          id: "dots",
        },
        {
          match: {
            id: BAR_GRAPH_KEYS.EXERCISES,
          },
          id: "lines",
        },
      ]}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: BAR_GRAPH_KEYS.LEGEND_BOTTOM,
        legendPosition: "left",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: BAR_GRAPH_KEYS.LEGEND_LEFT,
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 100,
          translateY: 50,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
}
