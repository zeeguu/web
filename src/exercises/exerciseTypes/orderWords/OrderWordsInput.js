import * as sOW from "./ExerciseTypeOW.sc.js"

function OrderWordsInput({
  buttonOptions,
  notifyChoiceSelection,
  incorrectAnswer,
  setIncorrectAnswer,
  isWordSoup,
  onDragStartHandle,
  onDragEnterHandle,
  onDragLeaveHandle,
}) {

  if (isWordSoup) {
    return (
      <sOW.ItemRowCompactWrap className="ItemRowCompactWrap">
      {buttonOptions.length > 0 && buttonOptions.map(word => <sOW.OrangeItemCompact
         key={word.id} 
         status={word.inUse}
         className={word.inUse ? word.status + " greyOut" : word.status } 
         onClick={() => notifyChoiceSelection(word.id, word.inUse)}>
         {word.word} 
        </sOW.OrangeItemCompact>)}
      </sOW.ItemRowCompactWrap>
    );
  }
  else{
    return (
      <sOW.ItemRowCompactWrapConstruct className="ItemRowCompactWrapConstruct">
      {buttonOptions.length > 0 && buttonOptions.map((word, i) => <sOW.OrangeItemCompactConstruct
        onDragStart={(e) => onDragStartHandle(e, i)}
        onDragEnter={(e) => onDragEnterHandle(e, i)}
        onDragLeave={(e) => onDragLeaveHandle(e, i)}
         key={word.id}
         draggable 
         title={word.feedback}
         status={word.status}
         className={word.status} 
         onClick={() => notifyChoiceSelection(word.id, word.inUse)}>
         {word.word}
        </sOW.OrangeItemCompactConstruct>)}
      </sOW.ItemRowCompactWrapConstruct>
    );
  }

}


export default OrderWordsInput;
