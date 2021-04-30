import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { actualizarEstatusSocio, obtenerSocio } from "../../fetchers/fetcher";

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

export default function AceptarPropuesta(props) {
  const [reason, setReason] = useState("");
  const [markedSure, setMarkedSure] = useState(false);
  const [participacionWinnerId, setParticipacionWinnerId] = useState("");
  const [listaSocioParticipacion, setListaSocioParticipacion] = useState({});

  useEffect(() => {
    props.listaParticipaciones.forEach((participacion) => {
      obtenerSocio(participacion.socioInvolucrado).then((res) => {
        if (participacion.socioEstatus === "Activo") {
          const newSocio = {
            [participacion._id]: res.name,
          };
          setListaSocioParticipacion((prev) => {
            return { ...prev, ...newSocio };
          });
          setParticipacionWinnerId(participacion._id);
        }
      });
    });
  }, []);

  const handleClose = () => {
    props.setIsModalOpen(false);
  };

  const handleChangeWinner = (e) => {
    e.preventDefault();
    setParticipacionWinnerId(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    actualizarEstatusSocio(participacionWinnerId, "Ganador", reason);
    Object.keys(listaSocioParticipacion).forEach((participation_id) => {
      if (participation_id !== participacionWinnerId) {
        // TODO: What would be the default feedback?
        actualizarEstatusSocio(participation_id, "Rechazado", "");
      }
    });
    window.location.reload();
  };

  const onReasonChange = (e) => {
    setReason(e.target.value);
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
          Aceptar Propuesta de Socio
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
                Nombre del Socio Ganador:
              </Typography>
              <FormControl>
                <Select
                  value={participacionWinnerId}
                  onChange={handleChangeWinner}
                >
                  {Object.keys(listaSocioParticipacion).map(
                    (participacionId) => {
                      return (
                        <MenuItem value={participacionId} key={participacionId}>
                          {listaSocioParticipacion[participacionId]}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              </FormControl>
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
              label="Estoy seguro de que quiero aceptar la propuesta de este socio y rechazar las del resto de los participantes"
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
