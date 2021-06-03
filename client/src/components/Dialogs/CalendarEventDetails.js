import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";

export default function CalendarEventDetails(params) {
  const classes = useStyles();

//Validar si link tiene http/https
  if (!/^https?:\/\//i.test(params.selectedEventLink)) {
    var url = 'https://' + params.selectedEventLink;
  }
  else{
    url = params.selectedEventLink;
  }

  return (
    <div>
      <Dialog
        open={params.isModalOpen}
        onClose={params.closeModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle disableTypography className={classes.header}>
          <Typography className={classes.title}>Detalles del Evento</Typography>
          {params.closeModal ? (
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={params.closeModal}
              color="inherit"
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              Nombre de la Oportunidad:
            </Typography>
            <Typography className={classes.valueText}>
              {params.selectedEventOpportunityName}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              Nombre del Evento:
            </Typography>
            <Typography className={classes.valueText}>
              {params.selectedEventName}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              Fecha:
            </Typography>
            <Typography className={classes.valueText}>
              {params.selectedEventDate}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              Hora:
            </Typography>
            <Typography className={classes.valueText}>
              {params.selectedEventTime}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              Liga del Evento:
            </Typography>
            <a className={classes.valueText} href={url}>
              {url}
            </a>
          </div>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={params.closeModal} className="boton">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
