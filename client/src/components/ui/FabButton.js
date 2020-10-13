import React from 'react';
import {useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

export default function FloatingActionButtons() {

  // hook para redireccionar
  const navigate = useNavigate();

  return (
      <div className=" fabIcon">
        <Fab color="primary" aria-label="add" onClick={() => navigate('/registro-oportunidad')}>
            <AddIcon />
        </Fab>
    </div>
  );
}