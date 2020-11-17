import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

const useStyles = makeStyles({
  title: {
    fontSize: 20,
    fontWeight: 800,
    color: '#EE5D36',
  },
  estatus: {
    fontSize: 18,
    fontWeight: 800,
    textAlign: 'left',
    marginRight: '1em',
  },
  texto: {
    fontSize: 18,
    textAlign: 'left',
  },
  containerText: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default function SimpleCard({user}) {
  const classes = useStyles();
   // hook para redireccionar
   const navigate = useNavigate();

   const [nombre, guardarNombre] = useState("");
   const [email, guardarEmail] = useState("");
   const [empresa, guardarEmpresa] = useState("");
   // state de control de si ya se hizo la llamada a la base de datos
   const [llamada, guardarLlamada] = useState('false');
   // Obtener tipo de usuario
   const userType = sessionStorage.getItem("userType");

   useEffect(() => {
      const config = {
         headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
         },
      };
       const obtenerListaInvolucrados = () => {
         axios
             .get("/user/get-socio/" + user, config)
             .then((res) => {
                // guardar los datos importante sobre el socio
                guardarNombre(res.data.user.name);
                guardarEmail(res.data.user.email);
                guardarEmpresa(res.data.user.empresa);
             })
             .catch((error) => {
                console.log(error);
             })
       };
      if (userType === 'admin') obtenerListaInvolucrados();
      if (userType === 'cliente') obtenerListaInvolucrados();
    }, []);
  return (
    <div className="rfp-card">
    <Card className="card-Socio">
      <CardContent>
        <Typography className={classes.title}>
          {nombre}
        </Typography>
        <div className={classes.containerText}>
            <Typography className={classes.estatus}>
                Email:
            </Typography>
            <Typography className={classes.texto}>
              {email}
            </Typography>
        </div>
        <div className={classes.containerText}>
            <Typography className={classes.estatus}>
                Empresa:
            </Typography>
            <Typography className={classes.texto}>
              {empresa}
            </Typography>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
