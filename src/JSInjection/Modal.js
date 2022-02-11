import parse from "html-react-parser";
import Modal from "react-modal";
import './Modal.css';
import {StyledModal} from "./Modal.styles"
export function ModalWithArticle({ title, content, modalIsOpen, setModalIsOpen }) {
  const handleClose = () => {
    setModalIsOpen(false);
  };

  return (
    <Modal isOpen={modalIsOpen} id="myDialog">
        <div className="modal-content">
          <button onClick={handleClose}>X</button>
          <div style={{ width: "95%" }}></div>
          <h1>{title}</h1>
          {parse(content)}
        </div>
    </Modal>
  );
}
