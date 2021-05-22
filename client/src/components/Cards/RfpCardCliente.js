import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import FabEditRFP from "../ui/FabEditRFP";
import useStyles from "../Cards/styles";

export default function SimpleCard({ rfp }) {
  const classes = useStyles();

  // hook para redireccionar
  const navigate = useNavigate();

  return (
    <div className="rfp-card">
      <Card className={classes.cardRfp}>
        <FabEditRFP rfp={rfp} />
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
                navigate("/detalle/" + rfp._id);
              }}
              variant="contained"
              className="boton-alt"
            >
              SABER MÁS
            </Button>
          </div>
        </CardActions>
      </Card>
    </div>
  );
}
