import * as s from "../Exercise.sc";

function OrderWordsInput({
  buttonOptions,
  notifyChoiceSelection,
  incorrectAnswer,
  setIncorrectAnswer,
  isWordSoup,
}) {

  if (isWordSoup) {
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
  else{
    return (
      <s.ItemRowCompactWrapConstruct className="ItemRowCompactWrapConstruct">
      {buttonOptions.length > 0 && buttonOptions.map(word => <s.OrangeItemCompactConstruct
         key={word.id} 
         title={word.feedback}
         status={word.status}
         className={word.status} 
         onClick={() => notifyChoiceSelection(word.id, word.inUse)}>
         {word.word}
        </s.OrangeItemCompactConstruct>)}
      </s.ItemRowCompactWrapConstruct>
    );
  }

}


export default OrderWordsInput;
