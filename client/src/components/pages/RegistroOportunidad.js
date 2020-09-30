import React, {useEffect, useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import {Grid, TextField, Button} from '@material-ui/core';

import '../../styles/globalStyles.css';

const RegistroOportunidad = () => {
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
               <h1 className="texto-primary">Registro Oportunidad</h1>
            </div>
            <div className="container-white">
               <h2 className="texto-primary">Datos de contacto</h2>
               <TextField className="textField mb-1" required label="Nombre de la persona"></TextField>
               <TextField className="textField mb-1" required label="Posición"></TextField>
               <TextField className="textField mb-1" required label="Teléfono"></TextField>
               <TextField className="textField mb-1" required label="Correo" type="email"></TextField>
            </div>
            <div className="container-white">
               <h2 className="texto-primary">General</h2>
               <TextField className="textField mb-1" required label="Nombre de la oportunidad"></TextField>
               <TextField className="textField mb-1" required label="Objetivo breve de la oportunidad"></TextField>
               <TextField className="textField mb-1" required label="Fechas relevantes"></TextField>
               <TextField className="textField mb-1" required label="Describa la problemática"></TextField>
            </div>
            <div className="container-white">
               <h2 className="texto-primary">Detalle</h2>
               <TextField className="textField mb-1" required label="Descripción funcional de la necesidad"></TextField>
               <TextField className="textField mb-1" required label="Requerimientos obligatorios"></TextField>
            </div>
            <div className="container-white">
               <h2 className="texto-primary">Estatus de la necesidad</h2>
               <label>¿La necesidad ha sido aprobada por el área usuaria?</label>
               <label>Sí</label>
               <label>No</label>
               <label>No es necesaria</label>

               <label>¿La necesidad ha sido aprobada por el área de Tecnologías de Información?</label>
               <label>Sí</label>
               <label>No</label>
               <label>No es necesaria</label>

               <label>¿La necesidad tiene un presupuesto asignado?</label>
               <label>Sí</label>
               <label>No</label>

               <TextField className="textField mb-1" required label="Tipo de proyecto (mejora de la organización o proyecto de innovación)"></TextField>
               <TextField className="textField mb-1" required label="Comentarios adicionales"></TextField>
            </div>

            <Button variant="contained" className="boton">Registrar oportunidad</Button>
         </Grid>
      </>
   );
}

export default RegistroOportunidad;
