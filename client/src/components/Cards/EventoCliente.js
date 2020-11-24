import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Link} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import moment from 'moment';

import EditarEvento from "../Dialogs/EditarEvento";
import ConfirmDialog from "../Dialogs/ConfirmDialog";

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

export default function EventoCliente({evento}) {
  const config = {
    headers: {
       Authorization: "Bearer " + sessionStorage.getItem("token"),
       "Content-Type": "application/json",
    },
 };

  const classes = useStyles();

  // Opciones para mostrar la fecha en string
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  // hook para redireccionar
  const navigate = useNavigate();

  // State de los valores
  const [nombre, guardarNombre] = useState(evento.name);
  const [fecha, guardarFecha] = useState(evento.date);
  const [link, guardarLink] = useState(evento.link);
  const [id, guardarId] = useState(evento._id);

  // State del modal de editar evento
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleEditClick = () => {
    setModalIsOpen(true);
 };

 // State del modal de confirmación de borrar evento
 const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

 

  const deleteEvento = () => {    
    console.log(evento._id);
    axios.delete("/events/" + evento._id, config)
      .then((response) => {
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
        title="¿Está seguro de que desea borrar el evento?"
        open={isConfirmationOpen}
        setOpen={setIsConfirmationOpen}
        onConfirm={deleteEvento}
      />
      <div className="container-evento">
        <Typography className={classes.estatus}>
          {nombre}
          <IconButton aria-label="edit" onClick={() => {handleEditClick()}}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => {setIsConfirmationOpen(true);}}>
            <DeleteIcon />
          </IconButton>
        </Typography>
        <Typography>
          {moment.utc(fecha).toDate().toLocaleDateString('es-ES', options)}
          {' '}
          {moment.utc(fecha).toDate().toLocaleTimeString('en-US')}
        </Typography>
        <Link href={link} target="_blank">
          {link}
        </Link>
        {/* <Button type="submit" onClick={() => {handleEditClick()}} variant="contained" className="boton">EDITAR EVENTO</Button> */}
        {/* {modalShow ? <ModalEvento show={modalShow}/> : null} */}
        {/* <ModalEvento onClose={modalShow} show={modalShow} /> */}
      </div>
      
    </>
    
  );
}
