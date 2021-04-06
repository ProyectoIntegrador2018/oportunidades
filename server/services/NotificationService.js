const UserModel = require("../models/User");
const RfpModel = require("../models/RFP");
const NotificacionModel = require("../models/Notificacion");
const UsuarioNotificacionModel = require("../models/UsuarioNotificacion");
const DetallesNotificacionModel = require("../models/DetallesNotificacion");
const {
  NUEVA_OPORTUNIDAD,
  OPORTUNIDAD_ELIMINADA,
  NUEVA_PARTICIPACION,
} = require("../utils/NotificationTypes");
const detallesNotifController = require("../controllers/DetallesNotificacionController");
const notificacionController = require("../controllers/NotificacionController");
const usuarioNotificacion = require("../controllers/UsuarioNotificacionController");

const notificationService = {};

const notificacionTodosSocios = function (tipoNotificacion, detalles) {
  return new Promise((resolve, reject) => {
    detallesNotifController
      .createDetalles(detalles)
      .then((detallesNotif) => {
        const rawNotificacion = {
          tipo: tipoNotificacion,
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
          resolve({ status: 200 });
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

notificationService.notificacionNuevaOportunidad = (job) => {
  return new Promise((resolve, reject) => {
    // const detalles = { rfp: job.data.rfpId };
    const detalles = { rfp: job.rfpId };
    notificacionTodosSocios(NUEVA_OPORTUNIDAD, detalles)
      .then((resp) => {
        resolve(resp);
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionOportunidadEliminada = (job) => {
  return new Promise((resolve, reject) => {
    const detalles = {
      // detalles: job.data.nombreOportunidad,
      detalles: job.nombreOportunidad,
    };
    notificacionTodosSocios(OPORTUNIDAD_ELIMINADA, detalles)
      .then((resp) => {
        resolve(resp);
      })
      .catch((error) => reject(error));
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
                        resolve({ status: 200 });
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
              });
          })
          .catch((error) => {
            reject(error);
          });
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
        return NotificacionModel.findNotificacionByDetallesNotifIds(
          detallesNotifIds
        )
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
        return UsuarioNotificacionModel.findUsuarioNotificacionByNotificacionIds(
          notifIds
        )
          .then((usuarioNotificaciones) => {
            return usuarioNotificaciones.map((usuarioNotificacion) => {
              const { user: userId, _id: usuarioNotifId } = usuarioNotificacion;
              UserModel.findById(userId)
                .then((user) => {
                  user.notificaciones.pull({ _id: usuarioNotifId });
                  user.save();
                })
                .catch((error) => reject(error));
              return usuarioNotifId;
            });
          })
          .then((usuarioNotifIds) => {
            UsuarioNotificacionModel.deleteManyUsuarioNotifByIds(
              usuarioNotifIds
            )
              .then((deleteResp) => {
                resolve({ status: 200 });
              })
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = notificationService;
