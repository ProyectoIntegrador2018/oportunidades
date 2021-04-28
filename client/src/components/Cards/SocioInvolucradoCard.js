import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { obtenerListaInvolucrados } from "../../fetchers/fetcher";

const useStyles = makeStyles({
  title: {
    fontSize: 20,
    fontWeight: 800,
    color: "#EE5D36",
  },
  estatus: {
    fontSize: 18,
    fontWeight: 800,
    textAlign: "left",
    marginRight: "1em",
  },
  texto: {
    fontSize: 18,
    textAlign: "left",
  },
});

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

  // Obtener tipo de usuario
  const userType = sessionStorage.getItem("userType");

  useEffect(() => {
    if (userType === "admin" || userType === "cliente") {
      obtenerListaInvolucrados(user)
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
    }
  }, []);

  return (
    <div className="rfp-card">
      <Card className="card-Socio">
        <CardContent>
          <Typography className={classes.title}>{socioData.nombre}</Typography>
          <div className="container-text-socioInvolucrado">
            <Typography className={classes.estatus}>Email:</Typography>
            <Typography className={classes.texto}>{socioData.email}</Typography>
          </div>
          <div className="container-text-socioInvolucrado">
            <Typography className={classes.estatus}>Empresa:</Typography>
            <Typography className={classes.texto}>
              {socioData.empresa}
            </Typography>
          </div>
          <div className="container-text-socioInvolucrado">
            <Typography className={classes.estatus}>Estatus:</Typography>
            <Typography className={classes.texto}>{estatus}</Typography>
          </div>
          <Button
            size="small"
            onClick={(e) => {
              handleRechazoSocio(e, socioData.nombre, participacionId, estatus);
            }}
          >
            RECHAZAR PROPUESTA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
