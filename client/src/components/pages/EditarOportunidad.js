import React from "react";
import {useLocation} from 'react-router-dom';
import { Grid } from "@material-ui/core";

import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import RfpCardEdit from "../Cards/RfpCardEdit";

const EditarOportunidad = ({route}) => {

   const {state} = useLocation();
   const {rfp} = state;

      return (
      <>
         <SideMenu />
         <Grid container className="container-dashboard-margin" ></Grid>
         <Grid
            container
            direction="row"
            className="container-detalle "
         >
            <RfpCardEdit key={rfp._id} rfp={rfp} />
         </Grid>
      </>
   );
};

export default EditarOportunidad;
