import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Grid, TextField, Button} from '@material-ui/core';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import '../../styles/globalStyles.css';

const Login = () => {
   // state de error
   const [mensajeError, guardarMensajeError] = useState('');

   // hook para redireccionar
   const navigate = useNavigate();

   // validación y leer los datos del formulario
   const formik = useFormik({
      initialValues: {
         usuario: '',
         password: '',
      },
      validationSchema: Yup.object({
         usuario: Yup.string()
                     .required('El usuario es obligatorio'),
         password: Yup.string()
                     .required('La contraseña es obligatoria'),
      }),
      onSubmit: usuario => {
         axios
            .post("/user/login", 
               {
                  email: usuario.usuario,
                  password: usuario.password
               }
            )
            .then((res) => {
               
               // guardar token en session storage
               sessionStorage.setItem('AUTHENTICATED', true);
               sessionStorage.setItem('token', res.data.token);
               sessionStorage.setItem('userType', res.data.user.userType);
               console.log(res.data.token);
               
               // redireccionar
               navigate('/inicio');
            })
            .catch((error) => {
               console.log(error);
               guardarMensajeError('Usuario o contraseña incorrecto');
            })
      }
   });
   return ( 
      <>
         <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className="container"
         >
            <form onSubmit={formik.handleSubmit} className="container-white">
               <h1 className="texto-primary">Inicia sesión</h1>
               {mensajeError === '' 
               ? null
               : (<p className="error-titulo-rojo">{mensajeError}</p>)}
               <TextField 
                  className="textField mb-1" 
                  id="usuario"
                  label="Usuario" 
                  value={formik.values.usuario}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
               />
               {formik.touched.usuario && formik.errors.usuario 
                  ? (<p className="error-titulo"><span className="error-texto">*</span>{formik.errors.usuario}</p>) 
                  : null }
               <TextField 
                  className="textField mb-1" 
                  type="password" 
                  autoComplete="current-password" 
                  id="password"
                  label="Contraseña"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
               />
               {formik.touched.password && formik.errors.password 
                  ? (<p className="error-titulo"><span className="error-texto">*</span>{formik.errors.password}</p>) 
                  : null }
               <Button type="submit" variant="contained" className="boton">Inicia sesión</Button>
               <div className="group">
                  <span className="texto">¿No tienes cuenta?</span>
                  <Link to="/registro" className="link ml-1">
                        ¡Regístrate!
                  </Link>
               </div>
            </form>
         </Grid>
      </>
   );
}
 
export default Login;