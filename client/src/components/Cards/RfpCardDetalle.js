import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Input,
  Link
} from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import FabEditRFPFlex from "../ui/FabEditRFPFlex";
import ListaEventos from "./ListaEventos";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import useStyles from "../Cards/styles";

import axios from "axios";
import moment from "moment";
import { obtenerParticipacion, obtenerFileNamesParticipaciones, getBase64File, deleteFile, isSocioBanned } from "../../fetchers/fetcher";

export default function SimpleCard({ rfp, isParticipating }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [isBanned, setIsBanned] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  // maximum allowed file size in MB
  const MAX_FILE_SIZE = 10;

  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
    params: {
      rfpInvolucrado: rfp._id,
    },
  };

  useEffect(() => {
    if (userType === "socio") {
      isSocioBanned(rfp._id)
        .then((data) => {
          setIsBanned(data);
        })
        .catch((error) => {
          console.log(error);
        });

      obtenerParticipacion(rfp._id)
        .then((participacion) => {
          obtenerFileNamesParticipaciones(participacion._id)
            .then((filenames) => {
              console.log('filenames', filenames);
              setFiles(filenames);
              console.log('files', files);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  // On file upload (click the upload button)
  const onFileUpload = () => {
    const formData = new FormData();

    formData.append(
      "file",
      selectedFile,
      selectedFile.name,
      selectedFile.originalname
    );

    axios
      .post("/participacion/upload-file", formData, config)
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isFileOverSizeLimit = () => {
    // selectedFile.size is in bytes, MAX_FILE_SIZE is in MB
    return (selectedFile && selectedFile.size / 1024 / 1024 > MAX_FILE_SIZE);
  }

  const downloadFile = (filename, originalname) => {
    getBase64File(filename)
      .then((fileData) => {
        const linkSource = `data:${fileData.contentType};base64,${fileData.base64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = originalname;
        downloadLink.click();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleDeleteFile = (filename) => {
    deleteFile(filename)
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
        navigate("/inicio");
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
                navigate("/inicio");
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
              <Typography className={classes.valueText}>
                {rfp.estatus}
              </Typography>
            </div>
            {rfp.causa !== "" ? (
              <div className={classes.containerText}>
                <Typography className={classes.labelText}>
                  Causa de estatus cerrado:
                </Typography>
                <Typography className={classes.valueText}>
                  {rfp.causa}
                </Typography>
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
              <div>
                <form>
                  <Typography className={classes.sectionSubtitle}>
                    Carga de Archivos:
                  </Typography>
                  <div className={classes.containerText}>
                    <Input
                      type="file"
                      onChange={(event) => setSelectedFile(event.target.files[0])}
                    />
                    <Button className="boton" disabled={!selectedFile || isFileOverSizeLimit()} onClick={onFileUpload}>
                      SUBIR ARCHIVO
                    </Button>
                  </div>
                </form>
                <div className={classes.containerText}>
                    {isFileOverSizeLimit() ? (
                      <Typography className="error-titulo-rojo-medium">
                        El archivo seleccionado pesa más del límite permitido de {MAX_FILE_SIZE} MB para archivos
                      </Typography>
                    ) : null}
                  </div>
                <div className={classes.containerColumnText}>
                  <Typography className={classes.labelText}>
                    Archivos subidos:
                  </Typography>
                  {files.map((file, index) => {
                    return (
                      <div key={"div" + index}>
                        <Link key={"link" + index} onClick={() => downloadFile(file.name, file.originalname)}>{file.originalname}</Link>
                        <Button key={"button" + index} className="boton" onClick={() => handleDeleteFile(file.name)}>
                          BORRAR
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </CardContent>
          <CardActions>
            <div className={classes.contenedorBotones}>
              {userType === "socio" && !isBanned ? (
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
