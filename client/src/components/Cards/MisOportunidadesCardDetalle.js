import React, { useState } from "react";
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
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import useStyles from "../Cards/styles";

import axios from "axios";

export default function SimpleCard({ rfp }) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  const classes = useStyles();

  // hook para redireccionar
  const navigate = useNavigate();

  // Obtener tipo de usuario
  const userType = sessionStorage.getItem("userType");

  // TODO: Refactor to fetchers
  const handleClick = () => {
    rfp.participandoActual = true;
    axios
      .post(
        "/participacion/create-participacion",
        {
          rfpInvolucrado: rfp._id,
        },
        config
      )
      .then((res) => {
        //window.location.reload();
        navigate("/mis-oportunidades");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // TODO: Refactor to fetchers
  const handleDejarDeParticipar = () => {
    rfp.participandoActual = false;
    axios
      .get("/participacion/get-participaciones-socio", config)
      .then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].rfpInvolucrado == rfp._id) {
            // TODO: Refactor to fetchers
            axios
              .delete(
                "/participacion/delete-participacion-socio/" + res.data[i]._id,
                config
              )
              .then((response) => {
                //window.location.reload();
                navigate("/mis-oportunidades");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <ConfirmDialog
        title="Confirmación"
        open={isConfirmationOpen}
        setOpen={setIsConfirmationOpen}
        onConfirm={handleDejarDeParticipar}
      >
        ¿Está seguro de que desea dejar de participar? Esta acción no se puede
        revertir
      </ConfirmDialog>
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
              <Typography className={classes.valueText}>
                {rfp.estatus}
              </Typography>
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
                      setIsConfirmationOpen(true);
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
    </>
  );
}
