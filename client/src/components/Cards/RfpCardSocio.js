import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import useStyles from "../Cards/styles";

import axios from "axios";
import { isSocioBanned } from "../../fetchers/fetcher";

export default function SimpleCard({ rfp }) {
  const [isBanned, setIsBanned] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    isSocioBanned(rfp._id)
      .then((data) => {
        setIsBanned(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const classes = useStyles();

  // hook para redireccionar
  const navigate = useNavigate();

  // TODO: Refactor to fetchers
  const handleClick = () => {
    axios
      .post(
        "/participacion/create-participacion",
        {
          rfpInvolucrado: rfp._id,
        },
        config
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // TODO: Refactor to fetchers
  const handleDejarDeParticipar = () => {
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
                window.location.reload();
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
    <div className="rfp-card">
      <ConfirmDialog
        title="Confirmación"
        open={isConfirmationOpen}
        setOpen={setIsConfirmationOpen}
        onConfirm={handleDejarDeParticipar}
      >
        ¿Está seguro de que desea dejar de participar? Esta acción no se puede
        revertir
      </ConfirmDialog>
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
            <Typography className={classes.labelValue}>
              {rfp.estatus}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <div className={classes.contenedorBotones}>
            <Button
              onClick={() => {
                navigate("/detalle/" + rfp._id);
              }}
              variant="contained"
              className="boton-alt"
            >
              SABER MÁS
            </Button>
            {!isBanned && rfp.participandoActual == false && (
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
            )}
            {!isBanned && rfp.participandoActual == true && (
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
            )}
          </div>
        </CardActions>
      </Card>
    </div>
  );
}
