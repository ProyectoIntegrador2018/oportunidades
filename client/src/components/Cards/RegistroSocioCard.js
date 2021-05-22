import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../Cards/styles";
import "../../styles/globalStyles.css";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const RegistroSocioCard = (props) => {
  const { setIsSnackbarErrorOpen, setIsSnackbarOpen, ...other } = props;

  const classes = useStyles();

  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  // hook para redireccionar
  const navigate = useNavigate();

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
      password: Yup.string()
        .test("len", "Mínimo 8 caracteres.", (val) => val.length >= 8)
        .required("El password es obligatorio"),
    }),
    onSubmit: (socio) => {
      axios
        .post(
          "/admin/create-socio",
          {
            name: socio.name_person,
            telefono: socio.phone,
            email: socio.email,
            empresa: socio.organization,
            userType: "socio",
            password: socio.password,
          },
          config
        )
        .then((res) => {
          setIsSnackbarOpen(true);
          // redireccionar
          setTimeout(function () {
            navigate("/socios");
          }, 1500);
        })
        .catch((error) => {
          setIsSnackbarErrorOpen(true);
        });
    },
  });
  return (
    <div className={classes.cardRfpDetalle}>
      <Card className={classes.root}>
        <CardContent className={classes.root}>
          <Typography className={classes.largeTitle}>
            Registro de Socio
          </Typography>
          <Grid className={classes.formContainer} container direction="column">
            <form
              onSubmit={formik.handleSubmit}
              className={classes.formFieldsContainer}
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
              <TextField
                className={classes.textField}
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
                  {formik.errors.organization}
                </p>
              ) : null}

              <TextField
                className={classes.textField}
                id="password"
                label="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="error-titulo-rfp textField-completo">
                  <span className="error-texto">*</span>
                  {formik.errors.password}
                </p>
              ) : null}
              <div className={classes.contenedorBotones}>
                <Button type="submit" variant="contained" className="boton">
                  Registrar Socio
                </Button>
              </div>
            </form>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistroSocioCard;
