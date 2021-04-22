import React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";

const useStyles = makeStyles({
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

export default function SimpleCard({ rfp }) {
  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  const classes = useStyles();

  // hook para redireccionar
  const navigate = useNavigate();

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
  const handleDejarDeParticipar = () => {
    axios
      .get("/participacion/get-participaciones-socio", config)
      .then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].rfpInvolucrado == rfp._id) {
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
      <Card className="card-RFP">
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
            <Typography className={classes.estatus}>Estatus:</Typography>
            <Typography className={classes.texto}>{rfp.estatus}</Typography>
          </div>
        </CardContent>
        <CardActions>
          <div className={classes.contenedorBotones}>
            <Button
              size="small"
              onClick={() => {
                navigate("/detalle-mi-oportunidad/" + rfp._id);
              }}
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
