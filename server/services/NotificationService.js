const UserModel = require("../models/User");
const detallesNotifController = require("../controllers/DetallesNotificacionController");
const notificacionController = require("../controllers/NotificacionController");
const usuarioNotificacion = require("../controllers/UsuarioNotificacionController");

const notificationService = {};

notificationService.notificacionNuevaOportunidad = (rfp) => {
  return new Promise((resolve, reject) => {
    const detalles = { rfp: rfp._id };
    detallesNotifController
      .createDetalles(detalles)
      .then((detallesNotif) => {
        console.log("esto es un nuevo detalles notif", detallesNotif);
        const rawNotificacion = {
          tipo: "NUEVA_OPORTUNIDAD",
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
        console.log("esta es la notificacion", notificacion);
        UserModel.findByUserType("socio").then((socios) => {
          console.log("estos son los socios", socios);
          socios.map((socio) => {
            const rawUsuarioNotif = {
              read: false,
              notificacion: notificacion._id,
              user: socio._id,
            };
            usuarioNotificacion
              .createUsuarioNotificacion(rawUsuarioNotif)
              .then((usuarioNotif) => {
                console.log("esto es un usuario notif", usuarioNotif);
                UserModel.findById(socio._id)
                  .then((user) => {
                    user.addNotificacion(usuarioNotif._id);
                    console.log("esto es un user", user);
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
