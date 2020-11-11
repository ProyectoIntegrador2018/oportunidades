import React from "react";
import {useLocation} from 'react-router-dom';
import { Grid } from "@material-ui/core";

import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import MisOportunidadesCardDetalle from "../Cards/MisOportunidadesCardDetalle";

const config = {
   headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
   },
};

const Inicio = ({route}) => {

   const {state} = useLocation();
   const {rfp} = state;

   // Obtener tipo de usuario
   const userType = sessionStorage.getItem("userType");


      return (
      <>
         <SideMenu />
         <Grid container className="container-dashboard-margin" ></Grid>
         <Grid
            container
            direction="row"
            className="container-detalle "
         >
            <MisOportunidadesCardDetalle key={rfp._id} rfp={rfp} />
         </Grid>
      </>
   );
};

export default Inicio;
