import React, { useState } from "react";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";

import { actualizarEstatusSocio } from "../../fetchers/fetcher";

export default function RechazarPropuesta(props) {
  const [reason, setReason] = useState("");
  const [markedSure, setMarkedSure] = useState(false);

  const classes = useStyles();

  const handleClose = () => {
    props.setIsModalOpen(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    actualizarEstatusSocio(props.participacionId, "Rechazado", reason);
    window.location.reload();
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
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle disableTypography className={classes.header}>
          <Typography className={classes.title}>
            Rechazar Propuesta de Socio
          </Typography>
          {handleClose ? (
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
              color="inherit"
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent dividers>
          <FormGroup>
            <div className={classes.containerText}>
              <Typography className={classes.labelText} >
                Nombre de la Oportunidad:
              </Typography>
              <Typography className={classes.valueText}>
                {props.opportunityName}
              </Typography>
            </div>
            <div className={classes.containerText}>
              <Typography className={classes.labelText} >
                Nombre del Socio:
              </Typography>
              <Typography className={classes.valueText}>
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
            className="boton"
            disabled={isSendDisabled()}
          >
            MANDAR RETROALIMENTACIÓN
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
