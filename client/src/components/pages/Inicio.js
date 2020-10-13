import React from "react";
import { Grid } from "@material-ui/core";

import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import RfpCardSocio from "../Cards/RfpCardSocio";
import FabButton from "../ui/FabButton";

const Inicio = () => {
      return (
      <>
         <SideMenu />
         <FabButton />
         <Grid
            container
            direction="row"
            className="container-dashboard "
         >
            <RfpCardSocio />
            <RfpCardSocio />
            <RfpCardSocio />
            <RfpCardSocio />
         
         </Grid>
      </>
   );
};

export default Inicio;
