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

const UsuarioNotificacion = mongoose.model("UsuarioNotificacion", schema);

module.exports = UsuarioNotificacion;