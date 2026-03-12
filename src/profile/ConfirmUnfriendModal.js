import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function ConfirmUnfriendModal({ open, onClose, onConfirm, friendName }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Unfriend</DialogTitle>
      <DialogContent>
        Are you sure you want to unfriend <b>{friendName}</b>?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Unfriend
        </Button>
      </DialogActions>
    </Dialog>
  );
}
