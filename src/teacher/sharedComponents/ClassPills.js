import { Link } from "react-router-dom";
import * as s from "../styledComponents/ClassPills.sc";

const NOT_SHARED = "Not shared with any class";

/**
 * The classes a text is shared with, as pills -- one rendering for both places
 * a teacher meets them.
 *
 * What the name does is the caller's to say: on My Texts it filters the list
 * down to that class, in the editor it opens the class. The trailing x and the
 * dashed + are optional, because the editor changes its sharing in a dialog.
 */
export default function ClassPills({
  classes,
  onSelectClass,
  classLink,
  onRemove,
  removingId,
  onAdd,
  emptyText = NOT_SHARED,
}) {
  const addLabel = classes.length === 0 ? "+ Share" : "+";

  return (
    <s.Pills>
      {classes.length === 0 && emptyText && <s.NotShared>{emptyText}</s.NotShared>}
      {classes.map((cohort) => (
        <ClassPill
          key={cohort.id}
          cohort={cohort}
          onSelectClass={onSelectClass}
          classLink={classLink}
          onRemove={onRemove}
          isRemoveDisabled={removingId !== null && removingId !== undefined}
        />
      ))}
      {onAdd && (
        <s.AddPill type="button" onClick={onAdd}>
          {addLabel}
        </s.AddPill>
      )}
    </s.Pills>
  );
}

function ClassPill({ cohort, onSelectClass, classLink, onRemove, isRemoveDisabled }) {
  const asLink = classLink && {
    as: Link,
    to: classLink(cohort),
  };
  const asFilter = onSelectClass && {
    as: "button",
    type: "button",
    "aria-label": `Show only texts shared with ${cohort.name}`,
    onClick: () => onSelectClass(cohort),
  };
  const labelProps = asLink || asFilter;

  return (
    <s.Pill $hasRemove={!!onRemove}>
      {labelProps ? <s.PillLabel {...labelProps}>{cohort.name}</s.PillLabel> : cohort.name}
      {onRemove && (
        <s.PillRemove
          type="button"
          aria-label={`Stop sharing with ${cohort.name}`}
          disabled={isRemoveDisabled}
          onClick={() => onRemove(cohort)}
        >
          ×
        </s.PillRemove>
      )}
    </s.Pill>
  );
}
