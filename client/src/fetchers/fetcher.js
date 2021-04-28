import axios from "axios";

const config = {
  headers: {
    Authorization: "Bearer " + sessionStorage.getItem("token"),
    "Content-Type": "application/json",
  },
};

async function obtenerListaInvolucrados(user) {
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

async function actualizarEstatusSocio(participacionId, estatus, feedback) {
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

export { obtenerListaInvolucrados, actualizarEstatusSocio };
