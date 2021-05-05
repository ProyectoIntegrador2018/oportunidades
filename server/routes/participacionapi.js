const express = require("express");
const userMiddleware = require("../middleware/User");
const participacionController = require("../controllers/ParticipacionController");
const notificationService = require("../services/NotificationService");

const router = express.Router();

/**
 * Ruta para registrar la participación de un socio en una Oportunidad.
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene la información de la participación en el body.
 * @param {Object} res respuesta del request.
 */
router.post("/create-participacion", userMiddleware, (req, res) => {
  let id = req.user._id;
  participacionController
    .createParticipacion(req.body, id)
    .then((participacion) => {
      return res.send({
        success: 1,
        participacion: participacion,
      });
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(400).send({ error });
    });
});

/**
 * Ruta para eliminar la participación de un socio en una Oportunidad
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene la información de la participación en el body.
 * @param {Object} res respuesta del request.
 */
router.delete("/delete-participacion-socio/:id", userMiddleware, (req, res) => {
  participacionController
    .deleteParticipacion(req.params.id)
    .then((participacion) => {
      return res.send({ participacion });
    })
    .catch((error) => {
      return res.status(400).send({ error });
    });
});

/**
 * Ruta para obtener las participaciones en las que esté involucrado un socio
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene el id del socio
 * @param {Object} res respuesta del request
 */
router.get("/get-participaciones-socio", userMiddleware, (req, res) => {
  participacionController
    .getParticipacionesSocio(req.user.id)
    .then((participaciones) => {
      return res.send(participaciones);
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(400).send({ error });
    });
});

/**
 * Ruta para obtener las participaciones de un RFP en específico
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene el id del rfp
 * @param {Object} res respuesta del request
 */
router.get("/get-participaciones-rfp/:id", userMiddleware, (req, res) => {
  participacionController
    .getParticipacionesRFP(req.params.id)
    .then((participaciones) => {
      return res.send(participaciones);
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(400).send({ error });
    });
});

router.post("/update-estatus-socio/:id", userMiddleware, (req, res) => {
  const participacionId = req.params.id;
  const estatus = req.body.estatus;
  const feedback = req.body.feedback ? req.body.feedback : "";
  participacionController
    .updateEstatusSocio(participacionId, estatus, feedback)
    .then((resp) => {
      if (estatus === "Rechazado" || estatus === "Ganador") {
        const job = {
          participacionId: participacionId,
          estatus: estatus,
        };
        notificationService
          .notificacionCambioEstatusParticipante(job)
          .then((resp) => {
            return resp;
          })
          .catch((error) => {
            console.log("error", error);
            return res.status(400).send({ error });
          });
      }
      return resp;
    })
    .then((resp) => {
      return res.send(resp);
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(400).send({ error });
    });
});

router.get("/ping", userMiddleware, (req, res) => {
  return res.send({ info: "ping is working for authorized user" });
});

module.exports = router;
