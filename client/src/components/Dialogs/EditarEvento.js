import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import DatePicker from "react-datepicker";
import {FormLabel} from '@material-ui/core';
import "react-datepicker/dist/react-datepicker.css";
import Axios from "axios";
import moment from 'moment';

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
   textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
   },
   fechaDiv: {
      height: 200,
      margin: theme.spacing(2),
   },
   title: {
      
   },
   marginBott: {
      marginBottom: theme.spacing(1),
   }
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

const DialogContent = withStyles((theme) => ({
   root: {
      padding: theme.spacing(2),
   },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
   root: {
      margin: 0,
      padding: theme.spacing(1),
   },
}))(MuiDialogActions);

 // Función para date picker
 let handleColor = time => {
   return time.getHours() > 12 ? "text-success" : "text-error";
 };

export default function EditarEvento(params) {
   const [open, setOpen] = React.useState(false);
   const [nombre, guardarNombre] = React.useState(params.nombre);
   const [fecha, guardarFecha] = React.useState(moment(params.fecha).toDate());
   const [link, guardarLink] = React.useState(params.link);
   const [id, guardarId] = React.useState(params.id);

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
   const handleSave = () => {
      // Axios.patch("/user/", {
      //    name,
      //    email,
      //    empresa,
      //    telefono
      // }, config).then(res => {
      //    window.location.reload();
      // }).catch(error => {
      //    console.log(error);
      // })
      window.location.reload();
   };

   return (
      <div>
         <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth='md'
            fullWidth={true}
            scroll="paper"
         >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
               Editar Evento
            </DialogTitle>
            <DialogContent dividers>
               <div className="mb-0">
                  <FormLabel className="mb-1">Selecciona la fecha de la siguiente reunión</FormLabel>
               </div>
               <DatePicker
                    showTimeSelect
                    selected={fecha}
                    onChange={fecha => guardarFecha(fecha)}
                    timeClassName={handleColor}
                    minDate={new Date()}
                    //timeIntervals="15"
                    locale="es"
                    title="Selecciona un horario"
               />
               <TextField
                  id="nombre"
                  className={styles.textField}
                  label="Nombre"
                  margin="normal"
                  fullWidth
                  defaultValue={nombre}
                  onChange={(event) => guardarNombre(event.target.value)}
               />
               <TextField
                  id="link"
                  className={[styles.textField, styles.marginBott]}
                  label="Link"
                  margin="normal"
                  fullWidth
                  defaultValue={link}
                  onChange={(event) => guardarLink(event.target.value)}
               />
               <div className="mb-4">  </div>
            </DialogContent>
            <DialogActions >
               <Button autoFocus onClick={handleSave} color="primary">
                  GUARDAR CAMBIOS
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
