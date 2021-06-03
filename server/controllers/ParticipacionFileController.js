const ParticipacionFile = require("../models/ParticipacionFile");
const Participacion = require("../models/Participaciones");

const participacionFile = {};

participacionFile.createParticipacionFile = (rfpInvolucrado, socioInvolucrado, filename, originalname) => {
  return new Promise((resolve, reject) => {
    Participacion.findOne({ rfpInvolucrado: rfpInvolucrado, socioInvolucrado: socioInvolucrado }, "_id")
      .then((participacion) => {
        const rawParticipacionFile = {
          participacion: participacion._id,
          name: filename,
          originalname: originalname,
        }
        const participacionFile = new ParticipacionFile(rawParticipacionFile);
        participacionFile
          .save()
          .then(() => {
            resolve(participacionFile);
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

participacionFile.getFilesFromParticipacion = (participacionId) => {
  return new Promise((resolve, reject) => {
    ParticipacionFile.find({ participacion: participacionId }, "originalname")
      .then((files) => {
        const filenames = files.map((file) => {
          return file.originalname;
        });
        resolve(filenames);
      })
      .catch((err) => reject(err));
  });
}

module.exports = participacionFile;
