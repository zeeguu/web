import * as s from "./LoadingAnimation.sc";
import React from "react";
import { StyledGreyButton } from "../exercises/exerciseTypes/Exercise.sc";
import { useState, useEffect } from "react";
import FeedbackModal from "./FeedbackModal";
import { FEEDBACK_OPTIONS } from "./FeedbackConstants";
import isInTeacherWebsite from "../utils/misc/isTeacherWebsite";

export default function LoadingAnimation({
  specificStyle,
  delay = 1000,
  children,
  showReportIssue = true,
  reportIssueDelay = 4000,
}) {
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isTeacherWebsite] = useState(isInTeacherWebsite());

  useEffect(() => {
    // Code from: https://stackoverflow.com/questions/53090432/react-hooks-right-way-to-clear-timeouts-and-intervals
    // Only show the loading if more that 1000ms have passed.
    let loadingTimer = setTimeout(() => setShowLoadingScreen(true), delay);
    let showReportButtonTimer = showReportIssue ? setTimeout(
      () => setShowReportButton(true),
      delay + reportIssueDelay,
    ) : null; // Wait for specified delay to show the link to the FeedbackScreen.
    return () => {
      clearTimeout(loadingTimer);
      if (showReportButtonTimer) {
        clearTimeout(showReportButtonTimer);
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <FeedbackModal
        prefixMsg={"Loading"}
        open={showFeedbackModal}
        setOpen={() => {
          setShowFeedbackModal(!showFeedbackModal);
        }}
        componentCategories={FEEDBACK_OPTIONS.ALL}
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
