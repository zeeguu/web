import * as s from "./FeedbackButtons.sc.js";
import { Link } from "react-router-dom";
import strings from "../i18n/definitions";
import { useState } from "react";

const buttons = [
  { name: "Too Easy", value: "too_easy" },
  { name: "Too Hard", value: "too_hard" },
  { name: "Bad example", value: "not_a_good_example" },
  { name: "Bad word", value: "bad_word" },
  { name: "Other", value: "other" },
];
export default function FeedbackButtons({ show, setShow, feedbackFunction }) {
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");

  function toggleShow() {
    setShow(!show);
  }

  function buttonClick(value) {
    if (value !== "other") {
      feedbackFunction(value);
    } else {
      setShowInput(true);
    }
  }

  function handleChange(event) {
    setInput(event.target.value);
  }

  function handleSubmit(event) {
    let re1 = /[.,'´`?!:;]/g;
    let re2 = /\s{2,}/g;
    const newFeedback = input
      .toLowerCase()
      .trim()
      .replace(re1, "")
      .replace(re2, "")
      .replaceAll(" ", "_");
    feedbackFunction(newFeedback);
    event.preventDefault();
  }

  return (
    <div>
      <s.FeedbackLinkHolder>
        <Link to={"#"} className="discrete-link" onClick={toggleShow}>
          {strings.giveFeedback}
        </Link>
      </s.FeedbackLinkHolder>

      {show && (
        <s.FeedbackButtonsHolder>
          {buttons.map((each) => (
            <button key={each.value} onClick={() => buttonClick(each.value)}>
              {each.name}
            </button>
          ))}
          {showInput && (
            <form onSubmit={handleSubmit}>
              <label>
                Other feedback:
                <input type="text" value={input} onChange={handleChange} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          )}
        </s.FeedbackButtonsHolder>
      )}
    </div>
  );
}
