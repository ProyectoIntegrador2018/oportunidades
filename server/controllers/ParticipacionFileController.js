const Participacion = require("../models/Participaciones");
const ParticipacionFile = require("../models/ParticipacionFile");
const notificationQueue = require("../services/NotificationQueue");
const { PARTICIPACION_NUEVO_ARCHIVO } = require("../utils/NotificationTypes");

const participacionFile = {};
const SUCCESS_RESP = { success: 1 };

participacionFile.createParticipacionFile = (
  rfpInvolucrado,
  socioInvolucrado,
  filename,
  originalname
) => {
  return new Promise((resolve, reject) => {
    Participacion.findOne(
      {
        rfpInvolucrado: rfpInvolucrado,
        socioInvolucrado: socioInvolucrado,
      },
      "_id"
    )
      .then((participacion) => {
        const rawParticipacionFile = {
          participacion: participacion._id,
          name: filename,
          originalname: originalname,
        };
        const participacionFile = new ParticipacionFile(rawParticipacionFile);
        participacionFile
          .save()
          .then(() => {
            const job = {
              rfpInvolucrado: rfpInvolucrado,
              socioInvolucrado: socioInvolucrado,
              originalname: originalname,
            };
            notificationQueue.add(PARTICIPACION_NUEVO_ARCHIVO, job);
            resolve(SUCCESS_RESP);
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

participacionFile.deleteParticipacionFile = (filename) => {
  return new Promise((resolve, reject) => {
    ParticipacionFile.deleteOne({ name: filename })
      .then((participacionFile) => {
        resolve(participacionFile);
      })
      .catch((err) => reject(err));
  });
};

participacionFile.getFilesFromParticipacion = (participacionId) => {
  return new Promise((resolve, reject) => {
    ParticipacionFile.find({ participacion: participacionId }, "name originalname")
      .then((files) => {
        const filenames = files.map((file) => {
          return {
            name: file.name,
            originalname: file.originalname
          };
        });
        resolve(filenames);
      })
      .catch((err) => reject(err));
  });
};

module.exports = participacionFile;
