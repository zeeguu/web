const WordsDropDown = ({headline, words}) => {
  return (
    <div
      style={{
        padding: 20,
        width: "95%",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
        borderRadius: "10px",
      }}
    >   
      <h3 style={{color:"#5492b3"}}>{headline}</h3>
      {words.map((word)=> <p>{word}</p>)}
    </div>
  );
};
export default WordsDropDown;
