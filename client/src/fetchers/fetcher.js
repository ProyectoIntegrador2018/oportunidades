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

async function isSocioBanned(rfp_id) {
  updateConfig();
  const response = await axios
    .get("/RFP/is-socio-banned/" + rfp_id, config)
    .then((res) => {
      return res.data;
    })
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
  isSocioBanned,
};
