import React from "react";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";

import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";

const Inicio = () => {
      return (
      <>
         <SideMenu />
         <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className="container"
         >
            <div className="container-white">
               <h1 className="texto-primary">Inicio</h1>
               <Link to="/registro-oportunidad" className="link ml-1">
                  Nueva oportunidad
               </Link>
            </div>
         </Grid>
      </>
   );
};

export default Inicio;
