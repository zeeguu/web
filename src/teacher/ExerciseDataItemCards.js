import { MdExpandLess, MdExpandMore } from "react-icons/md";
import strings from "../i18n/definitions";

const ExerciseDataItemCard = (props) => {
  const setBorderColor = props.isOpen ? "#5492b3" : "#44cdff";
  return (
    <div
      style={{
        height: 300,
        width: "310px",
        margin: "2em 1em",
        paddingTop: "1em",
        textAlign: "center",
        borderRadius: "15px",
        border: `solid 5px ${setBorderColor}`,
      }}
    >
      <h3 style={{ fontSize: "large" }}>{props.headline}</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "90%",
          marginLeft: "5%",
          minHeight: "141px",
        }}
      >
        {props.children}
      </div>
      {!props.isOpen ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "1.2em",
          }}
        >
          <p style={{ fontWeight: 600, width: "4.5em", fontSize: "small" }}>
            {strings.viewMoreBtn}
          </p>
          <MdExpandMore
            style={{ marginTop: "-.5em", fontSize: "45px", color: "#5492b3" }}
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "1.2em",
          }}
        >
          <p style={{ fontWeight: 600, width: "4.3em", fontSize: "small" }}>
            {strings.viewLessBtn}
          </p>
          <MdExpandLess
            style={{ marginTop: "-.5em", fontSize: "45px", color: "#5492b3" }}
          />
        </div>
      )}
    </div>
  );
};

export default ExerciseDataItemCard;
