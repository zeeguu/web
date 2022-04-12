import { EXTENSION_SOURCE } from "../constants";

export default function sendFeedbackEmail(api, feedback, url, articleId) {
  let sendFeedback = {
    message: feedback,
    context: "url is: " + url + " and articleId is: " + articleId,
  };

  api.sendFeedback(sendFeedback, (result_dict) => {
    if (result_dict === "OK") {
      console.log("Feedback sent successfully");
    } else {
      console.log("Something went wrong");
    }
  });
}
