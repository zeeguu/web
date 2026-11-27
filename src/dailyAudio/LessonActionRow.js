import styled from "styled-components";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import strings from "../i18n/definitions";
import { shareLessonLink } from "./shareLessonLink";

// The lesson's actions, in the player, on today's lesson and on an opened past
// lesson alike: show its dialogue (useLessonDialogue, whose text goes under the
// player) and share it. Two matching buttons on one row.
export default function LessonActionRow({ api, lesson, dialogue }) {
  if (!lesson?.lesson_id) return null;
  return (
    <ActionRow>
      {dialogue.available && (
        <ActionButton
          type="button"
          aria-expanded={dialogue.shown}
          aria-busy={dialogue.loading}
          onClick={dialogue.toggle}
        >
          <ChatBubbleOutlineRoundedIcon style={{ fontSize: "1rem" }} />
          {dialogue.shown ? strings.hideTheDialogue : strings.showTheDialogue}
        </ActionButton>
      )}
      <ActionButton
        type="button"
        onClick={() => shareLessonLink(api, lesson.lesson_id, lesson.title, lesson.share_uuid)}
      >
        <IosShareRoundedIcon style={{ fontSize: "1rem" }} />
        Share
      </ActionButton>
    </ActionRow>
  );
}

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 4px;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 4px 6px;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
`;
