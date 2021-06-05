import React, { useState, useEffect } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";

import { updateUser } from "../../fetchers/fetcher";

export default function EditarPerfil(params) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(params.userName);
  const [email, setEmail] = useState(params.userEmail);
  const [empresa, setEmpresa] = useState(params.userEmpresa);
  const [telefono, setTelefono] = useState(params.userTelefono);

  const classes = useStyles();

  useEffect(() => {
    setOpen(params.isOpen);
  }, [params]);

  const handleClose = () => {
    params.setModalIsOpen(false);
    setOpen(false);
  };

  const handleSave = () => {
    updateUser({
      name,
      email,
      empresa,
      telefono,
    })
      .then(() => {
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
        fullWidth
      >
        <DialogTitle disableTypography className={classes.header}>
          <Typography className={classes.title}>Editar Perfil</Typography>
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
          <TextField
            id="email"
            className={classes.textField}
            label="Email"
            margin="normal"
            fullWidth
            defaultValue={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            id="nombre"
            className={classes.textField}
            label="Nombre"
            margin="normal"
            fullWidth
            defaultValue={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            id="empresa"
            className={classes.textField}
            label="Empresa"
            margin="normal"
            fullWidth
            defaultValue={empresa}
            onChange={(event) => setEmpresa(event.target.value)}
          />
          <TextField
            id="telefono"
            className={classes.textField}
            label="Teléfono"
            margin="normal"
            fullWidth
            defaultValue={telefono}
            onChange={(event) => setTelefono(event.target.value)}
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
