import React, { useState, useEffect } from "react";
import { CircularProgress, Grid, Card, Typography } from "@material-ui/core";
import axios from "axios";

import SideMenu from "../SideMenu/SideMenu";
import SocioCard from "../Cards/SocioCard";
import FabButton from "../ui/FabButton";
import "../../styles/globalStyles.css";

const config = {
   headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
   },
};

const Socios = () => {
   const [sociosList, setSociosList] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   useEffect(() => {
      const obtenerListaSocios = () => {
         axios
         .get("/admin/get-socios", config)
         .then(response => {
            setSociosList(response.data.users);
            setIsLoading(false);
         })
         .catch(error => {
            console.log(error);
         })
      }
      obtenerListaSocios();
   }, []);

   return (
      <div>
         <SideMenu />
         <FabButton link="/registro-socio"/>
         {/* <Grid container className="container-dashboard-margin" ></Grid> */}
         <Grid container direction="row" className="container-dashboard">
            {isLoading 
            ? (<CircularProgress color="secondary" />)
            : (sociosList.length > 0
               ? (sociosList.map(socio => {return (<SocioCard key={socio._id} socio={socio} />)}))
               : (<Card className="cardMensaje"><Typography>No hay Socios para mostrar</Typography></Card>))}
         </Grid>
      </div>
   )
};

export default Socios;