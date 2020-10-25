import React from 'react';
import {useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import FabEditRFP from "../ui/FabEditRFP";

const useStyles = makeStyles({
  root: {
    minWidth: 250,
    maxWidth: 400,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: '#EE5D36',
  },
  description: {
    fontSize: 14,
  },
  estatus: {
    fontSize: 16,
    fontWeight: 800,
    textAlign: 'left',
    marginRight: '1em',
  },
  texto: {
    fontSize: 16,
    textAlign: 'left',
  },
  containerText: {
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

  return (
    <div className="rfp-card">
    <Card className={classes.root}>
    <FabEditRFP  rfp={rfp} />
      <CardContent>
        <Typography className={classes.title}>
          {rfp.nombreOportunidad}
        </Typography>
        <Typography className={classes.description} gutterBottom>
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
      </CardContent>
      <CardActions>
          <div className={classes.contenedorBotones}>
            <Button size="small" onClick={() => { navigate('/detalle', {state: {rfp: rfp}});}}>SABER MÁS</Button>
          </div>
      </CardActions>
    </Card>
    </div>
  );
}