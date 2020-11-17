import React, {useState, useEffect} from "react";
import {useLocation} from 'react-router-dom';
import { Grid, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from '@material-ui/core/Card';
import axios from 'axios';
import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import RfpCardDetalle from "../Cards/RfpCardDetalle";
import SocioInvolucradoCard from "../Cards/SocioInvolucradoCard";

const Inicio = ({route}) => {
  const {state} = useLocation();
  const {rfp} = state;
  // state de lista de participaciones de socio en RFPs
  const [listaParticipaciones, guardarListaParticipaciones] = useState([]);
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
             .get("/participacion/get-participaciones-rfp/" + rfp._id, config)
             .then((res) => {
                // guardar lista de participaciones en state
                guardarListaParticipaciones(res.data);
                // actualizar variable de control
                guardarLlamada('true');
             })
             .catch((error) => {
                console.log(error);
             })
      };
     if (userType === 'admin') obtenerListaInvolucrados();
     if (userType === 'cliente') obtenerListaInvolucrados();
   }, []);
      return (
      <>
         <SideMenu />
         <Grid container className="container-dashboard-margin" ></Grid>
         <Grid
            container
            direction="row"
            className="container-detalle "
         >
            <RfpCardDetalle key={rfp._id} rfp={rfp} />
            {userType === 'socio'
               ? null
               : (
                 <Grid
                    container
                    direction="row"
                    className="container-dashboard "
                 >
                    {llamada === 'false' ? (<CircularProgress color="secondary"/>) : null}
                    {llamada === 'true'
                       ? (listaParticipaciones.length === 0
                          ? (<Card className="cardNoHaySocios"><Typography>No hay socios involucrados hasta ahora</Typography></Card>)
                          : (<Card className="cardHaySocios"><Typography>Socios involucrados:</Typography></Card>))
                       : null}
                    <Grid
                        container
                        direction="row"
                        className="container-dashboard "
                    >
                        {userType === 'socio'
                           ? null
                           : (listaParticipaciones.map(user => (<SocioInvolucradoCard key={user.socioInvolucrado} user={user.socioInvolucrado} />)))
                        }
                    </Grid>
                 </Grid>
               )
            }
         </Grid>


      </>
   );
};

export default Inicio;
