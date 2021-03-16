const UserModel = require("../models/User");
const notificationTypes = require("../utils/NotificationTypes");
const detallesNotifController = require("../controllers/DetallesNotificacionController");
const notificacionController = require("../controllers/NotificacionController");
const usuarioNotificacion = require("../controllers/UsuarioNotificacionController");
const mailService = require("../services/MailService");

const notificationService = {};

notificationService.notificacionNuevaOportunidad = (rfp) => {
  return new Promise((resolve, reject) => {
    const detalles = { rfp: rfp._id };
    detallesNotifController
      .createDetalles(detalles)
      .then((detallesNotif) => {
        const rawNotificacion = {
          tipo: notificationTypes.NUEVA_OPORTUNIDAD,
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
          mailService.sendEmail(notificationTypes.NUEVA_OPORTUNIDAD, rfp, socios);
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
          resolve(rfp);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = notificationService;
