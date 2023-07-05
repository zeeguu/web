import React, { useState } from "react";
import * as s from "./OwnInterestModal.sc";
import * as sc from "../Content.sc";

const recommendations = ["Art", "Business", "Culture"];

const OwnInterestModal = ({ modalOpened, setModalOpened }) => {
  const [activeRecs, setActiveRecs] = useState([]);
  const [customInterest, setCustomInterest] = useState("");

  const handleActiveRecs = (rec) => {
    if (activeRecs.includes(rec)) {
      const newRecs = activeRecs.filter((activeRec) => activeRec !== rec);

      setActiveRecs(newRecs);
    } else {
      setActiveRecs((prev) => [...prev, rec]);
    }
  };

  const handleInterestsSave = () => {
    // ModalOpened could be false, 'interests', 'non-interests'
    // Function to add activeRecs to searchers;
  };

  return (
    <s.Modal>
      <s.Top>
        <s.Title>Adding your own interest</s.Title>
        <s.Close aria-label="close" onClick={() => setModalOpened(false)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41L17.59 5Z"
              fill="#414141"
            />
          </svg>
        </s.Close>
      </s.Top>
      <s.Recs>
        <s.TitleS>Recommendations:</s.TitleS>
        <s.RecsRow>
          {recommendations.map((rec) => (
            <sc.AddInterestBtn
              key={rec}
              variants={activeRecs.includes(rec) && "active"}
              onClick={() => handleActiveRecs(rec)}
            >
              <sc.Plus>
                <span></span>
                <span></span>
              </sc.Plus>
              {rec}
            </sc.AddInterestBtn>
          ))}
        </s.RecsRow>
      </s.Recs>
      <s.Creation>
        <s.TitleS>Add manually:</s.TitleS>
        <p>Interest</p>
        <s.Input
          type="text"
          name="own-interest"
          placeholder="Animals"
          value={customInterest}
          onChange={(evt) => setCustomInterest(evt.target.value)}
        />
      </s.Creation>
      <s.Bottom>
        <s.SaveButton onClick={handleInterestsSave}>Save</s.SaveButton>
        <s.CancelButton onClick={() => setModalOpened(false)}>
          Cancel
        </s.CancelButton>
      </s.Bottom>
    </s.Modal>
  );
};

export default OwnInterestModal;
