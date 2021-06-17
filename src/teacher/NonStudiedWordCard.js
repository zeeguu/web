import strings from "../i18n/definitions";

const NonStudiedWordCard = ({ word }) => {
  const exclusionReason = () => {
    if (word.fit_for_study === null) {
      return (
        <p style={{ margin: ".5em 0 0 1.2em", fontSize: "small", color: "red" }}>
          {strings.excludedByAlgorithm}
        </p>
      );
    }
    return (
      <p
        style={{
          margin: ".5em 0 0 1.2em",
          fontSize: "small",
          color: "#808080",
        }}
      >
        {strings.scheduledNotYetStudied}
      </p>
    );
  };

  return (
    <div
      style={{
        borderLeft: "solid 3px #5492b3",
        marginBottom: "38px",
        minWidth: 270,
        userSelect: "none",
      }}
    >
      <p
        style={{
          color: "#44cdff",
          marginBottom: "-15px",
          marginTop: "0px",
          marginLeft: "1em",
        }}
      >
        {word.translation.toLowerCase()}
      </p>
      <p style={{ marginLeft: "1em", marginRight: "1em", marginBottom: "-5px" }}>
        <b>{word.word}</b>
      </p>
      {exclusionReason(word)}
    </div>
  );
};
export default NonStudiedWordCard;
