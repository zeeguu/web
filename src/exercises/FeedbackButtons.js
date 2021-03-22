import * as s from "./FeedbackButtons.sc.js";
import { Link } from "react-router-dom";

const buttons = [
  { name: "Too Easy", value: "too_easy" },
  { name: "Too Hard", value: "too_hard" },
  { name: "Bad example", value: "not_a_good_example" },
  { name: "Bad word", value: "bad_word" },
  { name: "Other", value: "dont_show_it_to_me_again" },
];
export default function FeedbackButtons({ show, setShow, feedbackFunction }) {
  function toggleShow() {
    setShow(!show);
  }
  return (
    <div>
      <s.FeedbackLinkHolder>
        <Link to={"#"} className="discrete-link" onClick={toggleShow}>
          Feedback on this Exercise
        </Link>
      </s.FeedbackLinkHolder>

      {show && (
        <s.FeedbackButtonsHolder>
          {buttons.map((each) => (
            <button
              key={each.value}
              onClick={() => feedbackFunction(each.value)}
            >
              {each.name}
            </button>
          ))}
        </s.FeedbackButtonsHolder>
      )}
    </div>
  );
}
