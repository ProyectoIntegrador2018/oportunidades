import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {TextField, Button, Grid, Paper} from '@material-ui/core';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import '../../styles/globalStyles.css';
import SideMenu from "../SideMenu/SideMenu";

const config = {
   headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
   },
};
const RegistroOportunidad = () => {
  // state de error
  const [mensajeError, guardarMensajeError] = useState('');

  // state de los pasos
  const [paso, guardarPaso] = useState('1');

  // hook para redireccionar
  const navigate = useNavigate();

  // validación y leer los datos del formulario
  const formik = useFormik({
     initialValues: {
        name_person: '',
        position: '',
        phone: '',
        email: '',
        rfpname: '',
        objective: '',
        imp_dates: '',
        problem: '',
        functional: '',
        requirements: '',
        aprobadaUsuario: '',
        aprobadaTI: '',
        presupuesto: '',
        tipo_general: '',
        tipo_esp: '',
        comment: '',
     },
     validationSchema: Yup.object({
        name_person: Yup.string()
                    .required('El nombre es obligatorio'),
        position: Yup.string()
                    .required('La posición es obligatoria'),
        phone: Yup.string()
                    .required('El teléfono es obligatorio'),
        email: Yup.string()
                    .required('El correo es obligatorio'),
        rfpname: Yup.string()
                    .required('El nombre es obligatorio'),
        objective: Yup.string()
                    .required('El objetivo es obligatorio'),
        imp_dates: Yup.string()
                    .required('Las fechas son obligatorias'),
        problem: Yup.string()
                    .required('La problemática es obligatoria'),
        functional: Yup.string()
                    .required('La descripción es obligatoria'),
        requirements: Yup.string()
                    .required('Los requerimientos son obligatorios'),
        aprobadaUsuario: Yup.string()
                    .required('La pregunta es obligatoria'),
        aprobadaTI: Yup.string()
                    .required('La pregunta es obligatoria'),
        presupuesto: Yup.string()
                    .required('La pregunta es obligatoria'),
        tipo_general: Yup.string()
                    .required('El tipo es obligatorio'),
        tipo_esp: Yup.string()
                    .required('El tipo es obligatorio'),
        comment: Yup.string()
                    .required('Los comentarios son obligatorios'),
     }),
     onSubmit: rfp => {
        console.log(rfp);
        axios
           .post("/RFP/create-rfp",
              {
                 nombrecliente: rfp.name_person,
                 posicioncliente: rfp.position,
                 telefono: rfp.phone,
                 email: rfp.email,
                 nombreOportunidad: rfp.rfpname,
                 objetivoOportunidad: rfp.objective,
                 fechasRelevantes: rfp.imp_dates,
                 descripcionProblematica: rfp.problem,
                 descripcionFuncional: rfp.functional,
                 requerimientosObligatorios: rfp.requirements,
                 aprobadaAreaUsuario: rfp.aprobadaUsuario,
                 aprobadaAreaTI: rfp.aprobadaTI,
                 presupuestoAsignado: rfp.presupuesto,
                 comentariosAdicionales: rfp.comment,
                 tipoGeneralProyecto: rfp.tipo_general,
                 tipoEspecificoProyecto: rfp.tipo_esp,
              }, config
           )
           .then((res) => {
              // redireccionar
              navigate('/inicio');
           })
           .catch((error) => {
              console.log(error);
              guardarMensajeError('RFP inválido');
           })
     }
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
               <h1 className="texto-primary">Registro oportunidad</h1>
            </Grid>
            <Grid item xs={12} sm={5} md={4} className="container-botones-rfp">
               {paso === '1'
                  ? (<Paper className="botonSeleccionar activo" >Datos de contacto</Paper>)
                  : (<Paper className="botonSeleccionar" >Datos de contacto</Paper>)
               }
               {paso === '2'
                  ? (<Paper className="botonSeleccionar activo" >Datos generales</Paper>)
                  : (<Paper className="botonSeleccionar" >Datos generales</Paper>)
               }
               {paso === '3'
                  ? (<Paper className="botonSeleccionar activo" >Detalle de la oportunidad</Paper>)
                  : (<Paper className="botonSeleccionar" >Detalle de la oportunidad</Paper>)
               }
               {paso === '4'
                  ? (<Paper className="botonSeleccionar activo" >Estatus de la necesidad</Paper>)
                  : (<Paper className="botonSeleccionar" >Estatus de la necesidad</Paper>)
               }
            </Grid>
            <Grid item xs={12} sm={7} md={8}>
               <form onSubmit={formik.handleSubmit} className="container-rfp">
                  {mensajeError === ''
                  ? null
                  : (<p className="error-titulo-rojo">{mensajeError}</p>)}
                  {paso === '1'
                     ? (
                        <Grid item xs={12} container direction="column" alignItems="center">
                           {/* <h2 className="texto-primary">Datos de contacto</h2>  */}
                           <TextField
                              className="textField-completo mb-1"
                              id="name_person"
                              label="Nombre de la persona"
                              value={formik.values.name_person}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.name_person && formik.errors.name_person
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.name_person}</p>)
                              : null }
                           <TextField
                              className="textField-completo mb-1"
                              id="position"
                              label="Posición"
                              value={formik.values.position}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.position && formik.errors.position
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.position}</p>)
                              : null }
                           <TextField
                              className="textField-completo mb-1"
                              id="phone"
                              label="Teléfono"
                              value={formik.values.phone}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.phone && formik.errors.phone
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.phone}</p>)
                              : null }
                           <TextField
                              className="textField-completo mb-1"
                              type="email"
                              id="email"
                              label="Correo electrónico"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.email && formik.errors.email
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.email}</p>)
                              : null }
                           <Button variant="contained" className="boton" onClick={() => guardarPaso('2')}>Continuar</Button>
                        </Grid>
                     )
                     : null
                  }
                  {paso === '2'
                     ? (
                        <Grid item xs={12} container direction="column" alignItems="center">
                           {/* <h2 className="texto-primary">Datos generales</h2> */}
                           <TextField
                              className="textField-completo mb-1"
                              id="rfpname"
                              label="Nombre de la oportunidad"
                              value={formik.values.rfpname}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.rfpname && formik.errors.rfpname
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.rfpname}</p>)
                              : null }
                           <TextField
                              className="textField-completo mb-1"
                              id="objective"
                              label="Objetivo de oportunidad"
                              value={formik.values.objective}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.objective && formik.errors.objective
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.objective}</p>)
                              : null }
                           <TextField
                              className="textField-completo mb-1"
                              id="imp_dates"
                              label="Fechas relevantes"
                              value={formik.values.imp_dates}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.imp_dates && formik.errors.imp_dates
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.imp_dates}</p>)
                              : null }
                           <TextField
                              className="textField-completo mb-1"
                              id="problem"
                              label="Descripción de la problemática"
                              value={formik.values.problem}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.problem && formik.errors.problem
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.problem}</p>)
                              : null }
                           <div className="container-botones">
                              <Button variant="contained" className="boton-gris" onClick={() => guardarPaso('1')}>Regresar</Button>
                              <Button variant="contained" className="boton" onClick={() => guardarPaso('3')}>Continuar</Button>
                           </div>
                        </Grid>
                     )
                     : null
                  }
                  {paso === '3'
                     ? (
                        <Grid item xs={12} container direction="column" alignItems="center">
                           {/* <h2 className="texto-primary">Detalle de la oportunidad</h2> */}
                           <TextField
                              className="textField-completo mb-1"
                              id="functional"
                              label="Descripción funcional de la oportunidad"
                              value={formik.values.functional}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.functional && formik.errors.functional
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.functional}</p>)
                              : null }
                           <TextField
                              className="textField-completo mb-1"
                              id="requirements"
                              label="Requerimientos obligatorios"
                              value={formik.values.requirements}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.requirements && formik.errors.requirements
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.requirements}</p>)
                              : null }
                           <div className="container-botones">
                              <Button variant="contained" className="boton-gris" onClick={() => guardarPaso('2')}>Regresar</Button>
                              <Button variant="contained" className="boton" onClick={() => guardarPaso('4')}>Continuar</Button>
                           </div>
                        </Grid>
                     )
                     : null
                  }
                  {paso === '4'
                     ? (
                        <Grid item xs={12} container direction="column" alignItems="center">
                           {/* <h2 className="texto-primary">Estatus de la necesidad</h2> */}
                           <label className="textLeft textField-completo mb-1"> La necesidad: </label>
                           <TextField
                              className="textField-completo mb-1"
                              id="aprobadaUsuario"
                              label="¿Ha sido aprobada por el área usuaria? (Sí/No)"
                              value={formik.values.aprobadaUsuario}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.aprobadaUsuario && formik.errors.aprobadaUsuario
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.aprobadaUsuario}</p>)
                              : null }
                           <TextField
                              className="textField-completo mb-1"
                              id="aprobadaTI"
                              label="¿Ha sido aprobada por el área de TI? (Sí/No)"
                              value={formik.values.aprobadaTI}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.aprobadaTI && formik.errors.aprobadaTI
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.aprobadaTI}</p>)
                              : null }

                           <TextField
                              className="textField-completo mb-1"
                              id="presupuesto"
                              label="¿Tiene un presupuesto asignado? (Sí/No)"
                              value={formik.values.pregunta}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.presupuesto && formik.errors.presupuesto
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.presupuesto}</p>)
                              : null }
                           <TextField
                              className="textField-completo mb-1"
                              id="tipo_general"
                              label="Tipo general del proyecto"
                              value={formik.values.tipo_general}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.tipo_general && formik.errors.tipo_general
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.tipo_general}</p>)
                              : null }
                           <TextField
                              className="textField-completo mb-1"
                              id="tipo_esp"
                              label="Tipo específico del proyecto"
                              value={formik.values.tipo_esp}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.tipo_esp && formik.errors.tipo_esp
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.tipo_esp}</p>)
                              : null }
                           <TextField
                              className="textField-completo mb-1"
                              id="comment"
                              label="Comentarios adicionales"
                              value={formik.values.comment}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                           />
                           {formik.touched.comment && formik.errors.comment
                              ? (<p className="error-titulo-rfp textField-completo"><span className="error-texto">*</span>{formik.errors.comment}</p>)
                              : null }

                           <div className="container-botones">
                              <Button variant="contained" className="boton-gris" onClick={() => guardarPaso('3')}>Regresar</Button>
                              <Button type="submit" variant="contained" className="boton">Registrar oportunidad</Button>
                           </div>
                        </Grid>
                     )
                     : null
                  }
               </form>
            </Grid>
         </Grid>
      </>
   );
}

export default RegistroOportunidad;
