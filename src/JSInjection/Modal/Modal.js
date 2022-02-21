import { useEffect, useState } from "react";
import { StyledModal, StyledButton } from "./Modal.styles";
import InteractiveText from "./reader/InteractiveText";
import { TranslatableText } from "./reader/TranslatableText";
import { parse } from "query-string";

export function Modal({ title, content, modalIsOpen, setModalIsOpen, api }) {
  const handleClose = () => {
    location.reload();
    setModalIsOpen(false);
  };

  const [interactiveText, setInteractiveText] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();
  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(false);
  const [contentArray, setContentArray] = useState();

  useEffect(() => {
    let articleInfo = {
      url: "http://test.it/articleurl",
      content: "This is content",
      id: "11833417",
      title: title,
      language: "da",
      starred: true,
    };

    let it = new InteractiveText(content, articleInfo, api);
    setInteractiveText(it);
    let itTitle = new InteractiveText(title, articleInfo, api);
    setInteractiveTitle(itTitle);
    const arr = [content];
    setContentArray(arr);
  }, []);

  return (
    <div>
      <StyledModal
        isOpen={modalIsOpen}
        className="Modal"
        overlayClassName="Overlay"
      >
        <StyledButton onClick={handleClose} id="qtClose">
          X
        </StyledButton>
        <h1>
          <TranslatableText
            interactiveText={interactiveTitle}
            translating={translating}
            pronouncing={pronouncing}
          />
        </h1>
        <TranslatableText
          interactiveText={interactiveText}
          translating={translating}
          pronouncing={pronouncing}
        />
        {/* {contentArray.forEach(element => {
          if (element )
        });} */}
      </StyledModal>
    </div>
  );
}
