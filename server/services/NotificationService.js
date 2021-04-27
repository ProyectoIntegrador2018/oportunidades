const UserModel = require("../models/User");
const RfpModel = require("../models/RFP");
const NotificacionModel = require("../models/Notificacion");
const ParticipacionModel = require("../models/Participaciones");
const UsuarioNotificacionModel = require("../models/UsuarioNotificacion");
const DetallesNotificacionModel = require("../models/DetallesNotificacion");
const {
  NUEVA_OPORTUNIDAD,
  OPORTUNIDAD_ELIMINADA,
  NUEVA_PARTICIPACION,
  CAMBIO_ESTATUS,
  NUEVO_EVENTO,
  PARTICIPACION_RECHAZADA,
} = require("../utils/NotificationTypes");
const detallesNotifController = require("../controllers/DetallesNotificacionController");
const notificacionController = require("../controllers/NotificacionController");
const usuarioNotificacion = require("../controllers/UsuarioNotificacionController");
const mailService = require("./MailService");
const mailQueue = require("./MailQueue");

const notificationService = {};

notificationService.notificacionNuevaOportunidad = (job) => {
  return new Promise((resolve, reject) => {
    UserModel.findByUserTypes(["socio", "admin"])
      .then((users) => {
        if (!users || users.length == 0) resolve({ success: 1 });

        // const detalles = { rfp: job.data.rfp._id };
        const detalles = { rfp: job.rfp._id };
        notificacionUsuarios(NUEVA_OPORTUNIDAD, detalles, users)
          .then((resp) => {
            resolve(resp);
            /*
          mailTodosSocios(NUEVA_OPORTUNIDAD, job.rfp)
            .then((respMail) => {
              resolve(respMail);
            })
            .catch((error) => reject(error));
          */
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionParticipacionRechazada = (job) => {
  return new Promise((resolve, reject) => {
    const participacionId = job.participacionId;
    ParticipacionModel.findById(participacionId)
      .then((participacion) => {
        const socioId = participacion.socioInvolucrado;
        UserModel.findById(socioId)
          .then((socio) => {
            const detalles = { rfp: participacion.rfpInvolucrado };
            notificacionUsuarios(PARTICIPACION_RECHAZADA, detalles, [socio])
              .then((resp) => resolve(resp))
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionOportunidadEliminada = (job) => {
  return new Promise((resolve, reject) => {
    UserModel.findByUserType("socio")
      .then((socios) => {
        if (!socios || socios.length == 0) resolve({ success: 1 });

        const detalles = {
          // detalles: job.data.nombreOportunidad,
          detalles: job.nombreOportunidad,
        };
        notificacionUsuarios(OPORTUNIDAD_ELIMINADA, detalles, socios)
          .then((resp) => {
            resolve(resp);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionCambioEstatusOportunidad = (job) => {
  return new Promise((resolve, reject) => {
    const rfpId = job.id;
    RfpModel.findById(rfpId)
      .then((rfp) => {
        if (rfp.estatus == job.estatus) resolve({ success: 1 });

        ParticipacionModel.find({ rfpInvolucrado: rfpId })
          .then((participaciones) => {
            return participaciones.map((participacion) => {
              return participacion.socioInvolucrado;
            });
          })
          .then((sociosParticipantes) => {
            const detalles = {
              rfp: rfpId,
            };
            notificacionUsuarios(CAMBIO_ESTATUS, detalles, sociosParticipantes)
              .then((resp) => resolve(resp))
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
        const rfpData = {
          nombreCliente: rfp.nombrecliente,
          nombreOportunidad: rfp.nombreOportunidad,
          estatus: rfp.estatus,
        };
        mailParticipantesRfp(CAMBIO_ESTATUS, rfpData, rfpId)
          .then((resp) => {
            resolve(resp);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

const notificacionUsuarios = function (tipoNotificacion, detalles, socios) {
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
        resolve({ success: 1 });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const mailTodosSocios = function (tipoNotificacion, rfp) {
  return new Promise((resolve, reject) => {
    UserModel.findByUserTypes(["socio", "admin"])
      .then((users) => {
        if (!users || users.length == 0) resolve({ success: 1 });

        mailUsuarios(tipoNotificacion, rfp, users)
          .then((resp) => {
            resolve(resp);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

const mailParticipantesRfp = function (tipoNotificacion, mailData, rfpId) {
  return new Promise((resolve, reject) => {
    ParticipacionModel.find({ rfpInvolucrado: rfpId })
      .then((participaciones) => {
        return participaciones.map((participacion) => {
          return participacion.socioInvolucrado;
        });
      })
      .then((idSociosParticipantes) => {
        if (!idSociosParticipantes || idSociosParticipantes.length == 0)
          resolve({ success: 1 });

        UserModel.find({ _id: idSociosParticipantes }, "name email")
          .then((sociosParticipantes) => {
            mailUsuarios(tipoNotificacion, mailData, sociosParticipantes)
              .then((resp) => {
                resolve(resp);
              })
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

const mailUsuarios = function (tipoNotificacion, mailData, usuarios) {
  return new Promise((resolve, reject) => {
    mailService
      .buildMailContent(tipoNotificacion, mailData)
      .then((mailContent) => {
        usuarios.map((usuario) => {
          const jobMail = {
            mailContent: mailContent,
            destinatario: {
              name: usuario.name,
              email: usuario.email,
            },
          };
          mailQueue.add(tipoNotificacion, jobMail, { attempts: 3 });

          resolve({ success: 1 });
        });
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
              participanteName: participante.name,
            };
            mailService
              .buildMailContent(NUEVA_PARTICIPACION, rfpMail)
              .then((mailContent) => {
                UserModel.findById(rfp.createdBy)
                  .then((cliente) => {
                    const jobMail = {
                      mailContent: mailContent,
                      destinatario: {
                        name: cliente.name,
                        email: cliente.email,
                      },
                    };
                    mailQueue.add(NUEVA_PARTICIPACION, jobMail, {
                      attempts: 3,
                    });

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
        resolve(resp);
        /*
        mailNuevaParticipacion(participacion)
          .then((respMail) => {
            resolve(respMail);
          })
          .catch((error) => reject(error));
        */
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionNuevoEvento = (evento) => {
  return new Promise((resolve, reject) => {
    mailNuevoEvento(evento)
      .then((respMail) => {
        resolve(respMail);
      })
      .catch((error) => reject(error));
  });
};

const mailNuevoEvento = function (evento) {
  return new Promise((resolve, reject) => {
    RfpModel.getNombreOportunidad(evento.rfp)
      .then((nombreOportunidad) => {
        const eventData = {
          name: evento.name,
          date: evento.date,
          link: evento.link,
          nombreOportunidad: nombreOportunidad,
        };
        mailParticipantesRfp(NUEVO_EVENTO, eventData, evento.rfp)
          .then((resp) => {
            resolve(resp);
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
