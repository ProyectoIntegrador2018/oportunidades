import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Grid, Paper, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";

const config = {
   headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
   },
};

function Alert(props) {
   return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const RegistroSocio = () => {
   // state de error
   const [mensajeError, guardarMensajeError] = useState("");

   // state de los pasos
   const [paso, guardarPaso] = useState("1");

   const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

   // hook para redireccionar
   const navigate = useNavigate();

   const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      setIsSnackbarOpen(false);
    };

   // validación y leer los datos del formulario
   const formik = useFormik({
      initialValues: {
         name_person: "",
         phone: "",
         email: "",
         organization: "",
      },
      validationSchema: Yup.object({
         name_person: Yup.string().required("El nombre es obligatorio"),
         phone: Yup.string().required("El teléfono es obligatorio"),
         email: Yup.string().required("El correo es obligatorio"),
         organization: Yup.string().required("La empresa es obligatoria"),
      }),
      onSubmit: (socio) => {
         axios
            .post(
               "/admin/create-socio",
               {
                  name: socio.name_person,
                  phone: socio.phone,
                  email: socio.email,
                  empresa: socio.organization,
                  userType: "socio"
               },
               config
            )
            .then((res) => {
               setIsSnackbarOpen(true);
               // redireccionar
               setTimeout(function() {
                  navigate("/socios");
               }, 1500);
            })
            .catch((error) => {
               guardarMensajeError("Hubo un error al registrar el socio.");
            });
      },
   });
   return (
      <>
         <SideMenu />
         <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
            className="marginTopMenu"
         >
            <Grid item xs={12}>
               <h1 className="texto-primary">Registro de socio</h1>
            </Grid>
            <Grid item xs={12} sm={5} md={4} className="container-botones-rfp">
               {paso === "1" ? (
                  <Paper className="botonSeleccionar activo">
                     Datos de socio
                  </Paper>
               ) : (
                  <Paper className="botonSeleccionar">Datos de socio</Paper>
               )}
            </Grid>
            <Grid item xs={12} sm={7} md={8}>
               <form onSubmit={formik.handleSubmit} className="container-rfp">
                  {mensajeError === "" ? null : (
                     <p className="error-titulo-rojo">{mensajeError}</p>
                  )}
                  {paso === "1" ? (
                     <Grid
                        item
                        xs={12}
                        container
                        direction="column"
                        alignItems="center"
                     >
                        {/* <h2 className="texto-primary">Datos de contacto</h2>  */}
                        <TextField
                           className="textField-completo mb-1"
                           id="name_person"
                           label="Nombre de la persona"
                           value={formik.values.name_person}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                        />
                        {formik.touched.name_person &&
                        formik.errors.name_person ? (
                           <p className="error-titulo-rfp textField-completo">
                              <span className="error-texto">*</span>
                              {formik.errors.name_person}
                           </p>
                        ) : null}
                        <TextField
                           className="textField-completo mb-1"
                           id="phone"
                           label="Teléfono"
                           value={formik.values.phone}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                        />
                        {formik.touched.phone && formik.errors.phone ? (
                           <p className="error-titulo-rfp textField-completo">
                              <span className="error-texto">*</span>
                              {formik.errors.phone}
                           </p>
                        ) : null}
                        <TextField
                           className="textField-completo mb-1"
                           type="email"
                           id="email"
                           label="Correo electrónico"
                           value={formik.values.email}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email ? (
                           <p className="error-titulo-rfp textField-completo">
                              <span className="error-texto">*</span>
                              {formik.errors.email}
                           </p>
                        ) : null}
                        <TextField
                           className="textField-completo mb-1"
                           type="organization"
                           id="organization"
                           label="Empresa"
                           value={formik.values.organization}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                        />
                        {formik.touched.organization && formik.errors.organization ? (
                           <p className="error-titulo-rfp textField-completo">
                              <span className="error-texto">*</span>
                              {formik.errors.email}
                           </p>
                        ) : null}
                        <Button
                           type="submit"
                           variant="contained"
                           className="boton"
                        >
                           Registrar Socio
                        </Button>
                     </Grid>
                  ) : null}

               </form>
               <Snackbar open={isSnackbarOpen} autoHideDuration={1000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="success">
                     Usuario creado correctamente.
                  </Alert>
               </Snackbar>
            </Grid>
         </Grid>
      </>
   );
};

export default RegistroSocio;
