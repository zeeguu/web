import * as s from "../Exercise.sc";

function OrderWordsInput({
  buttonOptions,
  notifyChoiceSelection,
  incorrectAnswer,
  setIncorrectAnswer,
}) {
    console.log("In Order Word input");
    console.log(buttonOptions);
  return (
    <s.ItemRowCompactWrap className="ItemRowCompactWrap">
    {buttonOptions.length > 0 && buttonOptions.map(word => <s.OrangeItemCompact
       key={word.id} 
       status={word.inUse}
       className={word.inUse ? word.status + " greyOut" : word.status } 
       onClick={() => notifyChoiceSelection(word.id, word.inUse)}>
       {word.word} 
      </s.OrangeItemCompact>)}
    </s.ItemRowCompactWrap>
  );
}


export default OrderWordsInput;
