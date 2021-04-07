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
const mailService = require("./MailService");
const mailQueue = require("./MailQueue");

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

const mailTodosSocios = function (tipoNotificacion, rfp) {
  return new Promise((resolve, reject) => {
    mailService.buildMailContent(tipoNotificacion, rfp)
      .then((mailContent) => {
        UserModel.findByUserType("socio")
          .then((socios) => {
            socios.map((socio) => {
              const jobMail = {
                mailContent: mailContent,
                destinatario: {
                  name: socio.name,
                  email: socio.email,
                }
              };
              mailQueue.add(tipoNotificacion, jobMail, { attempts: 3 });

              resolve({ status: 200 });
            });
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionNuevaOportunidad = (job) => {
  return new Promise((resolve, reject) => {
    // const detalles = { rfp: job.data.rfp._id };
    const detalles = { rfp: job.rfp._id };
    notificacionTodosSocios(NUEVA_OPORTUNIDAD, detalles)
      .then((resp) => {
        resolve(resp);
        /*
        mailTodosSocios(NUEVA_OPORTUNIDAD, job.data.rfp)
          .then((respMail) => {
            resolve(respMail);
          })
          .catch((error) => reject(error));
        */
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

const saveDbNotificacionNuevaParticipacion = function (participacion) {
  return new Promise((resolve, reject) => {
    const detalles = {
      rfp: participacion.rfpInvolucrado,
      participante: participacion.socioInvolucrado,
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
        const rfpId = detalles.rfp;
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

const mailNuevaParticipacion = function (participacion) {
  return new Promise((resolve, reject) => {
    const detalles = {
      rfp: participacion.rfpInvolucrado,
      participante: participacion.socioInvolucrado,
    };
    RfpModel.findById(detalles.rfp)
      .then((rfp) => {
        UserModel.findById(detalles.participante)
          .then((participante) => {
            const rfpMail = {
              nombreOportunidad: rfp.nombreOportunidad,
              participanteName: participante.name
            };
            mailService.buildMailContent(NUEVA_PARTICIPACION, rfpMail)
              .then((mailContent) => {
                UserModel.findById(rfp.createdBy)
                  .then((cliente) => {
                    const jobMail = {
                      mailContent: mailContent,
                      destinatario: {
                        name: cliente.name,
                        email: cliente.email
                      }
                    };
                    mailQueue.add(NUEVA_PARTICIPACION, jobMail, { attempts: 3 });

                    resolve({ status: 200 });
                  })
                  .catch((error) => reject(error));
              })
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionNuevaParticipacion = (participacion) => {
  return new Promise((resolve, reject) => {
    saveDbNotificacionNuevaParticipacion(participacion)
      .then((resp) => {
        mailNuevaParticipacion(participacion)
          .then((respMail) => {
            resolve(respMail);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
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
