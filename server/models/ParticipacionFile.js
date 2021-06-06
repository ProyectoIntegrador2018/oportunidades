const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
  },

  originalname:{
    type: String,
  },

  participacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "participaciones",
  },
});

const ParticipacionFile = mongoose.model("ParticipacionFile", schema);

module.exports = ParticipacionFile;
