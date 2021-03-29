const UserModel = require("../models/User");
const NotificacionModel = require("../models/Notificacion");
const UsuarioNotificacionModel = require("../models/UsuarioNotificacion");
const DetallesNotificacionModel = require("../models/DetallesNotificacion");
const { NUEVA_OPORTUNIDAD } = require("../utils/NotificationTypes");
const detallesNotifController = require("../controllers/DetallesNotificacionController");
const notificacionController = require("../controllers/NotificacionController");
const usuarioNotificacion = require("../controllers/UsuarioNotificacionController");

const notificationService = {};

notificationService.notificacionNuevaOportunidad = (job) => {
  return new Promise((resolve, reject) => {
    const detalles = { rfp: job.data.rfpId };
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

notificationService.deleteNotificacionesRfp = (rfpId) => {
  return new Promise((resolve, reject) => {
    DetallesNotificacionModel.findDetallesNotificacionByRfpId(rfpId)
      .then((detallesNotificaciones) => {
        const detallesNotifIds = detallesNotificaciones.map((detalles) => {
          return detalles._id;
        });
        return DetallesNotificacionModel.deleteManyDetallesNotificacionByIds(
          detallesNotifIds
        )
          .then((deleteResp) => {
            return detallesNotifIds;
          })
          .catch((error) => {
            reject(error);
          });
      })
      .then((detallesNotifIds) => {
        return NotificacionModel.findNotificacionByDetallesNotifIds(detallesNotifIds)
          .then((notificaciones) => {
            const notifIds = notificaciones.map((notificaciones) => {
              return notificaciones._id;
            });
            return NotificacionModel.deleteManyNotificacionByIds(notifIds)
              .then((deleteResp) => {
                return notifIds;
              })
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
      })
      .then((notifIds) => {
        UsuarioNotificacionModel.findUsuarioNotificacionByNotificacionIds(
          notifIds
        )
          .then((usuarioNotificaciones) => {
            return usuarioNotificaciones.map((usuarioNotificacion) => {
              const {
                user: userId,
                notificacion: notifId,
              } = usuarioNotificacion;
              UserModel.findById(userId)
                .then((user) => {
                  user.notificaciones.pull({ _id: notifId });
                  user
                    .save()
                    .then(() => {
                      return;
                    })
                    .catch((error) => reject(error));
                })
                .catch((error) => reject(error));
              return notifId;
            });
          })
          .then((usuarioNotifIds) => {
            UsuarioNotificacionModel.deleteManyUsuarioNotifByIds(
              usuarioNotifIds
            )
              .then((deleteResp) => {
                resolve();
              })
              .catch((error) => reject(error));
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => reject(error));
  });
};

module.exports = notificationService;
