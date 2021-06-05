import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import FabEditRFPFlex from "../ui/FabEditRFPFlex";
import useStyles from "../Cards/styles";

import { createParticipacion, dejarDeParticipar } from "../../fetchers/fetcher";

export default function SimpleCard({ rfp }) {
  const classes = useStyles();

  // hook para redireccionar
  const navigate = useNavigate();

  // Obtener tipo de usuario
  const userType = sessionStorage.getItem("userType");

  const handleClick = () => {
    rfp.participandoActual = true;
    createParticipacion(rfp._id)
      .then(() => {
        navigate("/mis-oportunidades");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDejarDeParticipar = () => {
    rfp.participandoActual = false;
    dejarDeParticipar(rfp._id)
      .then(() => {
        navigate("/mis-oportunidades");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={classes.cardRfpDetalle}>
      <Card className={classes.root}>
        <div className={classes.containerHeader}>
          <KeyboardArrowLeft
            className={classes.backIcon}
            onClick={() => {
              navigate("/mis-oportunidades");
            }}
          />
          {userType === "socio" ? null : <FabEditRFPFlex rfp={rfp} />}
        </div>
        <CardContent>
          <Typography className={classes.largeTitle}>
            {rfp.nombreOportunidad}
          </Typography>
          <Typography className={classes.description} gutterBottom>
            {rfp.descripcionProblematica}
          </Typography>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>Estatus:</Typography>
            <Typography className={classes.valueText}>{rfp.estatus}</Typography>
          </div>
          <div className={classes.containerColumnText}>
            <Typography className={classes.labelText}>
              Objetivo de la oportunidad:
            </Typography>
            <Typography className={classes.valueText}>
              {rfp.objetivoOportunidad}
            </Typography>
          </div>
          <div className={classes.containerColumnText}>
            <Typography className={classes.labelText}>
              Descripción funcional de la oportunidad:
            </Typography>
            <Typography className={classes.valueText}>
              {rfp.descripcionFuncional}
            </Typography>
          </div>
          <div className={classes.containerColumnText}>
            <Typography className={classes.labelText}>
              Requerimientos obligatorios:
            </Typography>
            <Typography className={classes.valueText}>
              {rfp.requerimientosObligatorios}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              Fechas relevantes:
            </Typography>
            <Typography className={classes.valueText}>
              {rfp.fechasRelevantes}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              ¿Ha sido aprobada por el área usuaria?
            </Typography>
            <Typography className={classes.valueText}>
              {rfp.aprobadaAreaUsuario}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              ¿Ha sido aprobada por el área de TI?
            </Typography>
            <Typography className={classes.valueText}>
              {rfp.aprobadaAreaTI}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              ¿Tiene un presupuesto asignado?
            </Typography>
            <Typography className={classes.valueText}>
              {rfp.presupuestoAsignado}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              Tipo general del proyecto:
            </Typography>
            <Typography className={classes.valueText}>
              {rfp.tipoGeneralProyecto}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              Tipo específico del proyecto:
            </Typography>
            <Typography className={classes.valueText}>
              {rfp.tipoEspecificoProyecto}
            </Typography>
          </div>
          {rfp.comentariosAdicionales === "" ? null : (
            <div className={classes.containerColumnText}>
              <Typography className={classes.labelText}>
                Comentarios adicionales:
              </Typography>
              <Typography className={classes.valueText}>
                {rfp.comentariosAdicionales}
              </Typography>
            </div>
          )}
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>
              Feha de la primer reunión:
            </Typography>
            <Typography className={classes.valueText}>
              {rfp.fechaCita}
            </Typography>
          </div>
          <Typography className={classes.sectionSubtitle}>
            Datos de contacto
          </Typography>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>Nombre:</Typography>
            <Typography className={classes.valueText}>
              {rfp.nombrecliente}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>Posición:</Typography>
            <Typography className={classes.valueText}>
              {rfp.posicioncliente}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <div className={classes.contenedorBotones}>
            {userType === "socio" ? (
              rfp.participandoActual == false ? (
                <Button
                  type="submit"
                  onClick={() => {
                    handleClick();
                  }}
                  variant="contained"
                  className="boton"
                >
                  PARTICIPAR
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={() => {
                    handleDejarDeParticipar();
                  }}
                  variant="contained"
                  className="boton"
                >
                  DEJAR DE PARTICIPAR
                </Button>
              )
            ) : null}
          </div>
        </CardActions>
      </Card>
    </div>
  );
}
