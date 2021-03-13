const UsuarioNotificacion = require("../models/UsuarioNotificacion");
const usuarioNotificacion = {};

usuarioNotificacion.createUsuarioNotificacion = (rawUsuarioNotif) => {
  return new Promise((resolve, reject) => {
    const usuarioNotif = new UsuarioNotificacion(rawUsuarioNotif);
    usuarioNotif
      .save()
      .then(() => {
        resolve(usuarioNotif);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = usuarioNotificacion;
