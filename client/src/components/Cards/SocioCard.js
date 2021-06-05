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

import { deleteSocio } from "../../fetchers/fetcher";

export default function SocioCard({ socio }) {

  const classes = useStyles();

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const deleteSocioOnConfirm = () => {
    deleteSocio(socio._id)
      .then(() => {
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
          onConfirm={deleteSocioOnConfirm}
        />
      </Card>
    </div>
  );
}
