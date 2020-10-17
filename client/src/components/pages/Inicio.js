import React, {useState, useEffect} from "react";
import { Grid } from "@material-ui/core";
import axios from 'axios';

import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import RfpCardCliente from "../Cards/RfpCardCliente";
import RfpCardSocio from "../Cards/RfpCardSocio";
import FabButton from "../ui/FabButton";

const config = {
   headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
   },
};

const Inicio = () => {
   // state de lista de RFPs
   const [listaRfps, guardarListaRfps] = useState([]);

   // Obtener tipo de usuario
   const userType = sessionStorage.getItem("userType");

   useEffect(() => {
      const obtenerListaRfpsAdmin = () => {
        axios
            .get("/RFP/get-rfp", config)
            .then((res) => {
               // guardar lista de RFPs en state
               guardarListaRfps(res.data);
            })
            .catch((error) => {
               console.log(error);
            })
      }
      const obtenerListaRfpsCliente = () => {
         axios
             .get("/RFP/get-rfp-cliente", config)
             .then((res) => {
                // guardar lista de RFPs en state
                guardarListaRfps(res.data);
             })
             .catch((error) => {
                console.log(error);
             })
       }
       const obtenerListaRfpsSocio = () => {
         axios
             .get("/RFP/get-rfp-socio", config)
             .then((res) => {
                // guardar lista de RFPs en state
                guardarListaRfps(res.data);
             })
             .catch((error) => {
                console.log(error);
             })
       }
      if (userType === 'admin') obtenerListaRfpsAdmin();
      if (userType === 'cliente') obtenerListaRfpsCliente();
      if (userType === 'socio') obtenerListaRfpsSocio();
    }, []);

      return (
      <>
         <SideMenu />
         {userType === 'cliente' 
            ? (<FabButton />)
            : (<Grid container className="container-dashboard-margin" ></Grid>)
         }
         
         <Grid
            container
            direction="row"
            className="container-dashboard "
         >
            {listaRfps.length === 0 ? console.log('Vacia') : console.log('Existe')}
            {console.log(listaRfps)}
            {userType === 'socio' 
               ? (listaRfps.map(rfp => (<RfpCardSocio key={rfp._id} rfp={rfp} />)))
               : (listaRfps.map(rfp => (<RfpCardCliente key={rfp._id} rfp={rfp} />)))
            }
         
         </Grid>
      </>
   );
};

export default Inicio;
