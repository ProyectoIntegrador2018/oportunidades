import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Grid, TextField, Button} from '@material-ui/core';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import '../../styles/globalStyles.css';

const Signup = () => {
   // state de error
   const [mensajeError, guardarMensajeError] = useState('');

   // hook para redireccionar
   const navigate = useNavigate();

   // validación y leer los datos del formulario
   const formik = useFormik({
      initialValues: {
         nombre: '',
         email: '',
         telefono: '',
         empresa: '',
         password: '',
      },
      validationSchema: Yup.object({
         nombre: Yup.string()
                     .min(3, 'El nombre debe tener al menos 3 caracteres')
                     .required('El nombre es obligatorio'),
         email: Yup.string()
                     .required('El email es obligatorio'),
         telefono: Yup.string()
                     .required('El teléfono es obligatorio'),
         empresa: Yup.string()
                     .required('El nombre de la empresa es obligatorio'),
         password: Yup.string()
                     .min(8, 'La contraseña debe ser de al menos 8 caracteres')
                     .required('La contraseña es obligatoria'),
      }),
      onSubmit: usuario => {
         axios
            .post("/user/create-client-user", 
               {
                  name: usuario.nombre,
                  email: usuario.email,
                  telefono: usuario.telefono,
                  empresa: usuario.empresa,
                  password: usuario.password,
                  userType: 'cliente'
               }
            )
            .then((res) => {
               // redireccionar
               navigate('/');
            })
            .catch((error) => {
               console.log(error);
               guardarMensajeError('Correo ya existente o incorrecto');
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
               <h1 className="texto-primary">Regístrate</h1>
               {mensajeError === '' 
               ? null
               : (<p className="error-titulo-rojo">{mensajeError}</p>)}
               <TextField 
                  className="textField mb-1" 
                  id="nombre"
                  label="Nombre" 
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
               />
               {formik.touched.nombre && formik.errors.nombre 
                  ? (<p className="error-titulo"><span className="error-texto">*</span>{formik.errors.nombre}</p>) 
                  : null }
               <TextField 
                  className="textField mb-1" 
                  id="email"
                  label="Correo" 
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
               />
               {formik.touched.email && formik.errors.email 
                  ? (<p className="error-titulo"><span className="error-texto">*</span>{formik.errors.email}</p>) 
                  : null }
               <TextField 
                  className="textField mb-1" 
                  id="telefono"
                  label="Teléfono"
                  value={formik.values.telefono}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
               />
               {formik.touched.telefono && formik.errors.telefono 
                  ? (<p className="error-titulo"><span className="error-texto">*</span>{formik.errors.telefono}</p>) 
                  : null }
               <TextField 
                  className="textField mb-1" 
                  id="empresa"
                  label="Nombre de empresa"
                  value={formik.values.empresa}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
               />
               {formik.touched.empresa && formik.errors.empresa 
                  ? (<p className="error-titulo"><span className="error-texto">*</span>{formik.errors.empresa}</p>) 
                  : null }
               <TextField 
                  className="textField mb-1" 
                  id="password"
                  type="password" 
                  label="Contraseña" 
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
               />
               {formik.touched.password && formik.errors.password 
                  ? (<p className="error-titulo"><span className="error-texto">*</span>{formik.errors.password}</p>) 
                  : null }
               <Button type="submit" variant="contained" className="boton" >Regístrate</Button>
               <div className="group">
                  <span className="texto">¿Ya tienes una cuenta?</span>
                  <Link to="/" className="link ml-1">
                     ¡Inicia sesión!
                  </Link>
               </div>
            </form>
         </Grid>
      </>
   );
}
 
export default Signup;