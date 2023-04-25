import * as s from "../Exercise.sc";

function OrderWordsConstruct({
  buttonOptions,
  notifyChoiceSelection,
  incorrectAnswer,
  setIncorrectAnswer,
}) {
  if (buttonOptions.length > 0){
    console.log(buttonOptions[0].title !== "");
  }
  
  return (
    <s.ItemRowCompactWrapConstruct className="ItemRowCompactWrapConstruct">
    {buttonOptions.length > 0 && buttonOptions.map(word => <s.OrangeItemCompactConstruct
       key={word.id} 
       title={word.feedback}
       status={word.status}
       className={word.status} 
       onClick={() => notifyChoiceSelection(word.id, word.inUse)}>
       {word.word}
       {(word.feedback !== "") && (
        <span className="feedbackText">{word.feedback}</span>
       )}
      </s.OrangeItemCompactConstruct>)}
    </s.ItemRowCompactWrapConstruct>
  );
}


export default OrderWordsConstruct;
