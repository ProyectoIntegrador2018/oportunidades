const User = require("../models/User");
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

usuarioNotificacion.deleteUsuarioNotificacion = (id) => {
  return new Promise((resolve, reject) => {
    UsuarioNotificacion.findByIdAndDelete(id)
      .then((usuarioNotif) => {
        User.update(
          { _id: usuarioNotif.user },
          { $pull: { notificaciones: usuarioNotif._id } }
        )
          .then(() => {
            resolve(usuarioNotif);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

usuarioNotificacion.toggleRead = (id) => {
  return new Promise ((resolve, reject) => {
    UsuarioNotificacion.findByIdAndUpdate(id,{read:true})
    .then((notif)=>{
      resolve(notif);
    })
    .catch((error)=>reject(error));
  })
}

module.exports = usuarioNotificacion;
