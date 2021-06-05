import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import useStyles from "../Cards/styles";

import { createParticipacion } from "../../fetchers/fetcher";

export default function SimpleCard({ rfp }) {

  const classes = useStyles();

  // hook para redireccionar
  const navigate = useNavigate();

  const handleClick = () => {
    createParticipacion(rfp._id)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDejarDeParticipar = () => {
    rfp.participandoActual = false;
    dejarDeParticipar(rfp._id)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="rfp-card">
      <Card className={classes.cardRfp}>
        <CardContent>
          <Typography className={classes.title}>
            {rfp.nombreOportunidad}
          </Typography>
          <Typography className={classes.description} gutterBottom>
            {rfp.descripcionProblematica.length > 250
              ? rfp.descripcionProblematica.substring(0, 250) + "..."
              : rfp.descripcionProblematica}
          </Typography>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>Estatus:</Typography>
            <Typography className={classes.valueText}>{rfp.estatus}</Typography>
          </div>
        </CardContent>
        <CardActions>
          <div className={classes.contenedorBotones}>
            <Button
              size="small"
              onClick={() => {
                navigate("/detalle-mi-oportunidad/" + rfp._id);
              }}
              variant="contained"
              className="boton-alt"
            >
              SABER MÁS
            </Button>
            {rfp.participandoActual == false ? (
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
            )}
          </div>
        </CardActions>
      </Card>
    </div>
  );
}
