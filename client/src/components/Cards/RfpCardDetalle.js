import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Input,
} from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import FabEditRFPFlex from "../ui/FabEditRFPFlex";
import ListaEventos from "./ListaEventos";
import useStyles from "../Cards/styles";

import moment from "moment";
import { dejarDeParticipar, socioUpdateFile } from "../../fetchers/fetcher";

export default function SimpleCard({ rfp, isParticipating }) {
  const [selectedFile, setSelectedFile] = useState(null);

  // On file upload (click the upload button)
  const onFileUpload = () => {
    const formData = new FormData();

    formData.append(
      "file",
      selectedFile,
      selectedFile.name,
      selectedFile.originalname
    );

    socioUpdateFile(formData)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const classes = useStyles();

  // Opciones para mostrar la fecha en string
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // hook para redireccionar
  const navigate = useNavigate();

  // Obtener tipo de usuario
  const userType = sessionStorage.getItem("userType");

  const handleClick = () => {
    rfp.participandoActual = true;
    createParticipacion(rfp._id)
      .then(() => {
        navigate("/inicio");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDejarDeParticipar = () => {
    rfp.participandoActual = false;
    dejarDeParticipar()
      .then(() => {
        navigate("/inicio");
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
              navigate("/inicio");
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
          {rfp.causa !== "" ? (
            <div className={classes.containerText}>
              <Typography className={classes.labelText}>
                Causa de estatus cerrado:
              </Typography>
              <Typography className={classes.valueText}>{rfp.causa}</Typography>
            </div>
          ) : null}
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
              Fecha de la siguiente reunión:
            </Typography>
            <Typography className={classes.valueText}>
              {moment
                .utc(rfp.fechaCita)
                .toDate()
                .toLocaleDateString("es-ES", options)}{" "}
              {moment.utc(rfp.fechaCita).toDate().toLocaleTimeString("en-US")}
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
          {userType === "socio" ? null : (
            <ListaEventos key={rfp._id} rfp={rfp} />
          )}
          {userType === "socio" && isParticipating ? (
            <form>
              <Typography className={classes.sectionSubtitle}>
                Carga de Archivos:
              </Typography>
              <div className={classes.containerText}>
                <Input
                  type="file"
                  onChange={(event) => setSelectedFile(event.target.files[0])}
                />
                <Button className="boton" onClick={onFileUpload}>
                  SUBIR ARCHIVO
                </Button>
              </div>
            </form>
          ) : null}
        </CardContent>
        <CardActions>
          <div className={classes.contenedorBotones}>
            {userType === "socio" ? (
              !isParticipating ? (
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
