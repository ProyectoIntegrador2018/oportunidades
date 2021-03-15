const Notificacion = require("../models/Notificacion");
const notificacionController = {};

notificacionController.createNotificacion = (rawNotificacion) => {
  return new Promise((resolve, reject) => {
    const notificacion = new Notificacion(rawNotificacion);
    notificacion
      .save()
      .then(() => {
        resolve(notificacion);
      })
      .catch((error) => {
        reject(error);
      });
    return;
  });
};

module.exports = notificacionController;
