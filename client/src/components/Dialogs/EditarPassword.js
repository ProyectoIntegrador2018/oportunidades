import React, { useState, useEffect } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";
import useStyles from "./styles";

import axios from "axios";

export default function EditarPassword(params) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  useEffect(() => {
    if (password !== passwordConfirmation) {
      setButtonEnabled(false);
    } else if (password === "" || passwordConfirmation === "") {
      setButtonEnabled(false);
    } else {
      setButtonEnabled(true);
    }
  }, [password, passwordConfirmation]);

  const handleClose = () => {
    params.setModalIsOpen(false);
    setOpen(false);
  };
  // TODO: Refactor to fetchers
  const handleSave = () => {
    axios
      .patch(
        "/user/change-password",
        {
          password,
        },
        config
      )
      .then((res) => {
        setSnackbarOpen(true);
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePassword1Change = (val) => {
    setPassword(val);
  };
  const handlePassword2Change = (val) => {
    setPasswordConfirmation(val);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success" onClose={handleCloseSnackbar}>
          Contraseña cambiada satisfactoriamente.
        </Alert>
      </Snackbar>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle disableTypography className={classes.header}>
          <Typography className={classes.title}>Cambiar Contraseña</Typography>
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
            id="password1"
            className={classes.textField}
            label="Nueva contraseña"
            margin="normal"
            fullWidth
            defaultValue={password}
            onChange={(event) => handlePassword1Change(event.target.value)}
            type="password"
          />
          <TextField
            id="password2"
            className={classes.textField}
            label="Confirma tu nueva contraseña"
            margin="normal"
            fullWidth
            defaultValue={passwordConfirmation}
            onChange={(event) => handlePassword2Change(event.target.value)}
            type="password"
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleSave}
            disabled={!buttonEnabled}
            className="boton"
          >
            GUARDAR CAMBIOS
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
