const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  detalles: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DetallesNotificacion",
  },
});

/**
 * Find Notificacion(s) by DetallesNotificacion ids
 * @param {String} ids
 */
schema.statics.findNotificacionByDetallesNotifIds = function (ids) {
  return new Promise((resolve, reject) => {
    this.find(
      {
        detalles: {
          $in: ids,
        },
      },
      (err, notificaciones) => {
        if (err) {
          reject(err);
        } else {
          resolve(notificaciones);
        }
      }
    );
  });
};

/**
 * Deletes many Notificaciones by Ids
 * @param {String} ids
 */
schema.statics.deleteManyNotificacionByIds = function (ids) {
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

const Notificacion = mongoose.model("Notificacion", schema);

module.exports = Notificacion;
