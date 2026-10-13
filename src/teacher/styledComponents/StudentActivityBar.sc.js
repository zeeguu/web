import styled, { css } from "styled-components";
import { activityReading, activityExercise, activityBrowsing, activityListening } from "../../components/colors";

const SEGMENT_COLORS = {
  reading_time: activityReading,
  exercise_time: activityExercise,
  browsing_time: activityBrowsing,
  audio_time: activityListening,
};

export const StudentActivityBar = styled.div`
  .activity-bar {
    height: 20px;
    display: flex;
    margin-top: 2em;
    border-radius: 25px;
    overflow: hidden;
  }

  ${(props) =>
    props.isFirst &&
    css`
      .activity-bar {
        margin-top: 2em;
      }
    `}

  .activtybar-hours-minutes {
    color: var(--text-primary);
    font-size: x-small;
    margin-top: 30px;
  }
`;

export const Segment = styled.div`
  height: 100%;
  background-color: ${({ $kind }) => SEGMENT_COLORS[$kind]};
`;
