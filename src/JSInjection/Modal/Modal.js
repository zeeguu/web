import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { StyledModal, StyledButton } from "./Modal.styles";

import InteractiveText from "../../zeeguu-react/src/reader/InteractiveText";
import { TranslatableText } from "../../zeeguu-react/src/reader/TranslatableText";

export function Modal({ title, content, modalIsOpen, setModalIsOpen, api }) {
  const handleClose = () => {
    location.reload();
    setModalIsOpen(false);
  };

  const [interactiveText, setInteractiveText] = useState();
  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(false);

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
        <h1>{title}</h1>
        <TranslatableText
          interactiveText={interactiveText}
          translating={translating}
          pronouncing={pronouncing}
        />
      </StyledModal>
    </div>
  );
}
