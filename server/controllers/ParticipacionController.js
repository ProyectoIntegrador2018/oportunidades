const Participacion = require("../models/Participaciones");
const { SOCIO_ACTIVO } = require("../utils/SocioTypes");
const {
  NUEVA_PARTICIPACION,
  CAMBIO_ESTATUS_PARTICIPACION,
} = require("../utils/NotificationTypes");
const notificationQueue = require("../services/NotificationQueue");
const Event = require("../models/Event");
const User = require("../models/User");
let participacionController = {};

participacionController.createParticipacion = (rawPart, id) => {
  return new Promise((resolve, reject) => {
    rawPart.socioInvolucrado = id;
    rawPart.socioEstatus = SOCIO_ACTIVO;
    const participacion = new Participacion(rawPart);
    participacion
      .save()
      .then(() => {
        Event.find({ rfp: rawPart.rfpInvolucrado }).then((events) => {
          User.update({ _id: id }, { $push: { events: events } })
            .then((update) => {
              return;
            })
            .catch((err) => {
              return reject(err);
            });
        });
      })
      .then(() => {
        notificationQueue.add(NUEVA_PARTICIPACION, { participacion });
      })
      .then(() => {
        resolve(participacion);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

participacionController.deleteParticipacion = (id) => {
  return new Promise((resolve, reject) => {
    Participacion.findByIdAndDelete(id)
      .then((participacion) => {
        Event.find({ rfp: participacion.rfpInvolucrado }).then((events) => {
          User.update(
            { _id: participacion.socioInvolucrado },
            { $pullAll: { events: events } }
          )
            .then((update) => {
              resolve(participacion);
            })
            .catch((err) => {
              reject(err);
            });
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

participacionController.getParticipacion = (id) => {
  return new Promise((resolve, reject) => {
    Participacion.findById(id)
      .then((participacion) => {
        resolve(participacion);
      })
      .catch((error) => {
        reject({ error });
      });
  });
};

participacionController.getParticipacionByRfpAndSocioId = (rfpId, socioId) => {
  return new Promise((resolve, reject) => {
    Participacion.findOne({ rfpInvolucrado: rfpId, socioInvolucrado: socioId })
      .then((participacion) => {
        return resolve(participacion);
      })
      .catch((error) => {
        return reject({ error });
      });
  });
};

participacionController.getParticipacionesSocio = (id) => {
  return new Promise((resolve, reject) => {
    Participacion.find({ socioInvolucrado: id })
      .then((participaciones) => {
        return resolve(participaciones);
      })
      .catch((error) => {
        return reject({ error });
      });
  });
};

participacionController.getParticipacionesRFP = (id) => {
  return new Promise((resolve, reject) => {
    Participacion.find({ rfpInvolucrado: id })
      .then((participaciones) => {
        return resolve(participaciones);
      })
      .catch((error) => {
        return reject({ error });
      });
  });
};

participacionController.updateEstatusSocio = (id, estatus, feedback) => {
  return new Promise((resolve, reject) => {
    Participacion.update(
      { _id: id },
      { $set: { socioEstatus: estatus, feedback: feedback } }
    )
      .then((resp) => {
        if (estatus === "Rechazado" || estatus === "Ganador") {
          const job = {
            participacionId: id,
            estatus: estatus,
          };
          notificationQueue.add(CAMBIO_ESTATUS_PARTICIPACION, job);
          resolve(resp);
        } else {
          resolve(resp);
        }
      })
      .catch((error) => reject(error));
  });
};

module.exports = participacionController;
