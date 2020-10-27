import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Typography from "@material-ui/core/Typography";
import { IconButton } from "@material-ui/core";
import Axios from "axios";
import ConfirmDialog from "../Dialogs/ConfirmDialog";

//import FabEditRFP from "../ui/FabEditRFP";

const useStyles = makeStyles({
   root: {
      minWidth: 250,
      maxWidth: 400,
   },
   bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
   },
   title: {
      fontSize: 18,
      fontWeight: 800,
      color: "#EE5D36",
      marginTop: "1em",
   },
   description: {
      fontSize: 14,
   },
   estatus: {
      fontSize: 16,
      fontWeight: 800,
      textAlign: "left",
      marginRight: "1em",
   },
   texto: {
      fontSize: 16,
      textAlign: "left",
   },
   containerText: {
      display: "flex",
      flexDirection: "row",
   },
   contenedorBotones: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      alignContent: "flex-end",
      justifyContent: "space-between",
      marginLeft: "1.5em",
   },
});

const config = {
   headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
   },
};

export default function SocioCard({ socio }) {
   const classes = useStyles();

   // hook para redireccionar
   const navigate = useNavigate();

   const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

   const deleteSocio = () => {
      Axios.delete("/admin/socio/" + socio._id, config)
         .then((response) => {
            window.location.reload();
         })
         .catch((error) => {
            console.log(error);
         });
   };

   return (
      <div className="rfp-card">
         <Card className={classes.root}>
            <CardContent>
               <Typography className={classes.title}>{socio.name}</Typography>
               <Typography className={classes.description} gutterBottom>
                  {socio.empresa}
               </Typography>
               <Typography className={classes.description} gutterBottom>
                  {socio.email}
               </Typography>
            </CardContent>
            <CardActions>
               <div className={classes.contenedorBotones}>
                  <IconButton
                     aria-label="borrar socio"
                     onClick={() => {
                        setIsConfirmationOpen(true);
                     }}
                  >
                     <DeleteIcon />
                  </IconButton>
                  <IconButton aria-label="editar socio">
                     <EditIcon />
                  </IconButton>
               </div>
            </CardActions>
            <ConfirmDialog
               title="Borrar socio?"
               open={isConfirmationOpen}
               setOpen={setIsConfirmationOpen}
               onConfirm={deleteSocio}
            />
         </Card>
      </div>
   );
}
