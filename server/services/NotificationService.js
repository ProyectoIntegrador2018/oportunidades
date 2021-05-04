const UserModel = require("../models/User");
const RfpModel = require("../models/RFP");
const EventModel = require("../models/Event");
const NotificacionModel = require("../models/Notificacion");
const ParticipacionModel = require("../models/Participaciones");
const UsuarioNotificacionModel = require("../models/UsuarioNotificacion");
const DetallesNotificacionModel = require("../models/DetallesNotificacion");
const {
  NUEVA_OPORTUNIDAD,
  OPORTUNIDAD_ELIMINADA,
  NUEVA_PARTICIPACION,
  NUEVO_EVENTO,
  CAMBIO_EVENTO,
  CAMBIO_ESTATUS,
  PARTICIPACION_RECHAZADA,
  EVENTO_ELIMINADO,
} = require("../utils/NotificationTypes");
const detallesNotifController = require("../controllers/DetallesNotificacionController");
const notificacionController = require("../controllers/NotificacionController");
const usuarioNotificacion = require("../controllers/UsuarioNotificacionController");
const mailService = require("./MailService");
const mailQueue = require("./MailQueue");

const notificationService = {};
const SUCCESS_RESP = { success: 1 };
const MAIL_ENABLED = false;

notificationService.notificacionNuevaOportunidad = (job) => {
  return new Promise((resolve, reject) => {
    UserModel.findByUserTypes(["socio", "admin"], "name email")
      .then((users) => {
        if (!users || users.length == 0) {
          return resolve(SUCCESS_RESP);
        }

        // const detalles = { rfp: job.data.rfp._id };
        const detalles = { rfp: job.rfp._id };
        notificacionUsuarios(NUEVA_OPORTUNIDAD, detalles, users)
          .then((resp) => {
            if (MAIL_ENABLED) {
              mailUsuarios(NUEVA_OPORTUNIDAD, job.rfp, users)
                .then((respMail) => {
                  resolve(respMail);
                })
                .catch((error) => reject(error));
            } else {
              resolve(resp);
            }
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionOportunidadEliminada = (job) => {
  return new Promise((resolve, reject) => {
    UserModel.findByUserType("socio", "_id")
      .then((socios) => {
        if (!socios || socios.length == 0) {
          return resolve(SUCCESS_RESP);
        }

        const detalles = {
          // detalles: job.data.nombreOportunidad,
          nombreCliente: job.nombreCliente,
          detalles: job.nombreOportunidad,
        };
        notificacionUsuarios(OPORTUNIDAD_ELIMINADA, detalles, socios)
          .then((resp) => {
            if (MAIL_ENABLED) {
              mailUsuarios(OPORTUNIDAD_ELIMINADA, detalles, socios)
                .then((respMail) => {
                  resolve(respMail);
                })
                .catch((error) => reject(error));
            } else {
              resolve(resp);
            }
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
      .select("estatus nombrecliente nombreOportunidad")
      .then((rfp) => {
        const estatusPrevio = rfp.estatus;
        const estatusNuevo = job.estatus;
        if (estatusPrevio == estatusNuevo) {
          return resolve(SUCCESS_RESP);
        }

        UserModel.findParticipantesByRfp(rfpId, "name email")
          .then((sociosParticipantes) => {
            if (!sociosParticipantes || sociosParticipantes.length == 0) {
              return resolve(SUCCESS_RESP);
            }

            const detalles = {
              rfp: rfpId,
              estatusPrevio: estatusPrevio,
              estatusNuevo: estatusNuevo,
            };
            notificacionUsuarios(CAMBIO_ESTATUS, detalles, sociosParticipantes)
              .then((resp) => {
                const rfpData = {
                  nombreCliente: rfp.nombrecliente,
                  nombreOportunidad: rfp.nombreOportunidad,
                  estatusPrevio: estatusPrevio,
                  estatusNuevo: estatusNuevo,
                };
                if (MAIL_ENABLED) {
                  mailUsuarios(CAMBIO_ESTATUS, rfpData, sociosParticipantes)
                    .then((respMail) => {
                      resolve(respMail);
                    })
                    .catch((error) => reject(error));
                } else {
                  resolve(resp);
                }
              })
              .catch((error) => reject(error));
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
      .select("socioInvolucrado rfpInvolucrado feedback")
      .then((participacion) => {
        const socioId = participacion.socioInvolucrado;
        UserModel.findById(socioId)
          .select("name email")
          .then((socio) => {
            const detalles = { rfp: participacion.rfpInvolucrado };
            notificacionUsuarios(PARTICIPACION_RECHAZADA, detalles, [socio])
              .then((resp) => {
                if (MAIL_ENABLED) {
                  mailRechazoParticipacion(participacion, [socio])
                    .then((respMail) => {
                      resolve(respMail);
                    })
                    .catch((error) => reject(error));
                } else {
                  resolve(resp);
                }
              })
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

const mailRechazoParticipacion = function (participacion, socio) {
  return new Promise((resolve, reject) => {
    const rfpId = participacion.rfpInvolucrado;
    RfpModel.getNombreOportunidad(rfpId)
      .then((nombreOportunidad) => {
        RfpModel.getNombreCliente(rfpId)
          .then((nombreCliente) => {
            const participacionData = {
              nombreCliente: nombreCliente,
              nombreOportunidad: nombreOportunidad,
              feedback: participacion.feedback,
            };
            mailUsuarios(PARTICIPACION_RECHAZADA, participacionData, socio)
              .then((respMail) => {
                resolve(respMail);
              })
              .catch((error) => reject(error));
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
        resolve(SUCCESS_RESP);
      })
      .catch((error) => {
        reject(error);
      });
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

          resolve(SUCCESS_RESP);
        });
      })
      .catch((error) => reject(error));
  });
};

const mailNuevaParticipacion = function (detallesParticipacion, cliente) {
  return new Promise((resolve, reject) => {
    RfpModel.getNombreOportunidad(detallesParticipacion.rfp)
      .then((nombreOportunidad) => {
        UserModel.getName(detallesParticipacion.participante)
          .then((participanteName) => {
            const rfpMail = {
              nombreOportunidad: nombreOportunidad,
              participanteName: participanteName,
            };

            mailUsuarios(NUEVA_PARTICIPACION, rfpMail, cliente)
              .then((respMail) => {
                resolve(respMail);
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
    getClienteRfp(participacion.rfpInvolucrado)
      .then((cliente) => {
        if (!cliente || cliente.length == 0) {
          return resolve(SUCCESS_RESP);
        }

        const detalles = {
          rfp: participacion.rfpInvolucrado,
          participante: participacion.socioInvolucrado,
        };

        notificacionUsuarios(NUEVA_PARTICIPACION, detalles, cliente)
          .then((resp) => {
            if (MAIL_ENABLED) {
              mailNuevaParticipacion(detalles, cliente)
                .then((respMail) => {
                  resolve(respMail);
                })
                .catch((error) => reject(error));
            } else {
              resolve(resp);
            }
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionNuevoEvento = (evento) => {
  return new Promise((resolve, reject) => {
    UserModel.findParticipantesByRfp(evento.rfp, "name email")
      .then((sociosParticipantes) => {
        if (!sociosParticipantes || sociosParticipantes.length == 0) {
          return resolve(SUCCESS_RESP);
        }
        const detalles = {
          rfp: evento.rfp,
          detalles: evento.name,
        };
        notificacionUsuarios(NUEVO_EVENTO, detalles, sociosParticipantes).then(
          (resp) => {
            if (MAIL_ENABLED) {
              mailNuevoEvento(evento, sociosParticipantes)
                .then((respMail) => {
                  resolve(respMail);
                })
                .catch((error) => reject(error));
            } else {
              resolve(SUCCESS_RESP);
            }
          }
        );
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionEventoEliminado = (evento) => {
  return new Promise((resolve, reject) => {
    UserModel.findParticipantesByRfp(evento.rfp, "name email")
      .then((sociosParticipantes) => {
        if (!sociosParticipantes || sociosParticipantes.length == 0) {
          return resolve(SUCCESS_RESP);
        }

        const detalles = {
          rfp: evento.rfp,
          detalles: evento.name,
        };

        notificacionUsuarios(EVENTO_ELIMINADO, detalles, sociosParticipantes)
          .then((resp) => {
            if (MAIL_ENABLED) {
              mailUsuarios(NUEVA_OPORTUNIDAD, job.rfp, users)
                .then((respMail) => {
                  resolve(respMail);
                })
                .catch((error) => reject(error));
            } else {
              resolve(resp);
            }
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

const mailNuevoEvento = function (evento, sociosParticipantes) {
  return new Promise((resolve, reject) => {
    RfpModel.getNombreOportunidad(evento.rfp)
      .then((nombreOportunidad) => {
        const eventData = {
          name: evento.name,
          date: evento.date,
          link: evento.link,
          nombreOportunidad: nombreOportunidad,
        };
        mailUsuarios(NUEVO_EVENTO, eventData, sociosParticipantes)
          .then((resp) => {
            resolve(resp);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionCambioEvento = (eventBeforeUpdate) => {
  return new Promise((resolve, reject) => {
    EventModel.findById(eventBeforeUpdate._id)
      .select("name date link")
      .then((eventUpdated) => {
        if (
          eventBeforeUpdate.name == eventUpdated.name &&
          eventBeforeUpdate.link == eventUpdated.link &&
          eventBeforeUpdate.date.getTime() == eventUpdated.date.getTime()
        ) {
          return resolve(SUCCESS_RESP);
        }

        UserModel.findParticipantesByRfp(eventBeforeUpdate.rfp, "name email")
          .then((sociosParticipantes) => {
            if (!sociosParticipantes || sociosParticipantes.length == 0) {
              return resolve(SUCCESS_RESP);
            }

            // TODO: notificacionUsuarios(CAMBIO_EVENTO, ...) goes here
            if (MAIL_ENABLED) {
              mailCambioEvento(eventBeforeUpdate, eventUpdated, sociosParticipantes)
                .then((respMail) => {
                  resolve(respMail);
                })
                .catch((error) => reject(error));
            } else {
              resolve(SUCCESS_RESP);
            }
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

const mailCambioEvento = function (eventBeforeUpdate, eventUpdated, sociosParticipantes) {
  return new Promise((resolve, reject) => {
    RfpModel.getNombreOportunidad(eventBeforeUpdate.rfp)
      .then((nombreOportunidad) => {
        const eventData = {
          nombreOportunidad: nombreOportunidad,
          eventBeforeUpdate: eventBeforeUpdate,
          eventUpdated: eventUpdated,
        };
        mailUsuarios(CAMBIO_EVENTO, eventData, sociosParticipantes)
          .then((resp) => {
            resolve(resp);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

// get Cliente in an array, so it can be processed by map() in notificacionUsuarios() & mailUsuarios()
const getClienteRfp = function (rfpId) {
  return new Promise((resolve, reject) => {
    RfpModel.getCreatedBy(rfpId)
      .then((userId) => {
        UserModel.find({ _id: userId }, "name email")
          .then((cliente) => {
            resolve(cliente);
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
