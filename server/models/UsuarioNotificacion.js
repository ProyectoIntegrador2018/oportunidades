const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  read: {
    type: Boolean,
    default: false,
  },
  notificacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notifiacion",
  },
  usuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const UsuarioNotifiacion = mongoose.model("Notifiacion", schema);

module.exports = UsuarioNotifiacion;
