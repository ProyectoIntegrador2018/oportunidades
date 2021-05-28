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
  PARTICIPACION_GANADOR,
  EVENTO_ELIMINADO,
  OPORTUNIDAD_CERRADA_NO_PARTICIPACIONES,
} = require("../utils/NotificationTypes");
const detallesNotifController = require("../controllers/DetallesNotificacionController");
const notificacionController = require("../controllers/NotificacionController");
const usuarioNotificacion = require("../controllers/UsuarioNotificacionController");
const mailService = require("./MailService");
const mailQueue = require("./MailQueue");

const notificationService = {};
const SUCCESS_RESP = { success: 1 };
const MAIL_ENABLED = process.env.MAIL_ENABLED === "true" ? true : false;

notificationService.notificacionNuevaOportunidad = (job) => {
  const rfp = job.data.rfp;
  return new Promise((resolve, reject) => {
    UserModel.findByUserTypes(["socio", "admin"], "name email")
      .then((users) => {
        if (!users || users.length == 0) {
          return resolve(SUCCESS_RESP);
        }

        const detalles = { rfp: rfp._id };
        notificacionUsuarios(NUEVA_OPORTUNIDAD, detalles, users)
          .then((resp) => {
            if (MAIL_ENABLED) {
              mailUsuarios(NUEVA_OPORTUNIDAD, rfp, users)
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
  const { nombreCliente, nombreOportunidad } = job.data;
  return new Promise((resolve, reject) => {
    UserModel.findByUserType("socio", "name email")
      .then((socios) => {
        if (!socios || socios.length == 0) {
          return resolve(SUCCESS_RESP);
        }

        const detalles = {
          nombreCliente: nombreCliente,
          detalles: nombreOportunidad,
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
    const {
      rfpId,
      estatusPrevio,
      estatusNuevo,
      nombrecliente,
      nombreOportunidad,
    } = job.data;

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
              nombreCliente: nombrecliente,
              nombreOportunidad: nombreOportunidad,
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
  });
};

notificationService.notificacionOportunidadCerradaNoParticipaciones = (job) => {
  const { rfpId, clienteId, nombreOportunidad } = job.data;
  return new Promise((resolve, reject) => {
    const detalles = {
      rfp: rfpId,
      detalles: nombreOportunidad,
    };
    UserModel.findById(clienteId)
      .then((cliente) => {
        notificacionUsuarios(OPORTUNIDAD_CERRADA_NO_PARTICIPACIONES, detalles, [
          cliente,
        ])
          .then((resp) => resolve(resp))
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

notificationService.notificacionCambioEstatusParticipante = (job) => {
  return new Promise((resolve, reject) => {
    const { participacionId, estatus } = job.data;
    ParticipacionModel.findById(participacionId)
      .select("socioInvolucrado rfpInvolucrado feedback")
      .then((participacion) => {
        const socioId = participacion.socioInvolucrado;
        UserModel.findById(socioId)
          .select("name email")
          .then((socio) => {
            const notifType =
              estatus === "Rechazado"
                ? PARTICIPACION_RECHAZADA
                : PARTICIPACION_GANADOR;
            const detalles = { rfp: participacion.rfpInvolucrado };
            notificacionUsuarios(notifType, detalles, [socio])
              .then((resp) => {
                if (MAIL_ENABLED) {
                  mailCambioEstatusParticipante(notifType, participacion, [
                    socio,
                  ])
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

const mailCambioEstatusParticipante = function (
  notifType,
  participacion,
  socio
) {
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
            mailUsuarios(notifType, participacionData, socio)
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

notificationService.notificacionNuevaParticipacion = (job) => {
  const participacion = job.data.participacion;
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

notificationService.notificacionNuevoEvento = (job) => {
  const evento = job.data.newEvent;
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


notificationService.notificacionEventoEliminado = (job) => {
  const evento = job.data.deletedEvent;
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
            RfpModel.getNombreOportunidad(evento.rfp)
            .then((nombreOportunidad) => {
              RfpModel.getNombreCliente(evento.rfp)
              .then((nombrecliente)=>{
                const eventData = {
                  name: evento.name,
                  nombreOportunidad: nombreOportunidad,
                  nombreCliente: nombrecliente,
                };
                mailUsuarios(EVENTO_ELIMINADO, eventData, sociosParticipantes)
                  .then((resp) => {
                    resolve(resp);
                  })
                  .catch((error) => reject(error));
              })
              .catch((error)=>(error));
              
            })
            .catch((error) => reject(error));
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

notificationService.notificacionCambioEvento = (job) => {
  const eventBeforeUpdate = job.data.eventUpdated;
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

            const detalles = {
              rfp: eventBeforeUpdate.rfp,
              nombreEventoPrevio: eventBeforeUpdate.name,
              nombreEventoNuevo: eventUpdated.name,
              juntaEventoPrevio: eventBeforeUpdate.date,
              juntaEventoNuevo: eventUpdated.date,
              cambioLink: eventBeforeUpdate.link !== eventUpdated.link,
            };
            notificacionUsuarios(CAMBIO_EVENTO, detalles, sociosParticipantes)
              .then((resp) => {
                if (MAIL_ENABLED) {
                  mailCambioEvento(
                    eventBeforeUpdate,
                    eventUpdated,
                    sociosParticipantes
                  )
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
      })
      .catch((error) => reject(error));
  });
};

const mailCambioEvento = function (
  eventBeforeUpdate,
  eventUpdated,
  sociosParticipantes
) {
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

module.exports = notificationService;
