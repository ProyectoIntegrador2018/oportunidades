import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import useStyles from "./styles";

const ConfirmDialog = (props) => {
  const { title, children, open, setOpen, onConfirm } = props;

  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle className={classes.header}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions className={classes.contenedorBotones}>
        <Button
          variant="contained"
          onClick={() => setOpen(false)}
          className="boton-alt"
        >
          No
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
          className="boton"
        >
          Sí
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
