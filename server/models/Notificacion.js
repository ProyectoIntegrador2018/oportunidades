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

const Notificacion = mongoose.model("Notifiacion", schema);

module.exports = Notificacion;
