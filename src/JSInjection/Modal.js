import parse from "html-react-parser";
import Modal from "react-modal";

import './Modal.css';
import {StyledModal} from "./Modal.styles"
export function ModalWithArticle({ title, content, modalIsOpen, setModalIsOpen }) {
  const handleClose = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
    <StyledModal isOpen={modalIsOpen} overlayClassName="Overlay">
          <button onClick={handleClose} id="qtClose">X</button>
          <h1>{title}</h1>
          {parse(content)}
    </StyledModal>
    </div>
  );
}
