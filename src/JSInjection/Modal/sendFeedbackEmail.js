export default function sendFeedbackEmail(api, feedback, url, articleId) {
  if (articleId === "" || articleId === undefined) {
    articleId = "articleId is undefined";
  }

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
