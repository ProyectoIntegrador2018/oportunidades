const ParticipacionFileController = require("../controllers/ParticipacionFileController");
const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const { mongo, connection } = require("mongoose");
const userMiddleware = require("../middleware/User");
const participacionController = require("../controllers/ParticipacionController");
const { FILE_COLLECTION } = require("../config/filesConfig");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const rfpController = require("../controllers/RFPcontroller");
Grid.mongo = mongo;

const router = express.Router();

// Init GridFS
const gfs = Grid(connection.db, mongo);
gfs.collection(FILE_COLLECTION);

// Create storage engine
const storage = GridFsStorage({
  db: connection.db,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: FILE_COLLECTION,
          aliases: file.originalname,
        };
        resolve(fileInfo);
      });
    });
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
    .getParticipacion(req.params.id)
    .then((participacion) => {
      rfpController
        .banSocio(participacion.rfpInvolucrado, participacion.socioInvolucrado)
        .then(() => {
          participacionController
            .deleteParticipacion(req.params.id)
            .then((participacion) => {
              return res.send({ participacion });
            })
            .catch((error) => {
              return res.status(400).send({ error });
            });
        })
        .catch((error) => {
          return res.status(400).send({ error });
        });
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
router.get("/get-participacion/:rfpId", userMiddleware, (req, res) => {
  participacionController
    .getParticipacionByRfpAndSocioId(req.params.rfpId, req.user.id)
    .then((participacion) => {
      return res.send(participacion);
    })
    .catch((error) => {
      console.log("error", error);
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
router.post(
  "/upload-file",
  [userMiddleware, upload.single("file")],
  (req, res) => {
    if (req.file) {
      ParticipacionFileController.createParticipacionFile(
        req.query.rfpInvolucrado,
        req.user._id,
        req.file.filename,
        req.file.originalname
      )
        .then(() => {
          return res.send({ file: req.file });
        })
        .catch((err) => console.log(err));
    } else {
      return res.status(400).send({ success: false });
    }
  }
);

/**
 * Ruta para recibir la información de un archivo
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene el nombre del archivo en la DB
 * @param {Object} res respuesta del request
 */
router.get("/get-file/:filename", userMiddleware, (req, res) => {
  gfs.files.findOne({ aliases: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    return res.json(file);
  });
});

/**
 * Ruta para recibir la información binaria de un archivo convertida a formato base64
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene el nombre del archivo en la DB
 * @param {Object} res respuesta del request
 */
router.get("/get-base64-file/:filename", userMiddleware, (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    const readstream = gfs.createReadStream(file.filename);
    const bufs = [];
    readstream.on("data", function (chunk) {
      bufs.push(chunk);
    });

    readstream.on("end", function () {
      const fbuf = Buffer.concat(bufs);
      const base64 = fbuf.toString("base64");

      const fileData = {
        base64: base64,
        contentType: file.contentType,
      };

      res.status(200).send(fileData);
    });
  });
});

/**
 * Ruta para que un socio pueda borrar un archivo previamente subido a gridfs
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene el id del archivo
 * @param {Object} res respuesta del request
 */
 router.delete("/delete-file/:filename", userMiddleware, (req, res) => {
  ParticipacionFileController.deleteParticipacionFile(req.params.filename)
    .then(() => {
      gfs.remove({ filename: req.params.filename, root: FILE_COLLECTION }, (error) => {
        if (error) return res.status(404).send({ error });
        res.sendStatus(204);
      });
    })
    .catch((error) => {
      return res.status(404).send({ error });
    });
});

/**
 * Ruta para encontrar archivos de cada participacion
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contiene el id de la participacion
 * @param {Object} res respuesta del request
 */
router.get("/get-files/:participacionId", userMiddleware, (req, res) => {
  ParticipacionFileController.getFilesFromParticipacion(
    req.params.participacionId
  )
    .then((filenames) => {
      return res.send(filenames);
    })
    .catch((error) => {
      return res.status(400).send({ error });
    });
});

router.get("/ping", userMiddleware, (req, res) => {
  return res.send({ info: "ping is working for authorized user" });
});

module.exports = router;
