import { MdExpandMore } from "react-icons/md";

const ExerciseDataItemCard = (props) => {
  return (
    <div
      style={{
        height: 300,
        width: "90%",
        margin: "2em 1em",
        paddingTop: "1em",
        textAlign: "center",
        borderRadius: "15px",
        border: "solid 5px #44cdff",
      }}
    >
      <h3>{props.headline}</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "90%",
          marginLeft: "5%",
          minHeight:"141px",
        }}
      >
        {props.children}
      </div>
      <div style={{display:"flex", flexDirection:"column", alignItems:"center", marginTop: "1.2em"}}>
        <p style={{fontWeight:600, width:"4.5em", fontSize:"small"}}>View more</p>
        <MdExpandMore style={{ marginTop: "-.5em", fontSize:"45px", color: "#5492b3"}}/>
      </div>
    </div>
  );
};

export default ExerciseDataItemCard;
