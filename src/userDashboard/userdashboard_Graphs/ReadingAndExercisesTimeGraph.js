import { ResponsiveBar } from "@nivo/bar";
import {
  BAR_GRAPH_KEYS,
  DEFAULT_MAX_VALUE_BAR_GRAPH,
  PERIOD_OPTIONS,
} from "../ConstantsUserDashboard";

export default function ReadingAndExercisesTimeGraph({
  data,
  activeCustomTimeInterval,
}) {
  function getMaxYValueFromData(data) {
    var max = 0;

    data.forEach((entry) =>
      entry.reading_time + entry.exercises_time > max
        ? (max = entry.reading_time + entry.exercises_time)
        : ""
    );

    return max;
  }

  function getMaxValueForYScale(activeCustomTimeInterval, data) {
    var maxValueFromData = getMaxYValueFromData(data);

    switch (activeCustomTimeInterval) {
      case PERIOD_OPTIONS.WEEK:
        return maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.WEEK
          ? DEFAULT_MAX_VALUE_BAR_GRAPH.WEEK
          : DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO;
      case PERIOD_OPTIONS.MONTH:
        return maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.MONTH
          ? DEFAULT_MAX_VALUE_BAR_GRAPH.MONTH
          : DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO;
      case PERIOD_OPTIONS.YEAR:
        return maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.YEAR
          ? DEFAULT_MAX_VALUE_BAR_GRAPH.YEAR
          : DEFAULT_MAX_VALUE_BAR_GRAPH.AUTO;
      case PERIOD_OPTIONS.YEARS:
        return maxValueFromData < DEFAULT_MAX_VALUE_BAR_GRAPH.YEARS
          ? DEFAULT_MAX_VALUE_BAR_GRAPH.YEARS
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
      maxValue={getMaxValueForYScale(activeCustomTimeInterval, data)}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
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
