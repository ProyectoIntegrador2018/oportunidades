import React, {useEffect, useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import {Grid, TextField, Button} from '@material-ui/core';

import '../../styles/globalStyles.css';

const Inicio = () => {
   return ( 
      <>
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
}
 
export default Inicio;