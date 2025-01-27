import * as s from "./LoadingAnimation.sc";
import strings from "../i18n/definitions";
import React from "react";
import { StyledGreyButton } from "../exercises/exerciseTypes/Exercise.sc";
import { useState, useEffect } from "react";
import FeedbackModal from "./FeedbackModal";
import { FEEDBACK_OPTIONS } from "./FeedbackConstants";
import isInTeacherWebsite from "../utils/misc/isTeacherWebsite";

export default function LoadingAnimation({
  text,
  specificStyle,
  delay = 1000,
  children,
}) {
  let _text = text ? text : strings.loadingMsg;
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isTeacherWebsite] = useState(isInTeacherWebsite());

  useEffect(() => {
    // Code from: https://stackoverflow.com/questions/53090432/react-hooks-right-way-to-clear-timeouts-and-intervals
    // Only show the loading if more that 1000ms have passed.
    let loadingTimer = setTimeout(() => setShowLoadingScreen(true), delay);
    let showReportButtonTimer = setTimeout(
      () => setShowReportButton(true),
      delay + 4000,
    ); // Wait 4 seconds to show the link to the FeedbackScreen.
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(showReportButtonTimer);
    };
  }, []);

  return (
    <>
      <FeedbackModal
        prefixMsg={"Loading"}
        open={showFeedbackModal}
        setOpen={() => {
          setShowFeedbackModal(!showFeedbackModal);
        }}
        feedbackOptions={FEEDBACK_OPTIONS.ALL}
      />
      {showLoadingScreen && (
        <s.LoadingContainer style={specificStyle}>
          <s.LoadingAnimation>
            <div
              className={
                "lds-ellipsis " + (isTeacherWebsite ? "teacher" : "student")
              }
            >
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </s.LoadingAnimation>
          {showReportButton && (
            <StyledGreyButton
              style={{ marginTop: "-1.5rem", zIndex: 1000 }}
              onClick={() => {
                setShowFeedbackModal(!showFeedbackModal);
              }}
            >
              Report Issue
            </StyledGreyButton>
          )}
          {children}
        </s.LoadingContainer>
      )}
    </>
  );
}
