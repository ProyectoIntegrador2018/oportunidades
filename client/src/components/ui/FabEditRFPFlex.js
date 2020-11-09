import React from 'react';
import {useNavigate} from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';

export default function FloatingActionButtons({rfp}) {

  // hook para redireccionar
  const navigate = useNavigate();

  const handleDelete = () => {
    axios
      .delete("/RFP/deleterfp", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        params: {
          id: rfp._id
        }
      })
      .then((res) => {
        // redireccionar
        navigate('/inicio');
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