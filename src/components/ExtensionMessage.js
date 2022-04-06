import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import * as s from "../words/WordEdit.sc"


export default function ExtensionMessage({handleClose, open}) {

  return (
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={s.style}>
      <p>No extension installed</p>
    </Box>
  </Modal>

  );
}
