const express = require("express");
const multer = require("multer");
const { mongo, connection } = require("mongoose");
const userMiddleware = require("../middleware/User");
const participacionController = require("../controllers/ParticipacionController");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
Grid.mongo = mongo;

const router = express.Router();

// Init GridFS
const gfs = Grid(connection.db, mongo);
gfs.collection('fileUploads');

// Create storage engine
const storage = GridFsStorage({
  db: connection.db,
  file: (req, file) => {
    const fileNum = req.body.fileNumber;
    const userId = eq.user._id;
    return {
      filename: `${file.originalname}_${userId}_${fileNum}.pdf`,
    };
  },
});
const upload = multer({ storage });

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

/**
 * Ruta para actualizar el estatus de un socio participante
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene el id del rfp
 * @param {Object} res respuesta del request
 */
router.post("/update-estatus-socio/:id", userMiddleware, (req, res) => {
  const participacionId = req.params.id;
  const estatus = req.body.estatus;
  const feedback = req.body.feedback ? req.body.feedback : "";
  participacionController
    .updateEstatusSocio(participacionId, estatus, feedback)
    .then((resp) => {
      return res.send(resp);
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(400).send({ error });
    });
});

/**
 * Ruta para que un socio pueda subir un archivo a gridfs
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene el id del rfp
 * @param {Object} res respuesta del request
 */
router.post("/upload-file", [userMiddleware, upload.single("file")], (req, res) => {
  if (req.file) {
    return res.send({ file: req.file });
  }
  return res.status(400).send({ success: false });
});

/**
 * Ruta para que un socio pueda subir un archivo a gridfs
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene el id del rfp
 * @param {Object} res respuesta del request
 */
router.delete("/delete-file/:id", userMiddleware, (req, res) => {
  gfs.remove({ _id: req.params.fileId }, (error) => {
    if (error) return res.status(400).send({ error });
    res.sendStatus(204);
  });
});

router.get("/ping", userMiddleware, (req, res) => {
  return res.send({ info: "ping is working for authorized user" });
});

module.exports = router;
