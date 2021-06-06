import React, { useState, useEffect } from "react";

import { Button, Card, CardContent, Typography, Link } from "@material-ui/core";
import useStyles from "../Cards/styles";

import { obtenerSocio, obtenerFileNamesParticipaciones, getBase64File } from "../../fetchers/fetcher";

export default function SimpleCard({
  user,
  participacionId,
  estatus,
  handleRechazoSocio,
}) {
  const classes = useStyles();

  const [socioData, setSocioData] = useState({
    nombre: "",
    email: "",
    empresa: "",
  });
  const [files, setFiles] = useState([]);

  // Obtener tipo de usuario
  const userType = sessionStorage.getItem("userType");

  useEffect(() => {
    if (userType === "admin" || userType === "cliente") {
      obtenerSocio(user)
        .then((data) => {
          setSocioData({
            nombre: data.name,
            email: data.email,
            empresa: data.empresa,
          });
        })
        .catch((error) => {
          console.log(error);
        });
        
      obtenerFileNamesParticipaciones(participacionId)
        .then((filenames) =>{
          setFiles(filenames);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

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

  return (
    <div className="rfp-card">
      <Card className={classes.socioInvolucradoCard}>
        <CardContent>
          <Typography className={classes.itemName}>
            {socioData.nombre}
          </Typography>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>Email:</Typography>
            <Typography className={classes.valueText}>
              {socioData.email}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>Empresa:</Typography>
            <Typography className={classes.valueText}>
              {socioData.empresa}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>Estatus:</Typography>
            <Typography className={classes.valueText}>{estatus}</Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>Archivos:</Typography>
          </div>
            {files.map((file, index) => {
              return (
                <div>
                  <Link key={index} className={classes.valueText} onClick={() => downloadFile(file.name, file.originalname)}>{file.originalname}</Link>
                </div>
              )
            })}
          {estatus === "Activo" && (
            <Button
              size="small"
              onClick={(e) => {
                handleRechazoSocio(
                  e,
                  socioData.nombre,
                  participacionId,
                  estatus
                );
              }}
              variant="contained"
              className="boton-alt"
            >
              RECHAZAR PROPUESTA
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
