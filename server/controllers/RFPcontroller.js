const RFP = require("../models/RFP");
const deleteQueue = require("../services/DeleteQueue");
const deleteService = require("../services/DeleteService");
const notificationQueue = require("../services/NotificationQueue");
const {
  NUEVA_OPORTUNIDAD,
  OPORTUNIDAD_ELIMINADA,
  CAMBIO_ESTATUS,
} = require("../utils/NotificationTypes");
const { DELETE_RFP } = require("../utils/DeleteTypes");
let rfpController = {};

rfpController.createrfp = (rawRFP, id) => {
  return new Promise((resolve, reject) => {
    rawRFP.createdBy = id;
    rawRFP.createdOn = new Date();
    const rfp = new RFP(rawRFP);
    rfp
      .save()
      .then(() => {
        const job = {
          rfp: rfp,
        };
        notificationQueue.add(NUEVA_OPORTUNIDAD, job);
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
    RFP.findByIdAndDelete(id)
      .then((rfp) => {
        deleteService.deleteNotificacionesRfp(rfp._id);
        return rfp;
      })
      .then((rfp) => {
        const job = {
          rfpId: rfp._id,
        };
        deleteQueue.add(DELETE_RFP, job);
        return rfp;
      })
      .then((rfp) => {
        const job = {
          nombreCliente: rfp.nombrecliente,
          nombreOportunidad: rfp.nombreOportunidad,
        };
        notificationQueue.add(OPORTUNIDAD_ELIMINADA, job);
        return rfp;
      })
      .then((rfp) => {
        return resolve(rfp);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

rfpController.updaterfp = (id, updatedRFP) => {
  return new Promise((resolve, reject) => {
    RFP.findByIdAndUpdate(updatedRFP.id, updatedRFP)
      .then((rfp) => {
        const estatusPrevio = rfp.estatus;
        const estatusNuevo = updatedRFP.estatus;

        if (estatusPrevio == estatusNuevo) {
          return resolve(rfp);
        }

        const job = {
          rfpId: rfp._id,
          estatusPrevio: rfp.estatus,
          estatusNuevo: updatedRFP.estatus,
          nombrecliente: updatedRFP.nombreCliente,
          nombreOportunidad: updatedRFP.nombreOportunidad,
        };

        notificationQueue.add(CAMBIO_ESTATUS, job);
      })
      .then(() => {
        resolve({ success: 1 });
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

rfpController.banSocio = (rfp_id, socio_id) => {
  return new Promise((resolve, reject) => {
    RFP.findById(rfp_id).then((rfp) => {
      const curBanned = rfp.bannedSocios ? rfp.bannedSocios : [];
      RFP.findByIdAndUpdate(rfp_id, {
        bannedSocios: [...curBanned, socio_id],
      })
        .then((res) => {
          return resolve();
        })
        .catch((error) => {
          return reject({ error });
        });
    });
  });
};

rfpController.isSocioBanned = (rfp_id, socio_id) => {
  return new Promise((resolve, reject) => {
    rfpController
      .getOneRfp(rfp_id)
      .then((rfp) => {
        if (rfp.bannedSocios) {
          let isBanned = false;
          for (let idx = 0; idx < rfp.bannedSocios.length; idx++) {
            if (socio_id.toString() === rfp.bannedSocios[idx].toString()) {
              isBanned = true;
            }
          }
          return resolve(isBanned);
        } else {
          return resolve(false);
        }
      })
      .catch((error) => {
        return reject({ error });
      });
  });
};

module.exports = rfpController;
