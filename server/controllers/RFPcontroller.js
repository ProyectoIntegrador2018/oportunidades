const RFP = require("../models/RFP");
const notificationQueue = require("../services/NotificationQueue");
const notificationService = require("../services/NotificationService");
const {
  NUEVA_OPORTUNIDAD,
  OPORTUNIDAD_ELIMINADA,
} = require("../utils/NotificationTypes");

let rfpController = {};

rfpController.createrfp = (rawRFP, id) => {
  return new Promise((resolve, reject) => {
    rawRFP.createdBy = id;
    const rfp = new RFP(rawRFP);
    rfp
      .save()
      .then(() => {
        const job = {
          rfp: rfp,
        };
        // return notificationQueue.add(NUEVA_OPORTUNIDAD, job);
        return notificationService
          .notificacionNuevaOportunidad(job)
          .then((resp) => resp)
          .catch((error) => reject(error));
      })
      .then(() => {
        resolve(rfp);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const createNewRFP = function (req, res) {
  const mirfp = new RFP({
    ...req.body,
    createdBy: req.user._id,
  });
  mirfp
    .save()
    .then(function () {
      return res.send(mirfp);
    })
    .catch(function (error) {
      return res.status(400).send({ error: error });
    });
};

rfpController.deleterfp = (id) => {
  return new Promise((resolve, reject) => {
    notificationService
      .deleteNotificacionesRfp(id)
      .then(() => {
        RFP.findByIdAndDelete(id)
          .then((rfp) => {
            const job = {
              nombreOportunidad: rfp.nombreOportunidad,
            };
            // notificationQueue.add(OPORTUNIDAD_ELIMINADA, job);
            notificationService
              .notificacionOportunidadEliminada(job)
              .then((resp) => resp)
              .catch((error) => reject(error));
            return rfp;
          })
          .then((rfp) => {
            return resolve(rfp);
          })
          .catch((error) => {
            return reject(error);
          });
      })
      .catch((error) => reject(error));
  });
};

rfpController.updaterfp = (id, updatedRFP) => {
  return new Promise((resolve, reject) => {
    RFP.findByIdAndUpdate(updatedRFP.id, updatedRFP)
      .then((rfp) => {
        return resolve(rfp);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

rfpController.getrfp = () => {
  return new Promise((resolve, reject) => {
    RFP.find()
      .then((rfps) => {
        return resolve(rfps);
      })
      .catch((error) => {
        return reject({ error });
      });
  });
};

rfpController.getrfpSocio = () => {
  return new Promise((resolve, reject) => {
    RFP.find({ estatus: "Activo" })
      .then((rfps) => {
        return resolve(rfps);
      })
      .catch((error) => {
        return reject({ error });
      });
  });
};

rfpController.getrfpCliente = (id) => {
  return new Promise((resolve, reject) => {
    RFP.find({ createdBy: id })
      .then((rfps) => {
        return resolve(rfps);
      })
      .catch((error) => {
        return reject({ error });
      });
  });
};

rfpController.getOneRfp = (rfp_id) => {
  return new Promise((resolve, reject) => {
    RFP.findById(rfp_id)
      .then((rfp) => {
        return resolve(rfp);
      })
      .catch((error) => {
        return reject({ error });
      });
  });
};

module.exports = rfpController;
