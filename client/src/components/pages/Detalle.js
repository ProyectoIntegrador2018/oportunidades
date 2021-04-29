import React, { useState, useEffect } from "react";
import { useMatch } from "react-router-dom";
import { Card, CircularProgress, Grid, Typography } from "@material-ui/core";
import axios from "axios";
import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import RfpCardDetalle from "../Cards/RfpCardDetalle";
import SocioInvolucradoCard from "../Cards/SocioInvolucradoCard";
import RechazarPropuesta from "../Dialogs/RechazarPropuesta";
import { obtenerRFP } from "../../fetchers/fetcher";

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
  // state de control de si el modal de retroalimentación está abierto
  const [isModalOpen, setIsModalOpen] = useState(false);
  // state con el nombre del socio que esta siendo rechazado
  const [socioRechazado, setSocioRechazado] = useState({});
  // state con el estado de participación
  const [isParticipating, setIsParticipating] = useState(false);

  // Obtener tipo de usuario
  const userType = sessionStorage.getItem("userType");
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
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
    const obtenerEstatusParticipacion = () => {
      axios
        .get("/participacion/get-participaciones-socio", config)
        .then((res) => {
          let isParticipating = false;
          for (const idx in res.data) {
            if(res.data[idx].rfpInvolucrado === match.params.rfp_id) {
              isParticipating = true;
            }
          }
          setIsParticipating(isParticipating);
        });
    };
    obtenerRFP(match.params.rfp_id)
      .then((data) => {
        setRFP(data);
        guardarLlamadaRFP(true);
      })
      .catch((error) => {
        console.log(error);
      });

    if (userType === "admin") obtenerListaInvolucrados();
    if (userType === "cliente") obtenerListaInvolucrados();
    if (userType === "socio") obtenerEstatusParticipacion();
  }, []);

  const handleRechazoSocio = (e, socioName, participacionId, estatus) => {
    e.preventDefault();
    setSocioRechazado({
      name: socioName,
      participacionId: participacionId,
      estatus: estatus,
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <SideMenu />
      <Grid container className="container-dashboard-margin"></Grid>
      <Grid container direction="row" className="container-detalle ">
        {!llamadaRFP ? (
          <CircularProgress color="secondary" />
        ) : (
          <RfpCardDetalle key={match.params.rfp_id} rfp={RFP} isParticipating={isParticipating} />
        )}
        <RechazarPropuesta
          setIsModalOpen={setIsModalOpen}
          isOpen={isModalOpen}
          opportunityName={RFP.nombreOportunidad}
          socioName={socioRechazado.name}
          participacionId={socioRechazado.participacionId}
        />
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
                      handleRechazoSocio={handleRechazoSocio}
                      participacionId={user._id}
                      estatus={user.socioEstatus}
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
