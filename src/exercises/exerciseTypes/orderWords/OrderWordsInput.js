import * as sOW from "./ExerciseTypeOW.sc.js";

function OrderWordsInput({
  buttonOptions,
  notifyChoiceSelection,
  isCorrect,
  setIsCorrect,
  isWordSoup,
  onDragStartHandle,
  onDragOverHandle,
  onDragLeaveHandle,
  onTouchStartHandle,
  onTouchMoveHandle,
}) {
  if (isWordSoup) {
    return (
      <sOW.ItemRowCompactWrap className="ItemRowCompactWrap">
        {buttonOptions.length > 0 &&
          buttonOptions.map((word) => (
            <sOW.OrangeItemCompact
              onDragStart={(e) => onDragStartHandle(e, word.id)}
              onTouchStart={(e) => onTouchStartHandle(e, word.id)}
              onTouchMove={(e) => onTouchMoveHandle(e)}
              key={word.id}
              draggable={isCorrect ? false : true}
              status={word.inUse}
              className={
                word.inUse ? word.status + " elementHidden" : word.status
              }
              onClick={() => notifyChoiceSelection(word.id, word.inUse)}
            >
              {word.word}
            </sOW.OrangeItemCompact>
          ))}
      </sOW.ItemRowCompactWrap>
    );
  } else {
    return (
      <sOW.ItemRowCompactWrapConstruct className="ItemRowCompactWrapConstruct">
        {buttonOptions.length > 0 &&
          buttonOptions.map((word, i) => (
            <sOW.OrangeItemCompactConstruct
              onDragStart={(e) => onDragStartHandle(e, i)}
              onDragOver={(e) => onDragOverHandle(e, i)}
              onDragLeave={(e) => onDragLeaveHandle(e, i)}
              onTouchStart={(e) => onTouchStartHandle(e, i)}
              onTouchMove={(e) => onTouchMoveHandle(e)}
              key={word.id}
              draggable={isCorrect ? false : true}
              title={word.feedback}
              status={word.status}
              className={word.status}
              onClick={() => notifyChoiceSelection(word.id, word.inUse)}
            >
              {word.word}
            </sOW.OrangeItemCompactConstruct>
          ))}
      </sOW.ItemRowCompactWrapConstruct>
    );
  }
}

export default OrderWordsInput;
