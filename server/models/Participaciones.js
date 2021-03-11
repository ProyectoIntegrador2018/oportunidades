const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
  rfpInvolucrado: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "RFP",
  },
  socioInvolucrado: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  estatus: {
    type: String, // TODO: agregar require: True cuando se integre con el front
  },
  feedback: {
    type: String,
  },
});

const participaciones = mongoose.model("Participaciones", schema);

module.exports = participaciones;
