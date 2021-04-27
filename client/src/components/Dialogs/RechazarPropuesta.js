import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { actualizarEstatusSocio } from "../../fetchers/fetcher";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  labeledTextContainer: {
    display: "flex",
    flexDirection: "row",
  },
  boldLabel: {
    fontSize: 16,
    fontWeight: 700,
  },
  labeledInfoText: {
    fontSize: 16,
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function RechazarPropuesta(props) {
  const [reason, setReason] = useState("");
  const [markedSure, setMarkedSure] = useState(false);

  const handleClose = () => {
    props.setIsModalOpen(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    actualizarEstatusSocio(props.participacionId, "Rechazado", reason);
  };

  const onReasonChange = (e) => {
    setReason(e.target.value);
    // TODO: Add updates to the character count if we choose to
  };

  const onConfirmToggle = (e) => {
    setMarkedSure(e.target.checked);
  };

  const isSendDisabled = () => {
    return reason.length < 1 || !markedSure;
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.isOpen}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Rechazar Propuesta de Socio
        </DialogTitle>
        <DialogContent dividers>
          <FormGroup>
            <div style={{ display: "flex" }}>
              <Typography
                style={{ fontSize: 16, fontWeight: 700, marginRight: "0.5em" }}
              >
                Nombre de la Oportunidad:
              </Typography>
              <Typography style={{ fontSize: 16 }}>
                {props.opportunityName}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography
                style={{ fontSize: 16, fontWeight: 700, marginRight: "0.5em" }}
              >
                Nombre del Socio:
              </Typography>
              <Typography style={{ fontSize: 16 }}>
                {props.socioName}
              </Typography>
            </div>
            <TextField
              label="Retroalimentación"
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
              fullWidth
              value={reason}
              onChange={onReasonChange}
            />
            <FormControlLabel
              control={
                <Checkbox checked={markedSure} onChange={onConfirmToggle} />
              }
              label="Estoy seguro de que quiero rechazar la propuesta de este socio"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleSend}
            color="primary"
            disabled={isSendDisabled()}
          >
            MANDAR RETROALIMENTACIÓN
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
