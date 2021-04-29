import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Button, Card, FormLabel, CardContent, Typography, Grid} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import "react-datepicker/dist/react-datepicker.css";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    minWidth: '90%',
    maxWidth: '90%',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 25,
    fontWeight: 800,
    color: '#EE5D36',
    flex: 1,
  },
  icono: {
    fontSize: 60,
    fontWeight: 800,
    color: '#EE5D36',
    marginTop: 10,
    marginLeft: 10,
  },
  contacto: {
    fontSize: 23,
    fontWeight: 800,
    color: '#EE5D36',
    textAlign: 'left',
    marginTop: 20,
  },
  description: {
    fontSize: 14,
  },
  estatus: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'left',
    marginRight: '0.5em',
    color: '#EE5D36',
  },
  texto: {
    fontSize: 16,
    textAlign: 'left',
  },
  containerText: {
    display: 'flex',
    flexDirection: 'row',
  },
  containerHeader: {
    display: 'flex',
    flexDirection: 'row',
  },
  contenedorBotones: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignContent: 'flex-end',
    justifyContent: 'center',
    marginLeft: '1.5em',
  },
});

export default function SimpleCard({rfp}) {

  const config = {
    headers: {
       Authorization: "Bearer " + sessionStorage.getItem("token"),
       "Content-Type": "application/json",
    },
  };

  const classes = useStyles();

  // state de error
  const [mensajeError, guardarMensajeError] = useState('');

  // State del select de status
  const [estatus, guardarEstatus] = useState(rfp.estatus);
  const [cerrada, guardarCerrada] = useState(rfp.estatus === 'Cerrada');
  const [causaEstatus, guardarCausaEstatus] = useState(rfp.causa);

  const handleStatusChange = (e) => {
    guardarEstatus(e.target.value);
    if (e.target.value === 'Cerrada') {
      guardarCerrada(true);
    } else {
      guardarCerrada(false);
    }
  };

  const handleCausaChange = (estatus) => {
    guardarCausaEstatus(estatus.target.value);
  };

  // hook para redireccionar
  const navigate = useNavigate();

  // state de los radio buttons
  const [aprobadaUsuario, guardarAprobadaUsuario] = useState(rfp.aprobadaAreaUsuario);
  const [aprobadaTI, guardarAprobadaTI] = useState(rfp.aprobadaAreaTI);
  const [presupuesto, guardarPresupuesto] = useState(rfp.presupuestoAsignado);

  const handleAprobadaUsuario = (event) => {
   guardarAprobadaUsuario(event.target.value);
  };

  const handleAprobadaTI = (event) => {
   guardarAprobadaTI(event.target.value);
  };

  const handlePresupuesto = (event) => {
   guardarPresupuesto(event.target.value);
  };

  // validación y leer los datos del formulario
  const formik = useFormik({
    initialValues: {
      name_person: rfp.nombrecliente,
      position: rfp.posicioncliente,
      phone: rfp.telefono,
      email: rfp.email,
      rfpname: rfp.nombreOportunidad,
      objective: rfp.objetivoOportunidad,
      imp_dates: rfp.fechasRelevantes,
      problem: rfp.descripcionProblematica,
      functional: rfp.descripcionFuncional,
      requirements: rfp.requerimientosObligatorios,
      tipo_general: rfp.tipoGeneralProyecto,
      tipo_esp: rfp.tipoEspecificoProyecto,
      comment: rfp.comentariosAdicionales,
      id: rfp._id,
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
      tipo_general: Yup.string()
                  .required('El tipo es obligatorio'),
      tipo_esp: Yup.string()
                  .required('El tipo es obligatorio'),
      comment: Yup.string(),
      id: Yup.string(),
    }),
    onSubmit: rfp => {
      if (estatus === 'Cerrada') {
        axios
          .patch("/RFP/updaterfp",
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
                aprobadaAreaUsuario: aprobadaUsuario,
                aprobadaAreaTI: aprobadaTI,
                presupuestoAsignado: presupuesto,
                comentariosAdicionales: rfp.comment,
                tipoGeneralProyecto: rfp.tipo_general,
                tipoEspecificoProyecto: rfp.tipo_esp,
                id: rfp.id,
                estatus: estatus,
                causa: causaEstatus
             }, config
          )
          .then((res) => {
             // redireccionar
             navigate('/inicio');
          })
          .catch((error) => {
             console.log(error);
             guardarMensajeError('RFP inválido');
          });
      } else {
        axios
          .patch("/RFP/updaterfp",
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
                aprobadaAreaUsuario: aprobadaUsuario,
                aprobadaAreaTI: aprobadaTI,
                presupuestoAsignado: presupuesto,
                comentariosAdicionales: rfp.comment,
                tipoGeneralProyecto: rfp.tipo_general,
                tipoEspecificoProyecto: rfp.tipo_esp,
                id: rfp.id,
                estatus: estatus,
                causa: ''
             }, config
          )
          .then((res) => {
             // redireccionar
             navigate('/inicio');
          })
          .catch((error) => {
             console.log(error);
             guardarMensajeError('RFP inválido');
          });
      }
        
    }
 });

  return (
    <div className="rfp-card-detalle">
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title}>
          Editar oportunidad
        </Typography>
        <Grid item xs={12} container direction="column" alignItems="center">
          <form onSubmit={formik.handleSubmit} className="container-rfp-edit">
            {mensajeError === ''
              ? null
              : (<p className="error-titulo-rojo">{mensajeError}</p>)}
            <TextField
              className="textField-completo-100 mb-1"
              id="name_person"
              label="Nombre de la persona"
              value={formik.values.name_person}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name_person && formik.errors.name_person
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.name_person}</p>)
              : null }
            <TextField
              className="textField-completo-100 mb-1"
              id="position"
              label="Posición"
              value={formik.values.position}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.position && formik.errors.position
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.position}</p>)
              : null }
            <TextField
              className="textField-completo-100 mb-1"
              id="phone"
              label="Teléfono"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.phone}</p>)
              : null }
            <TextField
              className="textField-completo-100 mb-1"
              type="email"
              id="email"
              label="Correo electrónico"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.email}</p>)
              : null }
            <TextField
              className="textField-completo-100 mb-1"
              id="rfpname"
              label="Nombre de la oportunidad"
              value={formik.values.rfpname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.rfpname && formik.errors.rfpname
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.rfpname}</p>)
              : null }
            <TextField
              className="textField-completo-100 mb-1"
              id="objective"
              label="Objetivo de oportunidad"
              value={formik.values.objective}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.objective && formik.errors.objective
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.objective}</p>)
              : null }
            <TextField
              className="textField-completo-100 mb-1"
              id="imp_dates"
              label="Fechas relevantes"
              value={formik.values.imp_dates}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.imp_dates && formik.errors.imp_dates
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.imp_dates}</p>)
              : null }
            <TextField
              className="textField-completo-100 mb-1"
              id="problem"
              label="Descripción de la problemática"
              value={formik.values.problem}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.problem && formik.errors.problem
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.problem}</p>)
              : null }
            <TextField
              className="textField-completo-100 mb-1"
              id="functional"
              label="Descripción funcional de la oportunidad"
              value={formik.values.functional}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.functional && formik.errors.functional
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.functional}</p>)
              : null }
            <TextField
              className="textField-completo-100 mb-1"
              id="requirements"
              label="Requerimientos obligatorios"
              value={formik.values.requirements}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.requirements && formik.errors.requirements
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.requirements}</p>)
              : null }
            <label className="textLeft textField-completo-100 mb-1"> La necesidad: </label>
            <div className="container-radios">
              <FormControl component="fieldset">
                <FormLabel component="legend">¿Ha sido aprobada por el área usuaria?</FormLabel>
                <RadioGroup aria-label="gender" name="gender1" value={aprobadaUsuario} onChange={handleAprobadaUsuario}>
                    <FormControlLabel value="Sí" control={<Radio color="primary"/>} label="Sí" />
                    <FormControlLabel value="No" control={<Radio color="primary"/>} label="No" />
                </RadioGroup>
              </FormControl> 
            </div>
            <div className="container-radios">
              <FormControl component="fieldset">
                <FormLabel component="legend">¿Ha sido aprobada por el área de TI?</FormLabel>
                <RadioGroup aria-label="gender" name="gender1" value={aprobadaTI} onChange={handleAprobadaTI}>
                    <FormControlLabel value="Sí" control={<Radio color="primary"/>} label="Sí" />
                    <FormControlLabel value="No" control={<Radio color="primary"/>} label="No" />
                </RadioGroup>
              </FormControl> 
            </div>
            <div className="container-radios">
              <FormControl component="fieldset">
                <FormLabel component="legend">¿Tiene un presupuesto asignado?</FormLabel>
                <RadioGroup aria-label="gender" name="gender1" value={presupuesto} onChange={handlePresupuesto}>
                    <FormControlLabel value="Sí" control={<Radio color="primary"/>} label="Sí" />
                    <FormControlLabel value="No" control={<Radio color="primary"/>} label="No" />
                </RadioGroup>
              </FormControl> 
            </div>
            <TextField
              className="textField-completo-100 mb-1"
              id="tipo_general"
              label="Tipo general del proyecto"
              value={formik.values.tipo_general}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.tipo_general && formik.errors.tipo_general
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.tipo_general}</p>)
              : null }
            <TextField
              className="textField-completo-100 mb-1"
              id="tipo_esp"
              label="Tipo específico del proyecto"
              value={formik.values.tipo_esp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.tipo_esp && formik.errors.tipo_esp
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.tipo_esp}</p>)
              : null }
            <TextField
              className="textField-completo-100 mb-1"
              id="comment"
              label="Comentarios adicionales"
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.comment && formik.errors.comment
              ? (<p className="error-titulo-rfp textField-completo-100"><span className="error-texto">*</span>{formik.errors.comment}</p>)
              : null }
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Estatus</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={estatus}
                onChange={e => handleStatusChange(e)}
              >
                <MenuItem value={'Activo'}>Activo</MenuItem>
                <MenuItem value={'En proceso'}>En proceso</MenuItem>
                <MenuItem value={'Cerrada'}>Cerrada</MenuItem>
              </Select>
            </FormControl>
            {cerrada
              ? <TextField
                  className="textField-completo-100 mt-1"
                  label="Causa de oportunidad cerrada"
                  value={causaEstatus}
                  onChange={(estatus) => {handleCausaChange(estatus)}}
                />
              : null}
          <div className={classes.contenedorBotones}>
            <Button size="small" onClick={() => { navigate(-1)}}>CANCELAR</Button>
            <Button type="submit" variant="contained" className="boton">GUARDAR</Button>
          </div>
        </form>
      </Grid>
      </CardContent>
    </Card>
    </div>
  );
}