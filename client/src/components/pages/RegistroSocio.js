import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import RegistroSocioCard from "../Cards/RegistroSocioCard";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const RegistroSocio = () => {
  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isSnackbarErrorOpen, setIsSnackbarErrorOpen] = useState(false);

  // hook para redireccionar
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSnackbarOpen(false);
    setIsSnackbarErrorOpen(false);
  };

  return (
    <>
      <SideMenu />
      <Grid container className="container-dashboard-margin" />
      <Grid container direction="row" className="container-detalle ">
        <RegistroSocioCard
          setIsSnackbarOpen={setIsSnackbarOpen}
          setIsSnackbarErrorOpen={setIsSnackbarErrorOpen}
        />
      </Grid>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={1000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Usuario creado correctamente.
        </Alert>
      </Snackbar>

      <Snackbar
        open={isSnackbarErrorOpen}
        autoHideDuration={1500}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          Hubo un error al registrar el usuario.
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegistroSocio;
