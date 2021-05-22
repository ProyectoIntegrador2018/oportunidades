import React, { useState, useEffect } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from "moment";
import es from "date-fns/locale/es";
registerLocale("es", es);

// Función que redondea una Date hacia arriba, al intervalo de 30 minutos más cercano
const roundUpTime = (date) => {
  if (date.getMinutes() >= 30) {
    date.setHours(date.getHours() + 1, 0, 0, 0);
  } else {
    date.setHours(date.getHours(), 30, 0, 0, 0);
  }
  return date;
};

export default function EditarEvento(params) {
  const [open, setOpen] = React.useState(false);
  const [horaActualRedondeada, guardarHoraActualRedondeada] = React.useState(
    roundUpTime(new Date())
  );
  const [id, guardarId] = React.useState(params.id);
  const [nombre, guardarNombre] = React.useState(params.nombre);
  const [link, guardarLink] = React.useState(params.link);
  const [fecha, guardarFecha] = React.useState(moment(params.fecha).toDate());
  const [excludedTimes, setExcludedTimes] = React.useState([]);

  const classes = useStyles();

  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    params: {
      eventId: id,
    },
  };

  useEffect(() => {
    updateExcludedTimes();

    setOpen(params.isOpen);
  }, [params]);

  const handleClose = () => {
    params.setModalIsOpen(false);
    setOpen(false);
  };
  // TODO: Refactor to fetchers
  const handleSave = () => {
    axios
      .patch(
        "/events/" + params.id,
        {
          name: nombre,
          date: fecha,
          link: link,
        },
        config
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => {
        if (error.message.includes("409")) {
          updateExcludedTimes();
        }
        console.log(error);
      });
  };

  const updateExcludedTimes = () => {
    axios
      .get(
        "/events/get-occupied-event-times/" +
          horaActualRedondeada.toISOString(),
        config
      )
      .then((res) => {
        const occupiedTimes = res.data.occupiedTimes.map((elem) => {
          return new Date(elem);
        });

        setExcludedTimes(occupiedTimes);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isExcludedDate = () => {
    return (
      fecha < new Date() ||
      excludedTimes.some((elem) => elem.getTime() === fecha.getTime())
    );
  };

  const isSendDisabled = () => {
    return nombre.length < 1 || link.length < 1 || isExcludedDate();
  };

  const calculateMinTime = () => {
    // Si la fecha seleccionada es hoy, deshabilitar horarios anteriores a la hora actual
    const now = new Date();
    if (now.getDate() === fecha.getDate()) {
      return now;
    } else {
      return now.setHours(0, 0, 0, 0);
    }
  };

  const dateMinTime = calculateMinTime();

  const excludedTimesInSelectedDay = excludedTimes.filter((date) => {
    return date.getDate() === fecha.getDate();
  });

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth={true}
        scroll="paper"
      >
        <DialogTitle disableTypography className={classes.header}>
          <Typography className={classes.title}>Editar Evento</Typography>
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
          <div className="mb-0">
            <FormLabel className="mb-1">
              Selecciona la fecha de la siguiente reunión
            </FormLabel>
          </div>
          <div className="mb-0">
            <DatePicker
              showTimeSelect
              selected={fecha}
              onChange={(date) => guardarFecha(date)}
              excludeTimes={excludedTimesInSelectedDay}
              minDate={dateMinTime}
              minTime={dateMinTime}
              maxTime={new Date(new Date().setHours(23, 59, 0, 0))}
              dateFormat="dd/MM/yyyy h:mm aa"
              timeFormat="h:mm aa"
              timeCaption="Hora"
              locale="es"
            />
          </div>
          <div>
            {isExcludedDate() ? (
              <p className="error-titulo-rojo">
                El horario seleccionado no está disponible
              </p>
            ) : null}
          </div>
          <div className="mb-0">
            <TextField
              id="nombre"
              className={classes.textField}
              label="Nombre"
              margin="dense"
              fullWidth
              defaultValue={nombre}
              onChange={(event) => guardarNombre(event.target.value)}
            />
            <TextField
              id="link"
              className={classes.textField}
              label="Link"
              margin="normal"
              fullWidth
              defaultValue={link}
              onChange={(event) => guardarLink(event.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleSave}
            disabled={isSendDisabled()}
            className="boton"
          >
            GUARDAR CAMBIOS
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
