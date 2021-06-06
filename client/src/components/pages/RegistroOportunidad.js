import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Paper,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import axios from "axios";
import { addDays } from "date-fns";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import useStyles from "./styles";

const RegistroOportunidad = () => {
  registerLocale("es", es);
  setDefaultLocale("es");

  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  // state de error
  const [mensajeError, guardarMensajeError] = useState("");

  // state de los pasos
  const [paso, guardarPaso] = useState(0);

  // state de los radio buttons
  const [aprobadaUsuario, guardarAprobadaUsuario] = useState("Sí");
  const [aprobadaTI, guardarAprobadaTI] = useState("Sí");
  const [presupuesto, guardarPresupuesto] = useState("Sí");

  const classes = useStyles();

  const handleAprobadaUsuario = (event) => {
    guardarAprobadaUsuario(event.target.value);
  };

  const handleAprobadaTI = (event) => {
    guardarAprobadaTI(event.target.value);
  };

  const handlePresupuesto = (event) => {
    guardarPresupuesto(event.target.value);
  };

  const handleNext = () => {
    guardarPaso(paso + 1);
  };

  const handleBack = () => {
    guardarPaso(paso - 1);
  };

  // hook para redireccionar
  const navigate = useNavigate();

  // validación y leer los datos del formulario
  const formik = useFormik({
    initialValues: {
      name_person: "",
      position: "",
      phone: "",
      email: "",
      rfpname: "",
      objective: "",
      imp_dates: "",
      problem: "",
      functional: "",
      requirements: "",
      tipo_general: "",
      tipo_esp: "",
      comment: "",
    },
    validationSchema: Yup.object({
      name_person: Yup.string().required("El nombre es obligatorio"),
      position: Yup.string().required("La posición es obligatoria"),
      phone: Yup.string().required("El teléfono es obligatorio"),
      email: Yup.string().required("El correo es obligatorio"),
      rfpname: Yup.string().required("El nombre es obligatorio"),
      objective: Yup.string().required("El objetivo es obligatorio"),
      imp_dates: Yup.string().required("Las fechas son obligatorias"),
      problem: Yup.string().required("La problemática es obligatoria"),
      functional: Yup.string().required("La descripción es obligatoria"),
      requirements: Yup.string().required(
        "Los requerimientos son obligatorios"
      ),
      tipo_general: Yup.string().required("El tipo es obligatorio"),
      tipo_esp: Yup.string().required("El tipo es obligatorio"),
      comment: Yup.string(),
    }),
    onSubmit: (rfp) => {
      axios
        .post(
          "/RFP/create-rfp",
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
          },
          config
        )
        .then((res) => {
          // redireccionar
          navigate("/inicio");
        })
        .catch((error) => {
          console.log(error);
          guardarMensajeError("RFP inválido");
        });
    },
  });

  const steps = [
    "Datos de Contacto",
    "Datos Generales",
    "Detalle de la Oportunidad",
    "Estatus de la Necesidad",
  ];

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
          <Typography className={classes.largeTitle}>
            Registro de Oportunidad Comercial
          </Typography>
        </Grid>
        <div className={classes.steppedForm}>
          <Stepper activeStep={paso} orientation="vertical">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <div className={classes.actionsContainer}>
                    <div>
                      {paso > 0 && (
                        <Button onClick={handleBack} className="boton-alt">
                          Regresar
                        </Button>
                      )}
                      {paso < steps.length - 1 && (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          className="boton"
                          type={paso === steps.length - 1 ? "submit" : ""}
                        >
                          Continuar
                        </Button>
                      )}
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          <Grid item xs={12} sm={12} md={8}>
            <form
              onSubmit={formik.handleSubmit}
              className={classes.formContainer}
            >
              {mensajeError === "" ? null : (
                <p className="error-titulo-rojo">{mensajeError}</p>
              )}
              {paso === 0 ? (
                <Grid
                  item
                  className={classes.formFieldsContainer}
                  container
                  direction="column"
                  alignItems="center"
                >
                  <TextField
                    className={classes.textField}
                    id="name_person"
                    label="Nombre de la persona"
                    value={formik.values.name_person}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name_person && formik.errors.name_person ? (
                    <p className="error-titulo-rfp textField-completo">
                      <span className="error-texto">*</span>
                      {formik.errors.name_person}
                    </p>
                  ) : null}
                  <TextField
                    className={classes.textField}
                    id="position"
                    label="Posición"
                    value={formik.values.position}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.position && formik.errors.position ? (
                    <p className="error-titulo-rfp textField-completo">
                      <span className="error-texto">*</span>
                      {formik.errors.position}
                    </p>
                  ) : null}
                  <TextField
                    className={classes.textField}
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
                    className={classes.textField}
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
                </Grid>
              ) : null}
              {paso === 1 ? (
                <Grid
                  item
                  xs={12}
                  container
                  direction="column"
                  alignItems="center"
                >
                  <TextField
                    className={classes.textField}
                    id="rfpname"
                    label="Nombre de la oportunidad"
                    value={formik.values.rfpname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.rfpname && formik.errors.rfpname ? (
                    <p className="error-titulo-rfp textField-completo">
                      <span className="error-texto">*</span>
                      {formik.errors.rfpname}
                    </p>
                  ) : null}
                  <TextField
                    className={classes.textField}
                    id="objective"
                    label="Objetivo de oportunidad"
                    value={formik.values.objective}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.objective && formik.errors.objective ? (
                    <p className="error-titulo-rfp textField-completo">
                      <span className="error-texto">*</span>
                      {formik.errors.objective}
                    </p>
                  ) : null}
                  <TextField
                    className={classes.textField}
                    id="imp_dates"
                    label="Fechas relevantes"
                    value={formik.values.imp_dates}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.imp_dates && formik.errors.imp_dates ? (
                    <p className="error-titulo-rfp textField-completo">
                      <span className="error-texto">*</span>
                      {formik.errors.imp_dates}
                    </p>
                  ) : null}
                  <TextField
                    className={classes.textField}
                    id="problem"
                    label="Descripción de la problemática"
                    value={formik.values.problem}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.problem && formik.errors.problem ? (
                    <p className="error-titulo-rfp textField-completo">
                      <span className="error-texto">*</span>
                      {formik.errors.problem}
                    </p>
                  ) : null}
                </Grid>
              ) : null}
              {paso === 2 ? (
                <Grid
                  item
                  xs={12}
                  container
                  direction="column"
                  alignItems="center"
                >
                  <TextField
                    className={classes.textField}
                    id="functional"
                    label="Descripción funcional de la oportunidad"
                    value={formik.values.functional}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.functional && formik.errors.functional ? (
                    <p className="error-titulo-rfp textField-completo">
                      <span className="error-texto">*</span>
                      {formik.errors.functional}
                    </p>
                  ) : null}
                  <TextField
                    className={classes.textField}
                    id="requirements"
                    label="Requerimientos obligatorios"
                    value={formik.values.requirements}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.requirements && formik.errors.requirements ? (
                    <p className="error-titulo-rfp textField-completo">
                      <span className="error-texto">*</span>
                      {formik.errors.requirements}
                    </p>
                  ) : null}
                </Grid>
              ) : null}
              {paso === 3 ? (
                <Grid
                  item
                  xs={12}
                  container
                  direction="column"
                  alignItems="center"
                >
                  <div className={classes.containerText}>
                    <Typography className={classes.labelText}>
                      La necesidad:
                    </Typography>
                  </div>
                  <br/>
                  <div className={classes.containerRadios}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        ¿Ha sido aprobada por el área usuaria?
                      </FormLabel>
                      <RadioGroup
                        aria-label="gender"
                        name="gender1"
                        value={aprobadaUsuario}
                        onChange={handleAprobadaUsuario}
                        className={classes.binaryRadioGroup}
                      >
                        <FormControlLabel
                          value="Sí"
                          control={<Radio color="primary" />}
                          label="Sí"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className={classes.containerRadios}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        ¿Ha sido aprobada por el área de TI?
                      </FormLabel>
                      <RadioGroup
                        aria-label="gender"
                        name="gender1"
                        value={aprobadaTI}
                        onChange={handleAprobadaTI}
                        className={classes.binaryRadioGroup}
                      >
                        <FormControlLabel
                          value="Sí"
                          control={<Radio color="primary" />}
                          label="Sí"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className={classes.containerRadios}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        ¿Tiene un presupuesto asignado?
                      </FormLabel>
                      <RadioGroup
                        aria-label="gender"
                        name="gender1"
                        value={presupuesto}
                        onChange={handlePresupuesto}
                        className={classes.binaryRadioGroup}
                      >
                        <FormControlLabel
                          value="Sí"
                          control={<Radio color="primary" />}
                          label="Sí"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <TextField
                    className={classes.textField}
                    id="tipo_general"
                    label="Tipo general del proyecto"
                    value={formik.values.tipo_general}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.tipo_general && formik.errors.tipo_general ? (
                    <p className="error-titulo-rfp textField-completo">
                      <span className="error-texto">*</span>
                      {formik.errors.tipo_general}
                    </p>
                  ) : null}
                  <TextField
                    className={classes.textField}
                    id="tipo_esp"
                    label="Tipo específico del proyecto"
                    value={formik.values.tipo_esp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.tipo_esp && formik.errors.tipo_esp ? (
                    <p className="error-titulo-rfp textField-completo">
                      <span className="error-texto">*</span>
                      {formik.errors.tipo_esp}
                    </p>
                  ) : null}
                  <TextField
                    className={classes.textField}
                    id="comment"
                    label="Comentarios adicionales"
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.comment && formik.errors.comment ? (
                    <p className="error-titulo-rfp textField-completo">
                      <span className="error-texto">*</span>
                      {formik.errors.comment}
                    </p>
                  ) : null}
                  <Typography className={classes.warning}>
                    * Si la oportunidad no tiene participantes durante los primeros 15 días, se cerrará automáticamente y usted será notificado. *
                  </Typography>
                  <div className="container-botones">
                    <Button type="submit" variant="contained" className="boton">
                      Registrar oportunidad
                    </Button>
                  </div>
                </Grid>
              ) : null}
            </form>
          </Grid>
        </div>
      </Grid>
    </>
  );
};

export default RegistroOportunidad;
