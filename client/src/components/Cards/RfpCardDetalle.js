import React from 'react';
import {useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

import FabEditRFPFlex from "../ui/FabEditRFPFlex";

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
  const classes = useStyles();

  // hook para redireccionar
  const navigate = useNavigate();

  // Obtener tipo de usuario
  const userType = sessionStorage.getItem("userType");

  return (
    <div className="rfp-card-detalle">
    <Card className={classes.root}>
      <div className={classes.containerHeader}>
        <KeyboardArrowLeft className={classes.icono} onClick={() => {navigate('/inicio')}}/>
        {userType === 'socio' ? (null) : (<FabEditRFPFlex  rfp={rfp} />)}
      </div>
      <CardContent>
        <Typography className={classes.title}>
          {rfp.nombreOportunidad}
        </Typography>
        <Typography className={classes.texto} gutterBottom>
          {rfp.descripcionProblematica}
        </Typography>
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
              Estatus: 
          </Typography>
          <Typography className={classes.texto}>
            {rfp.estatus}
          </Typography>
        </div>
        <Typography className={classes.estatus}>
          Objetivo de la oportunidad
        </Typography>
        <Typography className={classes.texto}>
          {rfp.objetivoOportunidad}
        </Typography>
        <Typography className={classes.estatus}>
          Descripción funcional de la oportunidad
        </Typography>
        <Typography className={classes.texto}>
          {rfp.descripcionFuncional}
        </Typography>
        <Typography className={classes.estatus}>
          Requerimientos obligatorios
        </Typography>
        <Typography className={classes.texto}>
          {rfp.requerimientosObligatorios}
        </Typography>
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
              Fechas relevantes: 
          </Typography>
          <Typography className={classes.texto}>
            {rfp.fechasRelevantes}
          </Typography>
        </div>
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
              ¿Ha sido aprobada por el área usuaria? 
          </Typography>
          <Typography className={classes.texto}>
            {rfp.aprobadaAreaUsuario}
          </Typography>
        </div>
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
              ¿Ha sido aprobada por el área de TI? 
          </Typography>
          <Typography className={classes.texto}>
            {rfp.aprobadaAreaTI}
          </Typography>
        </div>
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
            ¿Tiene un presupuesto asignado? 
          </Typography>
          <Typography className={classes.texto}>
            {rfp.presupuestoAsignado}
          </Typography>
        </div>
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
            Tipo general del proyecto
          </Typography>
          <Typography className={classes.texto}>
            {rfp.tipoGeneralProyecto}
          </Typography>
        </div>
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
            Tipo específico del proyecto
          </Typography>
          <Typography className={classes.texto}>
            {rfp.tipoEspecificoProyecto}
          </Typography>
        </div>
        {rfp.comentariosAdicionales === '' ? null : (
          <>
            <Typography className={classes.estatus}>
              Comentarios adicionales
            </Typography>
            <Typography className={classes.texto}>
              {rfp.comentariosAdicionales}
            </Typography>
          </>
        )}
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
            Feha de la primer reunión: 
          </Typography>
          <Typography className={classes.texto}>
            {rfp.fechaCita}
          </Typography>
        </div>
        <Typography className={classes.contacto}>
          Datos de contacto
        </Typography>
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
            Nombre: 
          </Typography>
          <Typography className={classes.texto}>
            {rfp.nombrecliente}
          </Typography>
        </div>
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
            Posición: 
          </Typography>
          <Typography className={classes.texto}>
            {rfp.posicioncliente}
          </Typography>
        </div>
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
            Teléfono: 
          </Typography>
          <Typography className={classes.texto}>
            {rfp.telefono}
          </Typography>
        </div>
        <div className={classes.containerText}>
          <Typography className={classes.estatus}>
            Correo electrónico: 
          </Typography>
          <Typography className={classes.texto}>
            {rfp.email}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
          <div className={classes.contenedorBotones}>
            {userType === 'socio' ? (
              <Button type="submit" variant="contained" className="boton">PARTICIPAR</Button>
            ) : (null)}
          </div>
      </CardActions>
    </Card>
    </div>
  );
}