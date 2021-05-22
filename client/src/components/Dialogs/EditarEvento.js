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

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from "moment";

// Función para date picker
let handleColor = (time) => {
  return time.getHours() > 12 ? "text-success" : "text-error";
};

export default function EditarEvento(params) {
  const [open, setOpen] = useState(false);
  const [nombre, guardarNombre] = useState(params.nombre);
  const [fecha, guardarFecha] = useState(moment(params.fecha).toDate());
  const [link, guardarLink] = useState(params.link);

  const classes = useStyles();

  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
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
        console.log(error);
      });
  };

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
          <DatePicker
            showTimeSelect
            selected={fecha}
            onChange={(fecha) => guardarFecha(fecha)}
            timeClassName={handleColor}
            minDate={new Date()}
            locale="es"
            title="Selecciona un horario"
          />
          <TextField
            id="nombre"
            className={classes.textField}
            label="Nombre"
            margin="normal"
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
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave} className="boton">
            GUARDAR CAMBIOS
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
