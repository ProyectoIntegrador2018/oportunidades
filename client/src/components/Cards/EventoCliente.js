import React, { useState } from "react";

import { IconButton, Link, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import EditarEvento from "../Dialogs/EditarEvento";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import useStyles from "../Cards/styles";

import moment from "moment";
import { deleteEvento } from "../../fetchers/fetcher";

export default function EventoCliente({ evento }) {
  const classes = useStyles();

  // Opciones para mostrar la fecha en string
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // State de los valores
  const [nombre, guardarNombre] = useState(evento.name);
  const [fecha, guardarFecha] = useState(evento.date);
  const [link, guardarLink] = useState(evento.link);
  const [id, guardarId] = useState(evento._id);

  //Validar si link tiene http/https
  if (!/^https?:\/\//i.test(link)) {
    var url = 'https://' + link;
  }
  else{
    url = link;
  }
  // State del modal de editar evento
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleEditClick = () => {
    setModalIsOpen(true);
  };

  // State del modal de confirmación de borrar evento
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const deleteEventoOnConfirm = () => {
    deleteEvento(evento._id)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <EditarEvento
        nombre={nombre}
        fecha={fecha}
        isOpen={modalIsOpen}
        link={link}
        id={id}
        setModalIsOpen={setModalIsOpen}
      />
      <ConfirmDialog
        title="Confirmación"
        open={isConfirmationOpen}
        setOpen={setIsConfirmationOpen}
        onConfirm={deleteEventoOnConfirm}
      >
        ¿Está seguro de que desea borrar el evento?
      </ConfirmDialog>
      <div className={classes.containerEventoControles}>
        <Typography className={classes.itemName}>{nombre}</Typography>
        <IconButton
          aria-label="edit"
          onClick={() => {
            handleEditClick();
          }}
          className={classes.editIcon}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={() => {
            setIsConfirmationOpen(true);
          }}
          className={classes.editIcon}
        >
          <DeleteIcon />
        </IconButton>
      </div>
      <div className={classes.containerEventoDetalles}>
        <div className={classes.containerText}>
          <Typography className={classes.labelText}>Horario:</Typography>
          <Typography className={classes.valueText}>
            {moment.utc(fecha).toDate().toLocaleDateString("es-ES", options)}{" "}
            {moment.utc(fecha).toDate().toLocaleTimeString("en-US")}
          </Typography>
        </div>
        <div className={classes.containerText}>
          <Typography className={classes.labelText}>Link:</Typography>
          <Link href={url} target="_blank">
            {url}
          </Link>
        </div>
      </div>
    </>
  );
}
