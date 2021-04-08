const DetallesNotificacion = require("../models/DetallesNotificacion");
let detallesNotificacionController = {};

detallesNotificacionController.createDetalles = (detalles) => {
  return new Promise((resolve, reject) => {
    const detallesNotif = new DetallesNotificacion(detalles);
    detallesNotif
      .save()
      .then(() => {
        resolve(detallesNotif);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = detallesNotificacionController;
