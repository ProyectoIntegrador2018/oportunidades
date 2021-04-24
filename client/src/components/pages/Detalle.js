import React, { useState, useEffect } from "react";
import { useMatch } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import axios from "axios";
import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import RfpCardDetalle from "../Cards/RfpCardDetalle";
import SocioInvolucradoCard from "../Cards/SocioInvolucradoCard";

const Inicio = ({ route }) => {
  let match = useMatch("/detalle/:rfp_id");
  // state de RFP
  const [RFP, setRFP] = useState({});
  // state de lista de participaciones de socio en RFPs
  const [listaParticipaciones, guardarListaParticipaciones] = useState([]);
  // state de control de si ya se hizo la llamada de participaciones a la base de datos
  const [llamadaParticipaciones, guardarLlamadaParticipaciones] = useState(
    false
  );
  // state de control de si ya se hizo la llamada de RFP a la base de datos
  const [llamadaRFP, guardarLlamadaRFP] = useState(false);

  // Obtener tipo de usuario
  const userType = sessionStorage.getItem("userType");
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
    const obtenerListaInvolucrados = () => {
      axios
        .get(
          "/participacion/get-participaciones-rfp/" + match.params.rfp_id,
          config
        )
        .then((res) => {
          // guardar lista de participaciones en state
          guardarListaParticipaciones(res.data);
          // actualizar variable de control
          guardarLlamadaParticipaciones(true);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    obtenerRFP();
    if (userType === "admin") obtenerListaInvolucrados();
    if (userType === "cliente") obtenerListaInvolucrados();
  }, []);
  return (
    <>
      <SideMenu />
      <Grid container className="container-dashboard-margin"></Grid>
      <Grid container direction="row" className="container-detalle ">
        {!llamadaRFP ? (
          <CircularProgress color="secondary" />
        ) : (
          <RfpCardDetalle key={match.params.rfp_id} rfp={RFP} />
        )}
        {userType === "socio" ? null : (
          <Grid container direction="row" className="container-dashboard ">
            {llamadaParticipaciones ? (
              listaParticipaciones.length === 0 ? (
                <Card className="cardNoHaySocios">
                  <Typography>
                    No hay socios involucrados hasta ahora
                  </Typography>
                </Card>
              ) : (
                <Card className="cardHaySocios">
                  <Typography>Socios involucrados:</Typography>
                </Card>
              )
            ) : null}
            <Grid container direction="row" className="container-dashboard ">
              {userType === "socio"
                ? null
                : listaParticipaciones.map((user) => (
                    <SocioInvolucradoCard
                      key={user.socioInvolucrado}
                      user={user.socioInvolucrado}
                    />
                  ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Inicio;
