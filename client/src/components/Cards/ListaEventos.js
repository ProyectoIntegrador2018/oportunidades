import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from 'axios';

import EventoCliente from "./EventoCliente";
import EventoSocio from "./EventoSocio";
import NuevoEvento from "../Dialogs/NuevoEvento";

const useStyles = makeStyles({
  title: {
    fontSize: 25,
    fontWeight: 800,
    color: '#EE5D36',
    flex: 1,
    marginTop: '1em',
  },
});

export default function ListaEventos({rfp}) {
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
  const [cargando, guardarCargando] = useState('true');

  useEffect(() => {
    // Función que regresa la lista de eventos de la oportunidad
    const obtenerEventos = () => {
      // axios
      //     .get("", config)
      //     .then((res) => {
      //        // guardar lista de eventos de la oportunidad en state
      //        guardarEventos(res.data);
      //        // actualizar variable de control
      //        guardarCargando('false');
      //     })
      //     .catch((error) => {
      //        console.log(error);
      //     })
      var eventosOportunidad = [
        {
          nombre: "Primera reunión",
          fecha: rfp.fechaCita,
          link: "https://www.facebook.com/",
          idEvento: 1
        },
        {
          nombre: "Segunda reunión",
          fecha: rfp.fechaCita,
          link: "https://www.facebook.com/",
          idEvento: 2
        },
      ];
      guardarEventos(eventosOportunidad);
      guardarCargando('false');
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
     />
      <Typography className={classes.title}>
        Eventos
      </Typography>
      {cargando === 'true' ? (<CircularProgress color="primary"/>) : null}
      <div className="container-eventos">
        {eventos.length === 0 ? (<Typography>No hay eventos registrados para esta oportunidad.</Typography>) : null}
        {userType === 'socio' ? (eventos.map(evento => (<EventoSocio key={evento.id} evento={evento} />))) : (eventos.map(evento => (<EventoCliente key={evento.id} evento={evento} />)))}
      </div>
      {userType === 'socio' ? null : <Button type="submit" onClick={() => {handleEditClick()}} variant="contained" className="boton">AGREGAR EVENTO</Button>}
      
    </>
    
  );
}
