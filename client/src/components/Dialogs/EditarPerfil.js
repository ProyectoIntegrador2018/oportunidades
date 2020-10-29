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
import Axios from "axios";
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
   title: {
      
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

export default function EditarPerfil(params) {
   const [open, setOpen] = React.useState(false);
   const [name, setName] = React.useState(params.userName);
   const [email, setEmail] = React.useState(params.userEmail);
   const [empresa, setEmpresa] = React.useState(params.userEmpresa);
   const [telefono, setTelefono] = React.useState(params.userTelefono);

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
      Axios.patch("/user/", {
         name,
         email,
         empresa,
         telefono
      }, config).then(res => {
         window.location.reload();
      }).catch(error => {
         console.log(error);
      })
   };

   return (
      <div>
         <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
         >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
               Editar Perfil
            </DialogTitle>
            <DialogContent dividers>
               <TextField
                  id="email"
                  className={styles.textField}
                  label="Email"
                  margin="normal"
                  fullWidth
                  defaultValue={email}
                  onChange={(event) => setEmail(event.target.value)}
               />
               <TextField
                  id="nombre"
                  className={styles.textField}
                  label="Nombre"
                  margin="normal"
                  fullWidth
                  defaultValue={name}
                  onChange={(event) => setName(event.target.value)}
               />
               <TextField
                  id="empresa"
                  className={styles.textField}
                  label="Empresa"
                  margin="normal"
                  fullWidth
                  defaultValue={empresa}
                  onChange={(event) => setEmpresa(event.target.value)}
               />
               <TextField
                  id="telefono"
                  className={styles.textField}
                  label="Teléfono"
                  margin="normal"
                  fullWidth
                  defaultValue={telefono}
                  onChange={(event) => setTelefono(event.target.value)}
               />
            </DialogContent>
            <DialogActions>
               <Button autoFocus onClick={handleSave} color="primary">
                  Save changes
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
