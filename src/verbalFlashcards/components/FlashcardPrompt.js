import strings from "../../i18n/definitions";
import * as s from "../verbalFlashcards_Styled/VerbalFlashcards.sc.js";

export default function FlashcardPrompt({ card }) {
  return (
    <s.PromptSection>
      <s.PromptLabel>{strings.verbalFlashcardsSayThis}</s.PromptLabel>
      <s.PromptText>{card.prompt}</s.PromptText>
    </s.PromptSection>
  );
}
