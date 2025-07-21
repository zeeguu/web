import {
  FEEDBACK_CODES,
  FEEDBACK_CODES_NAME,
} from "../../../src/components/FeedbackConstants";
import { EXTENSION_SOURCE } from "../constants";
/**
 * @param {ZeeguuAPI} api
 * @param {String} feedback
 * @param {String} url
 * @param {int} articleId
 * @param {String} feedbackType
 * @returns {boolean} if the feedback is sucessfuly sent to the api
 */

export default function sendFeedbackEmail(
  api,
  feedback,
  url,
  articleId,
  feedbackType,
  confirmSuccess
) {
  let feedbackInfo = feedback + " and url is:" + url;
  let feedbackForDB = feedbackType + feedbackInfo.replace(/ /g, "_");

  try {
    api.logUserActivity(
      api.EXTENSION_FEEDBACK,
      articleId ? articleId : "",
      feedbackForDB,
      EXTENSION_SOURCE
    );

    let feedbackForEmail = {
      message: feedback + `, article id: ${articleId}`,
      currentUrl: url,
      feedbackComponentId: FEEDBACK_CODES_NAME.EXTENSION,
    };
    api.sendFeedback(
      feedbackForEmail,
      (result_dict) => {
        // console.log("Feedback sent successfully");
        if (confirmSuccess)
          if (result_dict === "OK") confirmSuccess(true);
          else confirmSuccess(false);
      },
      (error) => {
        // console.log("Something went wrong.");
        console.error("Error sending feedback:", error);
        if (confirmSuccess) confirmSuccess(false);
      }
    );
  } catch (error) {
    // console.log("Wasn't able to send feedback, error ocurred.");
    console.error(error);
    if (confirmSuccess) confirmSuccess(false);
  }
}
