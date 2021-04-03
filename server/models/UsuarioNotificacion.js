const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  read: {
    type: Boolean,
    default: false,
  },
  notificacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notificacion",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

/**
 * Find UsuarioNotificacion(s) by ids
 * @param {String} ids
 */
schema.statics.findUsuarioNotificacionByNotificacionIds = function (ids) {
  return new Promise((resolve, reject) => {
    this.find(
      {
        notificacion: {
          $in: ids,
        },
      },
      (err, usuarioNotificacion) => {
        if (err) {
          reject(err);
        } else {
          resolve(usuarioNotificacion);
        }
      }
    );
  });
};

/**
 * Delete many UsuarioNotificacion by ids
 * @param {String} ids
 */
schema.statics.deleteManyUsuarioNotifByIds = function (ids) {
  return new Promise((resolve, reject) => {
    this.deleteMany(
      {
        _id: {
          $in: ids,
        },
      },
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const UsuarioNotificacion = mongoose.model("UsuarioNotificacion", schema);

module.exports = UsuarioNotificacion;
