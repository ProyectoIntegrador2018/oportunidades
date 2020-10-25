const express = require("express");
const userMiddleware = require("../middleware/User");
const participacionController = require("../controllers/ParticipacionController");

const router = express.Router();

/**
 * Ruta para registrar la participación de un socio en una Oportunidad.
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene la información de la participación en el body.
 * @param {Object} res respuesta del request.
 */

router.post("/participar-socio-oportunidad", userMiddleware, (req, res) => {
   let id = req.user._id;
   participacionController
      .createParticipacion(req.body, id)
      .then((participacion) => {
         return res.send({
           success: 1,
           rfp: rfp,
         });
      })
      .catch((error) => {
         console.log("error", error)
         return res.status(400).send({ error });
      });
});

/**
 * Ruta para eliminar la participación de un socio en una Oportunidad
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene la información de la participación en el body.
 * @param {Object} res respuesta del request.
 */
router.delete('/delete-participacion-socio', userMiddleware, (req, res) => {
  participacionController
     .deleteParticipacion(req)
     .then(() => {
        return res.send();
     })
     .catch((error) => {
        return res.status(400).send({ error });
     });
});

/**
 * Route to get the existing RFPs que hayan sido creadas por cierto id
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contains the RFP's data in its body.
 * @param {Object} res response for the request
 */

router.get("/get-participaciones-socio", userMiddleware, (req, res) => {
   participacionController
      .getParticipacionesSocio(req.user.id)
      .then(
         (rfps) => {return res.send(participaciones)}
      )
      .catch((error) => {
         console.log("error", error)
         return res.status(400).send({ error });
      });
});



router.get("/ping", userMiddleware, (req, res) => {
   return res.send({info: "ping is working for authorized user"})
});

module.exports = router;
