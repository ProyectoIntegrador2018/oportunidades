import React from 'react';
import {useNavigate} from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

export default function FloatingActionButtons({link}) {

  // hook para redireccionar
  const navigate = useNavigate();

  return (
      <div className="fabIcon">
        <Fab color="primary" aria-label="add" onClick={() => navigate(link)}>
            <AddIcon />
        </Fab>
    </div>
  );
}