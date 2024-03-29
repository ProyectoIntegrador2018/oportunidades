import React, { useEffect, useState } from "react";

import {
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@material-ui/core";
import EventoCliente from "./EventoCliente";
import EventoSocio from "./EventoSocio";
import NuevoEvento from "../Dialogs/NuevoEvento";
import useStyles from "../Cards/styles";

import axios from "axios";

export default function ListaEventos({ rfp }) {
  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  const classes = useStyles();

  // Obtener tipo de usuario
  const userType = sessionStorage.getItem("userType");

  // State para la lista de los eventos
  const [eventos, guardarEventos] = useState([]);
  const [cargando, guardarCargando] = useState("true");

  useEffect(() => {
    // Función que regresa la lista de eventos de la oportunidad
    // TODO: Refactor to fetchers
    const obtenerEventos = () => {
      axios
        .get("/events/get-rfp-events/" + rfp._id, config)
        .then((res) => {
          // guardar lista de eventos de la oportunidad en state
          guardarEventos(res.data.events);
          // actualizar variable de control
          guardarCargando("false");
        })
        .catch((error) => {
          console.log(error);
        });
      guardarCargando("false");
    };
    obtenerEventos();
  }, []);

  // State del modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleEditClick = () => {
    setModalIsOpen(true);
  };

  return (
    <>
      <NuevoEvento
        isOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        rfp={rfp._id}
      />
      <Typography className={classes.sectionSubtitle}>Eventos</Typography>
      {cargando === "true" ? <CircularProgress color="primary" /> : null}
      <div className={classes.containerEventos}>
        {eventos.length === 0 ? (
          <Typography>
            No hay eventos registrados para esta oportunidad.
          </Typography>
        ) : null}
        {userType === "socio"
          ? eventos.map((evento, idx) => (
              <div key={idx}>
                <EventoSocio key={evento._id} evento={evento} />
                <Divider key={idx} className={classes.divider} />
              </div>
            ))
          : eventos.map((evento, idx) => (
              <div key={idx} style={{ width: "100%" }}>
                <EventoCliente key={evento._id} evento={evento} />
                <Divider key={idx} className={classes.divider} />
              </div>
            ))}
      </div>
      {userType === "socio" ? null : (
        <Button
          type="submit"
          onClick={() => {
            handleEditClick();
          }}
          variant="contained"
          className="boton"
        >
          AGREGAR EVENTO
        </Button>
      )}
    </>
  );
}
