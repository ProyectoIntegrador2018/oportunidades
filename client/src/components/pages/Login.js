import React, {useEffect, useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import {Grid, TextField, Button} from '@material-ui/core';

import '../../styles/globalStyles.css';

const Login = () => {
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
               <h1 className="texto-primary">Inicia sesión</h1>
               <TextField className="textField mb-1" required label="Usuario"></TextField>
               <TextField className="textField" required type="password" autoComplete="current-password" label="Contraseña"></TextField>
               <Button variant="contained" className="boton">Inicia sesión</Button>
               <div className="group">
                  <span className="texto">¿No tienes cuenta?</span>
                  <Link to="/registro" className="link ml-1">
                        ¡Regístrate!
                  </Link>
               </div>
            </div>
         </Grid>
      </>
   );
}
 
export default Login;