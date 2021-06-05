import axios from "axios";

let config = {
  headers: {
    Authorization: "Bearer " + sessionStorage.getItem("token"),
    "Content-Type": "application/json",
  },
};

function updateConfig() {
  let currentConfig = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };
  config = currentConfig;
}

async function obtenerSocio(user) {
  updateConfig();
  const response = await axios
    .get("/user/get-socio/" + user, config)
    .then((res) => {
      return res.data.user;
    })
    .catch((error) => {
      return error;
    });
  return response;
}

async function obtenerListaParticipaciones(rfp_id) {
  updateConfig();
  const response = await axios
    .get("/participacion/get-participaciones-rfp/" + rfp_id, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
}

async function obtenerFileNamesParticipaciones(participacionId) {
  updateConfig();
  const response = await axios
    .get("/participacion/get-files/" + participacionId, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
}

async function getFile(filename) {
  updateConfig();
  const response = await axios
    .get("/participacion/get-file/" + filename, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
}

async function getBase64File(filename) {
  updateConfig();

  const response = await axios
    .get("/participacion/get-base64-file/" + filename, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
}

async function obtenerRFP(rfp_id) {
  updateConfig();
  const response = await axios
    .get("/RFP/get-one-rfp/" + rfp_id, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
}

async function actualizarEstatusSocio(participacionId, estatus, feedback) {
  updateConfig();
  axios
    .post(
      "/participacion/update-estatus-socio/" + participacionId,
      {
        estatus: estatus,
        feedback: feedback,
      },
      config
    )
    .then((res) => {
      // TODO: Handle close of the modal
    })
    .catch((error) => {
      console.log(error);
    });
}

async function deleteEvento(event_id) {
  updateConfig();
  const response = await axios
    .delete("/events/" + event_id, config)
    .catch((error) => {
      return error;
    });
  return response;
}

async function obtenerEventos(rfp_id) {
  updateConfig();
  const response = await axios
    .get("/events/get-rfp-events/" + rfp_id, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
}

async function createParticipacion(rfp_id) {
  updateConfig();
  const response = await axios
    .post(
      "/participacion/create-participacion",
      { rfpInvolucrado: rfp_id },
      config
    )
    .catch((error) => {
      return error;
    });
  return response;
}

async function dejarDeParticipar(rfp_id) {
  updateConfig();
  const response = await axios
    .get("/participacion/get-participaciones-socio", config)
    .then((res) => {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].rfpInvolucrado == rfp_id) {
          return await axios
            .delete(
              "/participacion/delete-participacion-socio/" + res.data[i]._id,
              config
            )
            .catch((error) => {
              return error;
            });
        }
      }
    })
    .catch((error) => {
      return error;
    });
  return response;
}

async function socioUpdateFile(formData) {
  updateConfig();
  const response = await axios
    .post("/participacion/upload-file", formData, config)
    .catch((error) => {
      return error;
    });
  return response;
}

async function changePassword(password) {
  updateConfig();
  const response = await axios
    .patch("/user/change-password", { password }, config)
    .catch((error) => {
      return error;
    });
  return response;
}

async function userLogout() {
  updateConfig();
  const response = await axios
    .post("/user/logout", null, config)
    .catch((error) => {
      return error;
    });
  return response;
}

async function deleteRfp(rfp_id) {
  updateConfig();
  const response = await axios
    .delete("/RFP/deleterfp", config, {
      params: {
        id: rfp_id,
      },
    })
    .catch((error) => {
      return error;
    });
  return response;
}

async function updateRfp(rfpUpdatedData) {
  updateConfig();
  const response = await axios
    .patch("/RFP/updaterfp", rfpUpdatedData, config)
    .catch((error) => {
      return error;
    });
  return response;
}

async function deleteSocio(socio_id) {
  updateConfig();
  const response = await axios
    .delete("/admin/socio/" + socio_id, config)
    .catch((error) => {
      return error;
    });
  return response;
}

async function updateUser(userUpdatedData) {
  updateConfig();
  const response = await axios
    .patch("/user/", userUpdatedData, config)
    .catch((error) => {
      return error;
    });
  return response;
}

async function obtenerSocioParticipaciones() {
  updateConfig();
  const response = await axios
    .get("/participacion/get-participaciones-socio", config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
}

async function createRfp(rfpData) {
  updateConfig();
  const response = await axios
    .post("/RFP/create-rfp", rfpData, config)
    .catch((error) => {
      return error;
    });
  return response;
}

async function updateEvento(event_id, eventUpdatedData) {
  updateConfig();
  const response = await axios
    .patch("/events/" + event_id, eventUpdatedData, config)
    .catch((error) => {
      return error;
    });
  return response;
}

export {
  obtenerSocio,
  obtenerRFP,
  actualizarEstatusSocio,
  obtenerListaParticipaciones,
  obtenerFileNamesParticipaciones,
  getFile,
  getBase64File,
  deleteEvento,
  obtenerEventos,
  createParticipacion,
  dejarDeParticipar,
  socioUpdateFile,
  changePassword,
  userLogout,
  deleteRfp,
  updateRfp,
  deleteSocio,
  updateUser,
  obtenerSocioParticipaciones,
  createRfp,
  updateEvento,
};
