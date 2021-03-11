const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rfp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RFP",
  },
});

const DetallesNotificacion = mongoose.model("DetallesNotificacion", schema);

module.exports = DetallesNotificacion;
