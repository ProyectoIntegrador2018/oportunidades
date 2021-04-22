import React, { useState, useEffect } from "react";
import { useMatch } from "react-router-dom";
import { Grid, CircularProgress } from "@material-ui/core";

import axios from "axios";
import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import MisOportunidadesCardDetalle from "../Cards/MisOportunidadesCardDetalle";

const Inicio = ({ route }) => {
  let match = useMatch("/detalle-mi-oportunidad/:rfp_id");
  // state de RFP
  const [RFP, setRFP] = useState({});
  // state de control de si ya se hizo la llamada de RFP a la base de datos
  const [llamadaRFP, guardarLlamadaRFP] = useState(false);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };
    const obtenerRFP = () => {
      axios
        .get("/RFP/get-one-rfp/" + match.params.rfp_id, config)
        .then((res) => {
          setRFP(res.data);
          guardarLlamadaRFP(true);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    obtenerRFP();
  }, []);

  // Obtener tipo de usuario
  const userType = sessionStorage.getItem("userType");

  return (
    <>
      <SideMenu />
      <Grid container className="container-dashboard-margin"></Grid>
      <Grid container direction="row" className="container-detalle ">
        {!llamadaRFP ? (
          <CircularProgress color="secondary" />
        ) : (
          <MisOportunidadesCardDetalle key={match.params.rfp_id} rfp={RFP} />
        )}
      </Grid>
    </>
  );
};

export default Inicio;
