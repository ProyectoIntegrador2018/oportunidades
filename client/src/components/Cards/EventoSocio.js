import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Link} from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles({
  title: {
    fontSize: 25,
    fontWeight: 800,
    color: '#EE5D36',
    flex: 1,
  },
  estatus: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'left',
    marginRight: '0.5em',
    color: '#EE5D36',
  },
});

export default function EventoSocio({evento}) {
  const config = {
    headers: {
       Authorization: "Bearer " + sessionStorage.getItem("token"),
       "Content-Type": "application/json",
    },
 };

  const classes = useStyles();

  // Opciones para mostrar la fecha en string
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <>
      <div className="container-evento">
        <Typography className={classes.estatus}>
          {evento.nombre}
        </Typography>
        <Typography>
          {moment.utc(evento.fecha).toDate().toLocaleDateString('es-ES', options)}
          {' '}
          {moment.utc(evento.fecha).toDate().toLocaleTimeString('en-US')}
        </Typography>
        <Link href={evento.link} target="_blank">
          {evento.link}
        </Link>
      </div>
    </>
  );
}
