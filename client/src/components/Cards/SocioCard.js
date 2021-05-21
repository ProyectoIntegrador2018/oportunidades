import React, { useState } from "react";

import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import useStyles from "../Cards/styles";

import axios from "axios";

export default function SocioCard({ socio }) {
  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  const classes = useStyles();

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const deleteSocio = () => {
    axios
      .delete("/admin/socio/" + socio._id, config)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Card className={classes.socioCard}>
        <CardContent className={classes.root}>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>Nombre:</Typography>
            <Typography className={classes.valueText}>{socio.name}</Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>Empresa:</Typography>
            <Typography className={classes.valueText}>
              {socio.empresa}
            </Typography>
          </div>
          <div className={classes.containerText}>
            <Typography className={classes.labelText}>Email:</Typography>
            <Typography className={classes.valueText}>{socio.email}</Typography>
          </div>
        </CardContent>
        <CardActions>
          <div className={classes.contenedorBotones}>
            <IconButton
              aria-label="borrar socio"
              onClick={() => {
                setIsConfirmationOpen(true);
              }}
              className={classes.editIcon}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="editar socio" className={classes.editIcon}>
              <EditIcon />
            </IconButton>
          </div>
        </CardActions>
        <ConfirmDialog
          title="¿Está seguro de que desea borrar el socio?"
          open={isConfirmationOpen}
          setOpen={setIsConfirmationOpen}
          onConfirm={deleteSocio}
        />
      </Card>
    </div>
  );
}
