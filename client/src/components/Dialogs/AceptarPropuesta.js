import React, { useState, useEffect } from "react";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";

import { actualizarEstatusSocio, obtenerSocio } from "../../fetchers/fetcher";

export default function AceptarPropuesta(props) {
  const [reason, setReason] = useState("");
  const [markedSure, setMarkedSure] = useState(false);
  const [participacionWinnerId, setParticipacionWinnerId] = useState("");
  const [listaSocioParticipacion, setListaSocioParticipacion] = useState({});

  const classes = useStyles();

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
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle disableTypography className={classes.header}>
          <Typography className={classes.title}>
            Aceptar Propuesta de Socio
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
              <Typography className={classes.labelText}>
                Nombre de la Oportunidad:
              </Typography>
              <Typography className={classes.valueText}>
                {props.opportunityName}
              </Typography>
            </div>
            <div className={classes.containerText}>
              <Typography className={classes.labelText}>
                Nombre del Socio Ganador:
              </Typography>
              <FormControl className={classes.valueText}>
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
