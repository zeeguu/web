import * as s from "./Interests.sc";
import * as b from "../components/allButtons.sc";

export default function InterestsAndSearch() {
  return (
    <s.Interests>
      <img
        src="/static/icons/topic-arrow.svg"
        alt="topic-arrow"
        style={{
          userSelect: "none",
          position: "absolute",
          left: 0,
          top: "15px",
          transform: "rotate(180deg)",
        }}
      />
      <img
        src="/static/icons/topic-arrow.svg"
        alt="topic-arrow"
        style={{
          userSelect: "none",
          position: "absolute",
          right: 0,
          top: "15px",
        }}
      />
      <s.ScrollContainer>
        <b.OrangeRoundButton
          className="filled-interest-btn"
          //onClick={() => toggleInterests()}
        >
          Business
        </b.OrangeRoundButton>

        <b.OrangeRoundButton
          className="unfilled-interest-btn"
          //onClick={() => toggleFilters()}
        >
          Culture
        </b.OrangeRoundButton>

        <b.OrangeRoundButton
          className="filled-interest-btn"
          //onClick={() => toggleInterests()}
        >
          Business
        </b.OrangeRoundButton>

        <b.OrangeRoundButton
          className="unfilled-interest-btn"
          //onClick={() => toggleFilters()}
        >
          Culture
        </b.OrangeRoundButton>

        <b.OrangeRoundButton
          className="filled-interest-btn"
          //onClick={() => toggleInterests()}
        >
          Business
        </b.OrangeRoundButton>

        <b.OrangeRoundButton
          className="unfilled-interest-btn"
          //onClick={() => toggleFilters()}
        >
          Culture
        </b.OrangeRoundButton>

        <b.OrangeRoundButton
          className="filled-interest-btn"
          //onClick={() => toggleInterests()}
        >
          Business
        </b.OrangeRoundButton>

        <b.OrangeRoundButton
          className="unfilled-interest-btn"
          //onClick={() => toggleFilters()}
        >
          Culture
        </b.OrangeRoundButton>

        <b.OrangeRoundButton
          className="filled-interest-btn"
          //onClick={() => toggleInterests()}
        >
          Business
        </b.OrangeRoundButton>

        <b.OrangeRoundButton
          id="part1"
          className="unfilled-interest-btn"
          //onClick={() => toggleFilters()}
        >
          Culture
        </b.OrangeRoundButton>
      </s.ScrollContainer>
    </s.Interests>
  );
}
