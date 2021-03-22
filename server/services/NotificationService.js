const UserModel = require("../models/User");
const RfpModel = require("../models/RFP");
const { NUEVA_OPORTUNIDAD, NUEVA_PARTICIPACION } = require("../utils/NotificationTypes");
const detallesNotifController = require("../controllers/DetallesNotificacionController");
const notificacionController = require("../controllers/NotificacionController");
const usuarioNotificacion = require("../controllers/UsuarioNotificacionController");

const notificationService = {};

notificationService.notificacionNuevaOportunidad = (job) => {
  return new Promise((resolve, reject) => {
    const detalles = { rfp: job.rfpId };
    detallesNotifController
      .createDetalles(detalles)
      .then((detallesNotif) => {
        const rawNotificacion = {
          tipo: NUEVA_OPORTUNIDAD,
          date: new Date(),
          detalles: detallesNotif._id,
        };
        return notificacionController
          .createNotificacion(rawNotificacion)
          .then((notificacion) => {
            return notificacion;
          })
          .catch((error) => {
            reject(error);
          });
      })
      .then((notificacion) => {
        UserModel.findByUserType("socio").then((socios) => {
          socios.map((socio) => {
            const rawUsuarioNotif = {
              read: false,
              notificacion: notificacion._id,
              user: socio._id,
            };
            usuarioNotificacion
              .createUsuarioNotificacion(rawUsuarioNotif)
              .then((usuarioNotif) => {
                UserModel.findById(socio._id)
                  .then((user) => {
                    user.addNotificacion(usuarioNotif._id);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              })
              .catch((error) => {
                reject(error);
              });
          });
          resolve();
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

notificationService.notificacionNuevaParticipacion = (participacion) => {
  return new Promise((resolve, reject) => {
    const detalles = {
      rfpInvolucrado: participacion.rfpInvolucrado,
      socioInvolucrado: participacion.socioInvolucrado,
    };
    detallesNotifController
      .createDetalles(detalles)
      .then((detallesNotif) => {
        const rawNotificacion = {
          tipo: NUEVA_PARTICIPACION,
          date: new Date(),
          detalles: detallesNotif._id,
        };
        return notificacionController
          .createNotificacion(rawNotificacion)
          .then((notificacion) => {
            return notificacion;
          })
          .catch((error) => {
            reject(error);
          });
      })
      .then((notificacion) => {
        const rfpId = detalles.rfpInvolucrado;
        RfpModel.getCreatedBy(rfpId)
          .then((userId) => {
            UserModel.findById(userId)
              .then((cliente) => {
                const rawUsuarioNotif = {
                  read: false,
                  notificacion: notificacion._id,
                  user: cliente._id,
                };
                usuarioNotificacion
                  .createUsuarioNotificacion(rawUsuarioNotif)
                  .then((usuarioNotif) => {
                    UserModel.findById(cliente._id)
                      .then((user) => {
                        user.addNotificacion(usuarioNotif._id);
                        resolve();
                      })
                      .catch((error) => {
                        reject(error);
                      });
                  })
                  .catch((error) => {
                    reject(error);
                  });
              })
              .catch((error) => {
                reject(error);
              })
          .catch((error) => {
            reject(error);
          })
      })
      .catch((error) => {
        reject(error);
      });
    });
  });
};

module.exports = notificationService;
