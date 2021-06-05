import React from 'react';
import {useNavigate} from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteRfp } from '../../fetchers/fetcher';

export default function FloatingActionButtons({rfp}) {

  // hook para redireccionar
  const navigate = useNavigate();

  const handleDelete = () => {
    deleteRfp(rfp._id)
      .then(() => {
        navigate("/inicio");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
      <div className="editIconContainer-flex">
        <div className="editIcon">
          <Fab size="small" color="inherit" aria-label="edit" onClick={() => { navigate('/editar-oportunidad', {state: {rfp: rfp}});}}>
            <EditIcon />
          </Fab>
        </div>
        <div className="editIcon">
          <Fab size="small" color="inherit" aria-label="edit" onClick={() => {handleDelete()}}>
              <DeleteIcon />
          </Fab>
        </div>
      </div>
  );
}