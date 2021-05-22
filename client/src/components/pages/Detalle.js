import React, { useState, useEffect } from "react";
import { useMatch } from "react-router-dom";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import RfpCardDetalle from "../Cards/RfpCardDetalle";
import SocioInvolucradoCard from "../Cards/SocioInvolucradoCard";
import RechazarPropuesta from "../Dialogs/RechazarPropuesta";
import {
  obtenerRFP,
  obtenerListaParticipaciones,
} from "../../fetchers/fetcher";
import AceptarPropuesta from "../Dialogs/AceptarPropuesta";
import useStyles from "./styles";

const Inicio = ({ route }) => {
  const classes = useStyles();

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
  // state de control de si el modal de rechazo de socio está abierto
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  // state de control de si el modal de socio ganador está abierto
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
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
    const obtenerEstatusParticipacion = () => {
      axios
        .get("/participacion/get-participaciones-socio", config)
        .then((res) => {
          let isParticipating = false;
          for (const idx in res.data) {
            if (res.data[idx].rfpInvolucrado === match.params.rfp_id) {
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

    if (userType === "admin" || userType == "cliente") {
      obtenerListaParticipaciones(match.params.rfp_id)
        .then((res) => {
          // guardar lista de participaciones en state
          guardarListaParticipaciones(res);
          // actualizar variable de control
          guardarLlamadaParticipaciones(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (userType === "socio") obtenerEstatusParticipacion();
  }, []);

  const handleRechazoSocio = (e, socioName, participacionId, estatus) => {
    e.preventDefault();
    setSocioRechazado({
      name: socioName,
      participacionId: participacionId,
      estatus: estatus,
    });
    setIsRejectModalOpen(true);
  };

  const handleChooseWinner = (e) => {
    e.preventDefault();
    setIsAcceptModalOpen(true);
  };

  const hasValidCandidates = () => {
    let ans = false;
    let hasWinner = false;
    listaParticipaciones.forEach((participation) => {
      if (participation.socioEstatus === "Ganador") hasWinner = true;
      else if (participation.socioEstatus === "Activo") ans = true;
    });
    return !hasWinner && ans;
  };

  return (
    <>
      <SideMenu />
      <Grid container className="container-dashboard-margin"></Grid>
      <Grid container direction="row" className="container-detalle ">
        {!llamadaRFP ? (
          <CircularProgress color="secondary" />
        ) : (
          <RfpCardDetalle
            key={match.params.rfp_id}
            rfp={RFP}
            isParticipating={isParticipating}
          />
        )}
        <RechazarPropuesta
          setIsModalOpen={setIsRejectModalOpen}
          isOpen={isRejectModalOpen}
          opportunityName={RFP.nombreOportunidad}
          socioName={socioRechazado.name}
          participacionId={socioRechazado.participacionId}
        />
        {llamadaParticipaciones ? (
          <AceptarPropuesta
            setIsModalOpen={setIsAcceptModalOpen}
            isOpen={isAcceptModalOpen}
            opportunityName={RFP.nombreOportunidad}
            listaParticipaciones={listaParticipaciones}
          />
        ) : null}
        {userType === "socio" ? null : (
          <Grid container direction="row" className="container-dashboard ">
            {llamadaParticipaciones ? (
              listaParticipaciones.length === 0 ? (
                <Card className="card-mensaje">
                  <Typography>
                    No hay socios involucrados hasta ahora
                  </Typography>
                </Card>
              ) : (
                <Card className="card-mensaje">
                  <Typography className={classes.sectionSubtitle}>Socios involucrados</Typography>
                  {hasValidCandidates() ? (
                    <Button
                      size="small"
                      onClick={(e) => {
                        handleChooseWinner(e);
                      }}
                      variant="contained"
                      className="boton-alt"
                    >
                      SELECCIONAR GANADOR
                    </Button>
                  ) : null}
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
