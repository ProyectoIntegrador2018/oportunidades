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
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
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

export default function EditarPassword(params) {
   const [open, setOpen] = React.useState(false);
   const [password, setPassword] = React.useState('');
   const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
   const [buttonEnabled, setButtonEnabled] = React.useState(false);
   const [snackbarOpen, setSnackbarOpen] = React.useState(false);

   const config = {
      headers: {
         Authorization: "Bearer " + sessionStorage.getItem("token"),
         "Content-Type": "application/json",
      },
   };
   
   useEffect(() => {
      setOpen(params.isOpen);
   }, [params]);

   useEffect(() => {
      if(password !== passwordConfirmation) {
         setButtonEnabled(false);
      } else if(password === '' || passwordConfirmation === '') {
         setButtonEnabled(false);
      } else {
         setButtonEnabled(true)
      }
   }, [password, passwordConfirmation])

   const handleClose = () => {
      params.setModalIsOpen(false);
      setOpen(false);
   };
   const handleSave = () => {
      Axios.patch("/user/change-password", {
         password
      }, config).then(res => {
         setSnackbarOpen(true);
         handleClose();
      }).catch(error => {
         console.log(error);
      })
   };

   const handlePassword1Change = (val) => {
      setPassword(val);
   }
   const handlePassword2Change = (val) => {
      setPasswordConfirmation(val);
   }

   const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
         return;
      }

      setSnackbarOpen(false);
   };

   return (
      <div>
         <Snackbar open={snackbarOpen} autoHideDuration={2500} onClose={handleCloseSnackbar}>
            <Alert severity="success" onClose={handleCloseSnackbar}>
               Contraseña cambiada satisfactoriamente.
            </Alert>
         </Snackbar>
         <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
         >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
               Cambiar contraseña
            </DialogTitle>
            <DialogContent dividers>
               <TextField
                  id="password1"
                  className={styles.textField}
                  label="Nueva contraseña"
                  margin="normal"
                  fullWidth
                  defaultValue={password}
                  onChange={(event) => handlePassword1Change(event.target.value)}
                  type="password"
               />
               <TextField
                  id="password2"
                  className={styles.textField}
                  label="Confirma tu nueva contraseña"
                  margin="normal"
                  fullWidth
                  defaultValue={passwordConfirmation}
                  onChange={(event) => handlePassword2Change(event.target.value)}
                  type="password"
               />
               
            </DialogContent>
            <DialogActions>
               <Button autoFocus onClick={handleSave} color="primary" disabled={!buttonEnabled}>
                  GUARDAR CAMBIOS
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
