const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  participante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rfp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RFP",
  },
});

/**
 * Gets DetallesNotificaciones by rfpId
 * @param {String} rfpId
 */
schema.statics.findDetallesNotificacionByRfpId = function (rfpId) {
  return new Promise((resolve, reject) => {
    this.find({ rfp: { $eq: rfpId } })
      .then((detallesNotificaciones) => resolve(detallesNotificaciones))
      .catch((error) => reject(error));
  });
};

/**
 * Deletes many DetallesNOtificacion by ids
 * @param {String} ids
 */
schema.statics.deleteManyDetallesNotificacionByIds = function (ids) {
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

const DetallesNotificacion = mongoose.model("DetallesNotificacion", schema);

module.exports = DetallesNotificacion;
