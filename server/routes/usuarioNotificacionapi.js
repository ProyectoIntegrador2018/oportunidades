const express = require("express");
const userMiddleware = require("../middleware/User");
const usuarioNotificacionController = require("../controllers/UsuarioNotificacionController");

const router = express.Router();

/**
 * Route to delete a UsuarioNotificacion
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contains the UsuarioNotificacion id
 * @param {Object} res response for the request
 */
router.delete("/delete-usuario-notificacion", userMiddleware, (req, res) => {
  usuarioNotificacionController
    .deleteUsuarioNotificacion(req.query.id)
    .then(() => {
      return res.send({ success: 1 });
    })
    .catch((error) => {
      return res.status(400).send({ success: 0, error });
    });
});

router.patch("/toggle-is-read", userMiddleware, (req, res) => {
  usuarioNotificacionController
  .toggleRead(req.query.id)
  .then(() => {
    return res.send({ success: 1 });
  })
  .catch((error) => {
    return res.status(400).send({ success: 0, error });
  });
});

module.exports = router;